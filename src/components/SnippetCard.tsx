import { useState } from 'react';
import { Copy, Trash2, Edit, Star, Eye, Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageBadge } from './LanguageBadge';
import { Snippet } from '@/types/snippet';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onView: (snippet: Snippet) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete, onToggleFavorite, onView }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="group card-hover glass-strong overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{snippet.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(snippet.id)}
            className={cn(
              'shrink-0 transition-colors',
              snippet.is_favorite && 'text-yellow-500'
            )}
          >
            <Star className={cn('h-4 w-4', snippet.is_favorite && 'fill-current')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-3">
          <LanguageBadge language={snippet.language} size="sm" />
        </div>
        <div className="relative rounded-lg bg-secondary/50 p-3 font-mono text-xs overflow-hidden max-h-24">
          <pre className="overflow-hidden text-muted-foreground whitespace-pre-wrap break-all">
            {snippet.code.slice(0, 200)}
            {snippet.code.length > 200 && '...'}
          </pre>
        </div>
        {snippet.tags && snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {snippet.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {snippet.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 gap-1">
        <Button variant="ghost" size="sm" onClick={() => onView(snippet)}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 mr-1 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 mr-1" />
          )}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(snippet)}>
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(snippet.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
