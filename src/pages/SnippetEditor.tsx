import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { SnippetForm } from '@/components/SnippetForm';
import { useSnippets } from '@/hooks/useSnippets';
import { SnippetFormData, Snippet } from '@/types/snippet';

export default function SnippetEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { snippets, createSnippet, updateSnippet, loading: snippetsLoading } = useSnippets();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [saving, setSaving] = useState(false);
  const isNew = id === 'new';

  useEffect(() => {
    if (!isNew && snippets.length > 0) {
      const found = snippets.find(s => s.id === id);
      if (found) setSnippet(found);
      else navigate('/dashboard');
    }
  }, [id, snippets, isNew, navigate]);

  const handleSubmit = async (data: SnippetFormData) => {
    setSaving(true);
    const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean);
    const snippetData = { title: data.title, language: data.language, code: data.code, description: data.description || null, tags, is_favorite: snippet?.is_favorite || false };
    const result = isNew ? await createSnippet(snippetData) : await updateSnippet(id!, snippetData);
    setSaving(false);
    if (result) navigate('/dashboard');
  };

  if (snippetsLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Button>
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl font-display mb-6">{isNew ? 'Create New Snippet' : 'Edit Snippet'}</h1>
          <SnippetForm snippet={snippet} onSubmit={handleSubmit} onCancel={() => navigate('/dashboard')} loading={saving} />
        </div>
      </main>
    </div>
  );
}
