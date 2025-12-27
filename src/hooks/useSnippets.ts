import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Snippet } from '@/types/snippet';
import { toast } from '@/hooks/use-toast';

export function useSnippets() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSnippets = useCallback(async () => {
    if (!user) {
      setSnippets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSnippets(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error fetching snippets',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const createSnippet = async (snippetData: Omit<Snippet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('snippets')
        .insert({
          ...snippetData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => [data, ...prev]);
      toast({
        title: 'Snippet created',
        description: 'Your snippet has been saved successfully.',
      });
      return data;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error creating snippet',
        description: error.message,
      });
      return null;
    }
  };

  const updateSnippet = async (id: string, snippetData: Partial<Snippet>) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .update(snippetData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSnippets(prev => prev.map(s => (s.id === id ? data : s)));
      toast({
        title: 'Snippet updated',
        description: 'Your changes have been saved.',
      });
      return data;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error updating snippet',
        description: error.message,
      });
      return null;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSnippets(prev => prev.filter(s => s.id !== id));
      toast({
        title: 'Snippet deleted',
        description: 'The snippet has been removed.',
      });
      return true;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting snippet',
        description: error.message,
      });
      return false;
    }
  };

  const toggleFavorite = async (id: string) => {
    const snippet = snippets.find(s => s.id === id);
    if (!snippet) return;

    return updateSnippet(id, { is_favorite: !snippet.is_favorite });
  };

  return {
    snippets,
    loading,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    refetch: fetchSnippets,
  };
}
