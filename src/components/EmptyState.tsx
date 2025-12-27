import { Code2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
}

export function EmptyState({
  title = 'No snippets yet',
  description = 'Create your first code snippet to get started.',
  showAction = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 animate-float">
        <Code2 className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {showAction && (
        <Button asChild className="gradient-bg">
          <Link to="/snippet/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Snippet
          </Link>
        </Button>
      )}
    </div>
  );
}
