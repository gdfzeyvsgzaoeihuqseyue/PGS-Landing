import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Category } from '@/types';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  // Trouver toutes les catégories 
  async function fetchCategories() {
    loading.value = true;
    error.value = null;
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{ data: Category[] }>(`/blog/category`, {
        params: { limit: 10 }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        categories.value = response.value.data;
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des catégories: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      initialized.value = true;
      loading.value = false;
    }
  }

  // Trouver une catégorie par son ID
  const getCategoryById = computed(() => (id: string): Category | undefined => {
    return categories.value.find(category => category.id === id);
  });

  // Trouve une catégorie par son Slug
  const getCategoryBySlug = computed(() => (slug: string): Category | undefined => {
    return categories.value.find(category => category.slug === slug);
  });

  return {
    categories,
    loading,
    error,
    initialized,
    fetchCategories,
    getCategoryById,
    getCategoryBySlug,
  };
});
