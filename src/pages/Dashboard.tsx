import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Grid, List, Code2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { SnippetCard } from '@/components/SnippetCard';
import { SnippetModal } from '@/components/SnippetModal';
import { SearchFilters } from '@/components/SearchFilters';
import { EmptyState } from '@/components/EmptyState';
import { useSnippets } from '@/hooks/useSnippets';
import { Snippet } from '@/types/snippet';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const { snippets, loading, deleteSnippet, toggleFavorite } = useSnippets();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [viewingSnippet, setViewingSnippet] = useState<Snippet | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    snippets.forEach(s => s.tags?.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [snippets]);

  const filteredSnippets = useMemo(() => {
    let result = [...snippets];
    if (searchQuery) result = result.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (languageFilter !== 'all') result = result.filter(s => s.language === languageFilter);
    if (tagFilter !== 'all') result = result.filter(s => s.tags?.includes(tagFilter));
    result.sort((a, b) => sortOrder === 'newest' ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return result;
  }, [snippets, searchQuery, languageFilter, tagFilter, sortOrder]);

  const stats = useMemo(() => ({
    total: snippets.length,
    favorites: snippets.filter(s => s.is_favorite).length,
    languages: new Set(snippets.map(s => s.language)).size,
  }), [snippets]);

  const handleDelete = async () => {
    if (deletingId) {
      await deleteSnippet(deletingId);
      setDeletingId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display mb-1">My Snippets</h1>
            <p className="text-muted-foreground">Organize and manage your code collection</p>
          </div>
          <Button asChild className="gradient-bg"><Link to="/snippet/new"><Plus className="h-4 w-4 mr-2" />New Snippet</Link></Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{ label: 'Total Snippets', value: stats.total, icon: Code2 }, { label: 'Favorites', value: stats.favorites, icon: Star }].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><stat.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-muted-foreground">{stat.label}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <SearchFilters searchQuery={searchQuery} onSearchChange={setSearchQuery} languageFilter={languageFilter} onLanguageChange={setLanguageFilter} tagFilter={tagFilter} onTagChange={setTagFilter} sortOrder={sortOrder} onSortChange={setSortOrder} availableTags={availableTags} />
          <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}><Grid className="h-4 w-4" /></Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
          </div>
        </div>

        {filteredSnippets.length === 0 ? <EmptyState title={snippets.length === 0 ? undefined : 'No matching snippets'} description={snippets.length === 0 ? undefined : 'Try adjusting your search or filters.'} showAction={snippets.length === 0} /> : (
          <div className={cn('gap-4', viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col')}>
            {filteredSnippets.map(snippet => <SnippetCard key={snippet.id} snippet={snippet} onEdit={(s) => navigate(`/snippet/${s.id}`)} onDelete={setDeletingId} onToggleFavorite={toggleFavorite} onView={setViewingSnippet} />)}
          </div>
        )}
      </main>

      <SnippetModal snippet={viewingSnippet} open={!!viewingSnippet} onOpenChange={(open) => !open && setViewingSnippet(null)} onToggleFavorite={toggleFavorite} />
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete snippet?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
