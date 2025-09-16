import { SUPPORTED_LANGUAGES } from './languages.js';

const sanitizeLanguageEntry = (entry = {}) => {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const { code, name, label, ...rest } = entry;

  if (!code) {
    return null;
  }

  const resolvedName = name ?? label ?? '';
  const resolvedLabel = label ?? name ?? '';

  return {
    ...rest,
    code,
    name: resolvedName,
    label: resolvedLabel,
  };
};

export const normalizeLanguages = (languages = []) =>
  languages
    .map(sanitizeLanguageEntry)
    .filter((language) => language !== null);

export const defaultLanguages = normalizeLanguages(
  SUPPORTED_LANGUAGES.map(({ code, label }) => ({ code, name: label, label })),
);

export const ensureLanguageList = (languages) => {
  const normalized = normalizeLanguages(languages);
  return normalized.length ? normalized : defaultLanguages;
};

const getStorage = () => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null;
  }
  return window.localStorage;
};

export const getStoredLanguages = () => {
  const storage = getStorage();
  if (!storage) {
    return defaultLanguages;
  }

  try {
    const stored = storage.getItem('languages');
    if (!stored) {
      return defaultLanguages;
    }

    const parsed = JSON.parse(stored);
    return ensureLanguageList(parsed);
  } catch (error) {
    console.warn('Failed to parse stored languages', error);
    return defaultLanguages;
  }
};

export const storeLanguages = (languages) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    const prepared = ensureLanguageList(languages);
    storage.setItem('languages', JSON.stringify(prepared));
  } catch (error) {
    console.warn('Failed to persist languages', error);
  }
};

export const getStoredLanguageCode = () => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  try {
    return storage.getItem('language');
  } catch (error) {
    console.warn('Failed to read stored language code', error);
    return null;
  }
};

export const storeLanguageCode = (code) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  try {
    if (code) {
      storage.setItem('language', code);
    } else {
      storage.removeItem('language');
    }
  } catch (error) {
    console.warn('Failed to persist language code', error);
  }
};
