import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Author } from '@/types';
import { useRuntimeConfig } from '#app';

export const useAuthorStore = defineStore('authors', () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.pgsBaseAPI;

  const authors = ref<Author[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Récupère tous les auteurs
  async function fetchAuthors() {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ data: Author[] }>(`${API_BASE_URL}/blog/author`, {
        params: { limit: 10 }
      });
      authors.value = response.data;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des auteurs: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
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
    fetchAuthors,
    getAuthorById,
    getAuthorBySlug,
  };
});
