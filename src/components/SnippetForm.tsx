import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CodeEditor } from './CodeEditor';
import { LANGUAGES } from '@/lib/constants';
import { Snippet, SnippetFormData } from '@/types/snippet';
import { Save, X } from 'lucide-react';

interface SnippetFormProps {
  snippet?: Snippet | null;
  onSubmit: (data: SnippetFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function SnippetForm({ snippet, onSubmit, onCancel, loading }: SnippetFormProps) {
  const [formData, setFormData] = useState<SnippetFormData>({
    title: '',
    language: 'javascript',
    code: '',
    description: '',
    tags: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SnippetFormData, string>>>({});

  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        description: snippet.description || '',
        tags: snippet.tags?.join(', ') || '',
      });
    }
  }, [snippet]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SnippetFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    }
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Binary Search Implementation"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language *</Label>
        <Select
          value={formData.language}
          onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
        >
          <SelectTrigger className={errors.language ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded">
                    {lang.icon}
                  </span>
                  {lang.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.language && <p className="text-sm text-destructive">{errors.language}</p>}
      </div>

      <div className="space-y-2">
        <Label>Code *</Label>
        <CodeEditor
          value={formData.code}
          onChange={(value) => setFormData(prev => ({ ...prev, code: value }))}
          language={formData.language}
          height="250px"
        />
        {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of what this snippet does..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="e.g., algorithm, sorting, utility (comma separated)"
        />
        <p className="text-xs text-muted-foreground">Separate tags with commas</p>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="gradient-bg">
          <Save className="h-4 w-4 mr-2" />
          {snippet ? 'Update Snippet' : 'Save Snippet'}
        </Button>
      </div>
    </form>
  );
}
