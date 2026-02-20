import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: 'es' | 'en';
  onLanguageChange: (lang: 'es' | 'en') => void;
}

const LanguageSelector = ({ currentLang, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'es' as const, name: 'ES', flag: '🇪🇸' },
    { code: 'en' as const, name: 'EN', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find((l) => l.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-cream/5 border border-cream/10 hover:border-gold/50 transition-all duration-300 group"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-cream/70 text-sm font-medium group-hover:text-gold transition-colors">
          {currentLanguage?.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-cream/50 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 p-2 rounded-2xl bg-dark-light/95 backdrop-blur-xl border border-cream/10 z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  currentLang === lang.code
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream/70 hover:bg-cream/5 hover:text-cream'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
