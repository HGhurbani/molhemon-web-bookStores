import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api.js';
import { useAuth } from './authContext.jsx';
import logger from './logger.js';

const FavoritesContext = createContext(null);

const LOCAL_STORAGE_KEY = 'molhemon:favorites';
const isBrowser = typeof window !== 'undefined';

const getItemKey = (item, fallbackIndex = 0) => {
  if (!item || typeof item !== 'object') {
    return `${fallbackIndex}`;
  }

  const key =
    item.id ??
    item.bookId ??
    item.slug ??
    item.handle ??
    item.productId ??
    item.isbn;

  if (key === undefined || key === null) {
    try {
      return JSON.stringify(item);
    } catch (error) {
      return `${fallbackIndex}`;
    }
  }

  return String(key);
};

const readLocalFavorites = () => {
  if (!isBrowser) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    logger.warn('Failed to read favorites from localStorage, falling back to empty list', error);
    return [];
  }
};

const writeLocalFavorites = (items) => {
  if (!isBrowser) {
    return;
  }

  try {
    const safeItems = Array.isArray(items) ? items : [];
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(safeItems));
  } catch (error) {
    logger.warn('Failed to persist favorites to localStorage', error);
  }
};

const mergeFavorites = (remote = [], local = []) => {
  const merged = new Map();

  remote.forEach((item, index) => {
    const key = getItemKey(item, index);
    if (!merged.has(key)) {
      merged.set(key, item);
    }
  });

  local.forEach((item, index) => {
    const key = getItemKey(item, index + merged.size);
    if (!merged.has(key)) {
      merged.set(key, item);
    }
  });

  return Array.from(merged.values());
};

const normalizeFavorites = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter(Boolean)
    .map((item) => ({ ...item }))
    .sort((a, b) => {
      const keyA = getItemKey(a);
      const keyB = getItemKey(b);
      return keyA.localeCompare(keyB);
    });

const favoritesAreEqual = (first = [], second = []) => {
  const normalizedFirst = normalizeFavorites(first);
  const normalizedSecond = normalizeFavorites(second);

  if (normalizedFirst.length !== normalizedSecond.length) {
    return false;
  }

  return normalizedFirst.every((item, index) => {
    const other = normalizedSecond[index];
    return JSON.stringify(item) === JSON.stringify(other);
  });
};

export const FavoritesProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [favorites, setFavoritesState] = useState(() => readLocalFavorites());

  useEffect(() => {
    let isMounted = true;

    const initializeFavorites = async () => {
      const localFavorites = readLocalFavorites();

      if (!currentUser) {
        if (isMounted) {
          setFavoritesState(localFavorites);
        }
        return;
      }

      try {
        const remoteFavorites = await api.userData.getFavorites(currentUser.uid);
        const remoteList = Array.isArray(remoteFavorites) ? remoteFavorites : [];
        const mergedFavorites = mergeFavorites(remoteList, localFavorites);

        if (isMounted) {
          setFavoritesState(mergedFavorites);
        }
        writeLocalFavorites(mergedFavorites);

        if (!favoritesAreEqual(remoteList, mergedFavorites)) {
          try {
            await api.userData.saveFavorites(currentUser.uid, mergedFavorites);
          } catch (syncError) {
            logger.error('Failed to synchronize favorites with the server', syncError);
          }
        }
      } catch (error) {
        logger.warn('Unable to load remote favorites, falling back to local storage', error);
        if (isMounted) {
          setFavoritesState(localFavorites);
        }
      }
    };

    initializeFavorites();

    return () => {
      isMounted = false;
    };
  }, [currentUser?.uid]);

  const persistFavorites = useCallback(
    (nextFavorites) => {
      const safeFavorites = Array.isArray(nextFavorites) ? nextFavorites : [];
      writeLocalFavorites(safeFavorites);

      if (currentUser) {
        api.userData.saveFavorites(currentUser.uid, safeFavorites).catch((error) => {
          logger.error('Failed to persist favorites remotely', error);
        });
      }
    },
    [currentUser?.uid]
  );

  const updateFavorites = useCallback(
    (updater) => {
      setFavoritesState((previousFavorites) => {
        const result = typeof updater === 'function' ? updater(previousFavorites) : updater;
        const normalizedResult = Array.isArray(result) ? result : [];
        if (favoritesAreEqual(previousFavorites, normalizedResult)) {
          return previousFavorites;
        }
        persistFavorites(normalizedResult);
        return normalizedResult;
      });
    },
    [persistFavorites]
  );

  const toggleFavorite = useCallback(
    (book) => {
      if (!book) {
        return;
      }

      updateFavorites((previousFavorites) => {
        const key = getItemKey(book);
        const exists = previousFavorites.some((item) => getItemKey(item) === key);

        if (exists) {
          return previousFavorites.filter((item) => getItemKey(item) !== key);
        }

        return [...previousFavorites, book];
      });
    },
    [updateFavorites]
  );

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
