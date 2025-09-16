import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api.js';
import { useAuth } from './authContext.jsx';
import logger from './logger.js';

const CartContext = createContext(null);

const LOCAL_STORAGE_KEY = 'molhemon:cart';
const isBrowser = typeof window !== 'undefined';

const getCartItemKey = (item, fallbackIndex = 0) => {
  if (!item || typeof item !== 'object') {
    return `${fallbackIndex}`;
  }

  const key =
    item.id ??
    item.productId ??
    item.bookId ??
    item.variantId ??
    item.sku ??
    item.slug;

  if (key === undefined || key === null) {
    try {
      return JSON.stringify(item);
    } catch (error) {
      return `${fallbackIndex}`;
    }
  }

  return String(key);
};

const ensureCartItemShape = (item) => {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const quantity = Number.isFinite(item.quantity) ? Math.max(1, item.quantity) : 1;

  return {
    ...item,
    quantity
  };
};

const normalizeCartItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map(ensureCartItemShape)
    .filter(Boolean)
    .sort((a, b) => {
      const keyA = getCartItemKey(a);
      const keyB = getCartItemKey(b);
      return keyA.localeCompare(keyB);
    });

const cartsAreEqual = (first = [], second = []) => {
  const normalizedFirst = normalizeCartItems(first);
  const normalizedSecond = normalizeCartItems(second);

  if (normalizedFirst.length !== normalizedSecond.length) {
    return false;
  }

  return normalizedFirst.every((item, index) => {
    const other = normalizedSecond[index];
    return JSON.stringify(item) === JSON.stringify(other);
  });
};

const readLocalCart = () => {
  if (!isBrowser) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return normalizeCartItems(parsed);
  } catch (error) {
    logger.warn('Failed to read cart from localStorage, falling back to empty cart', error);
    return [];
  }
};

const writeLocalCart = (items) => {
  if (!isBrowser) {
    return;
  }

  try {
    const safeItems = normalizeCartItems(items);
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeItems));
  } catch (error) {
    logger.warn('Failed to persist cart to localStorage', error);
  }
};

const mergeCartItems = (remote = [], local = []) => {
  const merged = new Map();

  normalizeCartItems(remote).forEach((item, index) => {
    const key = getCartItemKey(item, index);
    merged.set(key, item);
  });

  normalizeCartItems(local).forEach((item, index) => {
    const key = getCartItemKey(item, index + merged.size);
    if (merged.has(key)) {
      const existing = merged.get(key);
      const quantity = (existing.quantity ?? 1) + (item.quantity ?? 1);
      merged.set(key, { ...existing, quantity });
    } else {
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCartState] = useState(() => readLocalCart());

  useEffect(() => {
    let isMounted = true;

    const initializeCart = async () => {
      const localCart = readLocalCart();

      if (!currentUser) {
        if (isMounted) {
          setCartState(localCart);
        }
        return;
      }

      try {
        const remoteCart = await api.userData.getCart(currentUser.uid);
        const remoteItems = Array.isArray(remoteCart) ? remoteCart : [];
        const mergedCart = mergeCartItems(remoteItems, localCart);

        if (isMounted) {
          setCartState(mergedCart);
        }
        writeLocalCart(mergedCart);

        if (!cartsAreEqual(remoteItems, mergedCart)) {
          try {
            await api.userData.saveCart(currentUser.uid, mergedCart);
          } catch (syncError) {
            logger.error('Failed to synchronize cart with the server', syncError);
          }
        }
      } catch (error) {
        logger.warn('Unable to load remote cart, falling back to local storage', error);
        if (isMounted) {
          setCartState(localCart);
        }
      }
    };

    initializeCart();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  const persistCart = useCallback(
    (nextCart) => {
      const safeCart = normalizeCartItems(nextCart);
      writeLocalCart(safeCart);

      if (currentUser) {
        api.userData.saveCart(currentUser.uid, safeCart).catch((error) => {
          logger.error('Failed to persist cart remotely', error);
        });
      }
    },
    [currentUser?.uid]
  );

  const applyCartUpdate = useCallback(
    (updater) => {
      setCartState((previousCart) => {
        const result = typeof updater === 'function' ? updater(previousCart) : updater;
        const normalizedResult = normalizeCartItems(result);

        if (cartsAreEqual(previousCart, normalizedResult)) {
          return previousCart;
        }

        persistCart(normalizedResult);
        return normalizedResult;
      });
    },
    [persistCart]
  );

  const setCart = useCallback(
    (value) => {
      applyCartUpdate(value);
    },
    [applyCartUpdate]
  );

  const addToCart = useCallback(
    (item) => {
      if (!item) {
        return;
      }

      applyCartUpdate((previousCart) => {
        const normalizedItem = ensureCartItemShape(item);
        if (!normalizedItem) {
          return previousCart;
        }

        const key = getCartItemKey(normalizedItem);
        const index = previousCart.findIndex((cartItem) => getCartItemKey(cartItem) === key);

        if (index !== -1) {
          const updatedCart = [...previousCart];
          const existingItem = updatedCart[index];
          const quantity = (existingItem.quantity ?? 1) + (normalizedItem.quantity ?? 1);
          updatedCart[index] = { ...existingItem, quantity };
          return updatedCart;
        }

        return [...previousCart, normalizedItem];
      });
    },
    [applyCartUpdate]
  );

  const removeFromCart = useCallback(
    (identifier) => {
      if (identifier === undefined || identifier === null) {
        return;
      }

      const identifierString = String(identifier);

      applyCartUpdate((previousCart) =>
        previousCart.filter((item, index) => {
          if (item?.id !== undefined && item?.id !== null) {
            return String(item.id) !== identifierString;
          }

          const key = getCartItemKey(item, index);
          return key !== identifierString;
        })
      );
    },
    [applyCartUpdate]
  );

  const updateQuantity = useCallback(
    (identifier, quantity) => {
      if (identifier === undefined || identifier === null) {
        return;
      }

      const safeQuantity = Number.isFinite(quantity) ? Math.max(1, quantity) : 1;
      const identifierString = String(identifier);

      applyCartUpdate((previousCart) =>
        previousCart.map((item, index) => {
          const matchesId = item?.id !== undefined && item?.id !== null && String(item.id) === identifierString;
          const matchesKey = getCartItemKey(item, index) === identifierString;

          if (matchesId || matchesKey) {
            return { ...item, quantity: safeQuantity };
          }

          return item;
        })
      );
    },
    [applyCartUpdate]
  );

  const clearCart = useCallback(() => {
    applyCartUpdate([]);
  }, [applyCartUpdate]);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
