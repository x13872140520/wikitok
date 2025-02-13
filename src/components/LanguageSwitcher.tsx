import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageIcon } from '@heroicons/react/24/outline';

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = {
    en: t('languages.en'),
    zh: t('languages.zh'),
    fr: t('languages.fr'),
    de: t('languages.de'),
    ja: t('languages.ja'),
    ko: t('languages.ko'),
    es: t('languages.es')
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="absolute left-4 top-4 z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors flex items-center gap-2 text-white"
        title={t('changeLanguage')}
      >
        <LanguageIcon className="w-6 h-6" />
        <span className="text-sm">{languages[i18n.language as keyof typeof languages]}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-gray-800/90 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  i18n.language === code
                    ? 'text-blue-400 bg-gray-700/50'
                    : 'text-white hover:bg-gray-700/50'
                }`}
                role="menuitem"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};