import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
];

const createEmptyTranslations = () =>
  SUPPORTED_LANGUAGES.reduce((acc, { code }) => {
    acc[code] = {};
    return acc;
  }, {});

const createEmptyNewValues = () =>
  SUPPORTED_LANGUAGES.reduce((acc, { code }) => {
    acc[code] = '';
    return acc;
  }, {});

const DashboardLanguages = () => {
  const { i18n } = useTranslation();
  const [translations, setTranslations] = useState(createEmptyTranslations);
  const [editingKey, setEditingKey] = useState(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState(createEmptyNewValues);
  const [loading, setLoading] = useState(true);
  const [savingLanguages, setSavingLanguages] = useState([]);
  const [error, setError] = useState(null);

  const loadTranslations = useCallback(
    async ({ withLoader = true, resetError = true } = {}) => {
      if (withLoader) {
        setLoading(true);
      }

      let success = false;

      try {
        const entries = await Promise.all(
          SUPPORTED_LANGUAGES.map(async ({ code }) => {
            const response = await fetch(`/api/translations/${code}`);

            if (response.status === 404) {
              return [code, {}];
            }

            if (!response.ok) {
              const details = await response.text();
              throw new Error(details || `Failed to load translations for ${code}`);
            }

            const data = await response.json();
            return [code, data];
          }),
        );

        setTranslations(Object.fromEntries(entries));

        if (resetError) {
          setError(null);
        }

        success = true;
      } catch (loadError) {
        console.error('Failed to load translations', loadError);
        if (resetError) {
          setError('تعذر تحميل الترجمات. يرجى المحاولة مرة أخرى.');
        }
      } finally {
        if (withLoader) {
          setLoading(false);
        }
      }

      return success;
    },
    [],
  );

  useEffect(() => {
    loadTranslations();
  }, [loadTranslations]);

  const setLanguageSavingState = useCallback((language, active) => {
    setSavingLanguages((prev) => {
      if (active) {
        return prev.includes(language) ? prev : [...prev, language];
      }

      return prev.filter((code) => code !== language);
    });
  }, []);

  const persistTranslations = useCallback(
    async (language, updatedTranslations) => {
      setTranslations((prev) => ({
        ...prev,
        [language]: updatedTranslations,
      }));

      setLanguageSavingState(language, true);
      setError(null);

      let success = false;

      try {
        const response = await fetch(`/api/translations/${language}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ translations: updatedTranslations }),
        });

        if (!response.ok) {
          const details = await response.text();
          throw new Error(details || 'Failed to save translations');
        }

        await i18n.reloadResources([language]);
        success = true;
      } catch (saveError) {
        console.error('Failed to save translations', saveError);
        setError('تعذر حفظ التغييرات. يرجى المحاولة مرة أخرى.');
        await loadTranslations({ withLoader: false, resetError: false });
      } finally {
        setLanguageSavingState(language, false);
      }

      return success;
    },
    [i18n, loadTranslations, setLanguageSavingState],
  );

  const handleSaveTranslation = useCallback(
    async (key, language, value) => {
      if (!translations[language]) {
        setEditingKey(null);
        return;
      }

      const nextValue = value ?? '';

      if (translations[language][key] === nextValue) {
        setEditingKey(null);
        return;
      }

      await persistTranslations(language, {
        ...translations[language],
        [key]: nextValue,
      });

      setEditingKey(null);
    },
    [persistTranslations, translations],
  );

  const handleAddTranslation = async () => {
    const trimmedKey = newKey.trim();

    if (!trimmedKey) {
      return;
    }

    setError(null);

    const missingValue = SUPPORTED_LANGUAGES.some(({ code }) => !newValue[code].trim());
    if (missingValue) {
      setError('يرجى إدخال الترجمة لجميع اللغات.');
      return;
    }

    const keyExists = SUPPORTED_LANGUAGES.some(
      ({ code }) => translations[code] && Object.prototype.hasOwnProperty.call(translations[code], trimmedKey),
    );

    if (keyExists) {
      setError('هذا المفتاح موجود مسبقًا.');
      return;
    }

    const results = await Promise.all(
      SUPPORTED_LANGUAGES.map(({ code }) =>
        persistTranslations(code, {
          ...translations[code],
          [trimmedKey]: newValue[code],
        }),
      ),
    );

    if (results.every(Boolean)) {
      setNewKey('');
      setNewValue(createEmptyNewValues());
    }
  };

  const handleDeleteTranslation = async (key) => {
    const results = await Promise.all(
      SUPPORTED_LANGUAGES.map(({ code }) => {
        const updated = { ...(translations[code] || {}) };
        delete updated[key];
        return persistTranslations(code, updated);
      }),
    );

    if (!results.every(Boolean)) {
      await loadTranslations({ withLoader: false, resetError: false });
    }
  };

  const handleNewValueChange = (language, value) => {
    setNewValue((prev) => ({
      ...prev,
      [language]: value,
    }));
  };

  const translationKeys = useMemo(() => {
    const primaryLanguage = SUPPORTED_LANGUAGES[0]?.code;
    return Object.keys(translations[primaryLanguage] || {});
  }, [translations]);

  const isSaving = savingLanguages.length > 0;

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">إدارة اللغات والترجمات</h2>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {isSaving && <p className="text-sm text-blue-600 mb-4">جارٍ حفظ التغييرات...</p>}

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">إضافة ترجمة جديدة</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="مفتاح الترجمة"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              disabled={loading || isSaving}
            />
            <Input
              placeholder="القيمة بالعربية"
              value={newValue.ar}
              onChange={(e) => handleNewValueChange('ar', e.target.value)}
              disabled={loading || isSaving}
            />
            <Input
              placeholder="القيمة بالإنجليزية"
              value={newValue.en}
              onChange={(e) => handleNewValueChange('en', e.target.value)}
              disabled={loading || isSaving}
            />
            <Button onClick={handleAddTranslation} className="bg-blue-600 text-white" disabled={loading || isSaving}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">المفتاح</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">العربية</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                    جارٍ تحميل الترجمات...
                  </td>
                </tr>
              )}

              {!loading && translationKeys.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-sm text-gray-500 text-center">
                    لا توجد ترجمات متاحة بعد.
                  </td>
                </tr>
              )}

              {!loading &&
                translationKeys.map((key) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingKey === `${key}-ar` ? (
                        <Input
                          defaultValue={translations.ar?.[key] ?? ''}
                          onBlur={(e) => handleSaveTranslation(key, 'ar', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTranslation(key, 'ar', e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingKey(`${key}-ar`)}
                          className="cursor-pointer hover:bg-gray-100 p-1 rounded block"
                        >
                          {translations.ar?.[key] ?? ''}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingKey === `${key}-en` ? (
                        <Input
                          defaultValue={translations.en?.[key] ?? ''}
                          onBlur={(e) => handleSaveTranslation(key, 'en', e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveTranslation(key, 'en', e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => setEditingKey(`${key}-en`)}
                          className="cursor-pointer hover:bg-gray-100 p-1 rounded block"
                        >
                          {translations.en?.[key] ?? ''}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingKey(`${key}-ar`)}
                          className="p-1 text-blue-600 hover:text-blue-700"
                          type="button"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTranslation(key)}
                          className="p-1 text-red-600 hover:text-red-700"
                          type="button"
                          disabled={isSaving}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardLanguages;
