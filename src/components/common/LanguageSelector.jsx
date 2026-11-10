import React, { useState } from 'react';
import { useLanguage, AVAILABLE_LANGUAGES } from '../../context/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const currentLang = AVAILABLE_LANGUAGES.find(l => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-xl border border-[#EAEAEA] dark:border-[#27282E] bg-white dark:bg-[#1C1D22] hover:bg-neutral-50 dark:hover:bg-[#25262C] text-xs font-semibold text-[#171717] dark:text-[#F4F4F6] transition shadow-xs cursor-pointer"
        title="Tilni tanlash / Select Language"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="uppercase text-[11px] font-bold tracking-wider">{currentLang.code}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#888888] dark:text-[#A1A1AA]" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#18191D] rounded-2xl shadow-xl border border-[#EAEAEA] dark:border-[#27282E] py-1.5 z-40 animate-in fade-in">
            {AVAILABLE_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs text-left font-medium flex items-center justify-between transition cursor-pointer ${
                  language === l.code 
                    ? 'bg-orange-50/80 dark:bg-orange-500/10 text-[#FF7900] font-bold' 
                    : 'text-[#171717] dark:text-[#F4F4F6] hover:bg-neutral-50 dark:hover:bg-[#222329]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                </div>
                {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#FF7900]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

