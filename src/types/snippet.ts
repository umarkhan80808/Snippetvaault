export interface Snippet {
  id: string;
  user_id: string;
  title: string;
  language: string;
  code: string;
  description: string | null;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface SnippetFormData {
  title: string;
  language: string;
  code: string;
  description: string;
  tags: string;
}
