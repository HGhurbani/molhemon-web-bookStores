import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === book.id);
      return exists ? prev.filter(item => item.id !== book.id) : [...prev, book];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
