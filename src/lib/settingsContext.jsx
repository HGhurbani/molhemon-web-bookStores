import React, { createContext, useContext, useState } from 'react';
import { siteSettings as defaultSettings } from '@/data/siteData.js';
import api from './api.js';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const refreshSettings = async (force = false) => {
    const remote = await api.getSettings(force);
    setSettings(remote);
    return remote;
  };
  return (
    <SettingsContext.Provider value={{ settings, setSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
