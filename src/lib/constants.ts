export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: 'JS' },
  { value: 'python', label: 'Python', icon: 'PY' },
  { value: 'java', label: 'Java', icon: 'JV' },
  { value: 'cpp', label: 'C++', icon: 'C++' },
  { value: 'c', label: 'C', icon: 'C' },
  { value: 'html', label: 'HTML', icon: 'HTML' },
  { value: 'css', label: 'CSS', icon: 'CSS' },
  { value: 'sql', label: 'SQL', icon: 'SQL' },
] as const;

export type LanguageValue = typeof LANGUAGES[number]['value'];

export const LANGUAGE_COLORS: Record<string, string> = {
  javascript: 'bg-yellow-500',
  python: 'bg-blue-500',
  java: 'bg-orange-500',
  cpp: 'bg-purple-500',
  c: 'bg-gray-500',
  html: 'bg-red-500',
  css: 'bg-cyan-500',
  sql: 'bg-green-500',
};

export const getLanguageLabel = (value: string): string => {
  return LANGUAGES.find(lang => lang.value === value)?.label || value;
};
