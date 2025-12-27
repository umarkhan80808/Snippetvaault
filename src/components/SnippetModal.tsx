import { useState } from 'react';
import { Copy, Check, Star, Download, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CodeEditor } from './CodeEditor';
import { LanguageBadge } from './LanguageBadge';
import { Snippet } from '@/types/snippet';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface SnippetModalProps {
  snippet: Snippet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (id: string) => void;
}

export function SnippetModal({ snippet, open, onOpenChange, onToggleFavorite }: SnippetModalProps) {
  const [copied, setCopied] = useState(false);

  if (!snippet) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      sql: 'sql',
    };
    const ext = extensions[snippet.language] || 'txt';
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${snippet.title.replace(/\s+/g, '_')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">{snippet.title}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Created {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
                {snippet.updated_at !== snippet.created_at && (
                  <> · Updated {formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}</>
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(snippet.id)}
              className={cn(snippet.is_favorite && 'text-yellow-500')}
            >
              <Star className={cn('h-5 w-5', snippet.is_favorite && 'fill-current')} />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <LanguageBadge language={snippet.language} />
            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {snippet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {snippet.description && (
            <div className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-4">
              {snippet.description}
            </div>
          )}

          <div className="relative">
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            <CodeEditor
              value={snippet.code}
              onChange={() => {}}
              language={snippet.language}
              readOnly
              height="400px"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
