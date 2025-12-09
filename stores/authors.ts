import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Author } from '@/types';

export const useAuthorStore = defineStore('authors', () => {
  const authors = ref<Author[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  // Récupère tous les auteurs
  async function fetchAuthors() {
    loading.value = true;
    error.value = null;
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{ data: Author[] }>(`/public/blog/get-author`, {
        params: { limit: 10 }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        authors.value = response.value.data;
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des auteurs: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  }

  // Récupère un auteur par son ID
  const getAuthorById = computed(() => (id: string): Author | undefined => {
    return authors.value.find(author => author.id === id);
  });

  // Récupère un auteur par son slug  
  const getAuthorBySlug = computed(() => (slug: string): Author | undefined => {
    return authors.value.find(author => author.slug === slug);
  });

  return {
    authors,
    loading,
    error,
    initialized,
    fetchAuthors,
    getAuthorById,
    getAuthorBySlug,
  };
});
