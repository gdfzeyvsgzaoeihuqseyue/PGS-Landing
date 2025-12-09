import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Article } from '@/types';

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([]);
  const currentArticle = ref<Article | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const initialized = ref({
    articles: false,
    currentArticle: false,
  });

  // Récupère tous les articles 
  async function fetchArticles() {
    loading.value = true;
    error.value = null;
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{ data: Article[] }>('/public/blog/get-article', {
        params: { limit: 25 }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        articles.value = response.value.data;
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des articles: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      initialized.value.articles = true;
      loading.value = false;
    }
  }

  // Récupère un article spécifique par son slug ou ID
  async function fetchArticleBySlug(identifier: string) {
    loading.value = true;
    error.value = null;
    currentArticle.value = null;
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{ data: Article }>(`/public/blog/get-article/${identifier}`, {});

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        currentArticle.value = response.value.data;
        return response.value.data;
      }
      return null;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement de l\'article: ' + (err.data?.message || err.message);
      console.error(error.value, err);
      return null;
    } finally {
      initialized.value.currentArticle = true;
      loading.value = false;
    }
  }

  /**
   * Filtre et trie les articles.
   * @param options.searchQuery - Terme de recherche.
   * @param options.categoryId - ID de la catégorie à filtrer.
   * @param options.authorId - ID de l'auteur à filtrer.
   * @param options.sortOrder - Ordre de tri ('asc' pour plus ancien, 'desc' pour plus récent).
   * @param options.sortByViews - Si vrai, trie par nombre de vues (décroissant).
   */
  const getFilteredAndSortedArticles = computed(() => (options: {
    searchQuery?: string;
    categoryId?: string;
    authorId?: string;
    sortOrder?: 'asc' | 'desc';
    sortByViews?: boolean;
  }): Article[] => {
    let filtered = [...articles.value];

    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (options.categoryId) {
      filtered = filtered.filter(article => article.category.id === options.categoryId);
    }

    if (options.authorId) {
      filtered = filtered.filter(article => article.author.id === options.authorId);
    }

    // Tri
    if (options.sortByViews) {
      filtered.sort((a, b) => b.views - a.views);
    } else if (options.sortOrder === 'asc') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  });

  // Récupère les catégories uniques des articles actuellement chargés.
  const getUniqueCategories = computed(() => {
    const categoriesSet = new Set<string>();
    articles.value.forEach(article => categoriesSet.add(article.category.name));
    return Array.from(categoriesSet).sort();
  });

  // Calcule les statistiques par catégorie pour les articles actuellement chargés
  const getCategoryStatistics = computed(() => {
    const stats: { [key: string]: number } = {};
    articles.value.forEach(article => {
      stats[article.category.name] = (stats[article.category.name] || 0) + 1;
    });
    return Object.keys(stats).map(category => ({
      category,
      count: stats[category]
    })).sort((a, b) => b.count - a.count);
  });

  // Récupère les articles les plus récents
  const getLatestArticles = computed(() => (limit: number = 5): Article[] => {
    return [...articles.value].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, limit);
  });

  // Calcule le temps de lecture estimé d'un article en minutes
  function calculateReadingTime(content: string): number {
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200;
    const wordCount = textContent.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readingTimeMinutes;
  }

  return {
    articles,
    currentArticle,
    loading,
    error,
    initialized,
    fetchArticles,
    fetchArticleBySlug,
    getFilteredAndSortedArticles,
    getUniqueCategories,
    getCategoryStatistics,
    getLatestArticles,
    calculateReadingTime,
  };
});
