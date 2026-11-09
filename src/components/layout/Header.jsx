import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

export default function Header({ 
  title, 
  subtitle,
  onActionClick,
  actionText,
  actionIcon: ActionIcon = Plus,
  showDate = true
}) {
  const { t, language } = useLanguage();
  const defaultTitle = t('invTitle');
  const defaultSubtitle = t('invSubtitle');
  const defaultActionText = t('newProductBtn');

  const todayFormatted = new Date().toLocaleDateString(
    language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#171717] font-['Plus_Jakarta_Sans']">
          {title || defaultTitle}
        </h1>
        <p className="text-sm text-[#888888] mt-1">
          {subtitle || defaultSubtitle}
        </p>
      </div>

      {/* Date Pill & Action Button */}
      <div className="flex items-center gap-3 self-start md:self-auto">
        {showDate && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EAEAEA] text-xs font-medium text-[#666666] shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#888888]" />
            <span>{todayFormatted}</span>
          </div>
        )}

        {(actionText || defaultActionText) && (
          <button
            onClick={onActionClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7900] hover:bg-[#EA6E00] active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all duration-150"
          >
            <ActionIcon className="w-4 h-4 stroke-[2.5]" />
            <span>{actionText !== undefined ? actionText : defaultActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
}

