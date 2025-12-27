import { LANGUAGE_COLORS, getLanguageLabel } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LanguageBadgeProps {
  language: string;
  size?: 'sm' | 'md';
}

export function LanguageBadge({ language, size = 'md' }: LanguageBadgeProps) {
  const colorClass = LANGUAGE_COLORS[language] || 'bg-gray-500';
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorClass,
        'text-white'
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
      {getLanguageLabel(language)}
    </span>
  );
}
