import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGES } from '@/lib/constants';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  languageFilter: string;
  onLanguageChange: (language: string) => void;
  tagFilter: string;
  onTagChange: (tag: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  availableTags: string[];
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  languageFilter,
  onLanguageChange,
  tagFilter,
  onTagChange,
  sortOrder,
  onSortChange,
  availableTags,
}: SearchFiltersProps) {
  const hasFilters = searchQuery || languageFilter !== 'all' || tagFilter !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onLanguageChange('all');
    onTagChange('all');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={languageFilter} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All languages</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tagFilter} onValueChange={onTagChange}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {availableTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(v) => onSortChange(v as 'newest' | 'oldest')}>
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 px-2">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
