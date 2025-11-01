import { defineStore } from 'pinia';
import { useApiFetch } from '~/utils/api';
import { ref, computed } from 'vue';
import type { Category } from '@/types';

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Trouver toutes les catégories 
  async function fetchCategories() {
    loading.value = true;
    error.value = null;
    try {
      const response = await useApiFetch<{ data: Category[] }>(`/blog/category`, {
        params: { limit: 10 }
      });
      categories.value = response.data;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des catégories: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
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
    fetchCategories,
    getCategoryById,
    getCategoryBySlug,
  };
});
