<template>
  <main class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header class="text-center mb-12 py-6 mt-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Actualités</span> & Blog
      </h1>
      <p class="mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Découvrez nos dernières actualités, analyses et conseils sur la digitalisation des PME africaines
      </p>

      <!-- Boutons -->
      <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-white">
        <NuxtLink to="/blog/cat" class="px-4 py-2 bg-primary rounded-lg hover:bg-secondary transition">
          Voir toutes les catégories
        </NuxtLink>
        <NuxtLink to="/blog/author" class="px-4 py-2 bg-secondary rounded-lg hover:bg-primary transition">
          Voir tous les auteurs
        </NuxtLink>
      </div>
    </header>

    <!-- Section principale -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar réutilisable -->
        <AppSidebar v-model="sidebar.showSidebar.value" :filters="sidebar.filters.value" :stats="sidebar.stats.value"
          :sort-options="sortOptions" :show-search="false" title="Filtres" stats-title="Statistiques des articles"
          @update:filters="sidebar.filters.value = $event" @reset="sidebar.resetFilters()">
          <!-- Filtres -->
          <template #custom-filters="{ filters }">
            <!-- Catégories avec checkboxes -->
            <div>
              <h3 class="text-lg font-bold mb-3">Catégories</h3>
              <ul class="space-y-2">
                <li v-for="cat in categoriesWithArticles" :key="cat.id">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" :checked="selectedCategoryIds.includes(cat.id)"
                      @change="toggleCategory(cat.id)" class="rounded text-primary" />
                    <span>{{ cat.name }} ({{ getArticleCountForCategory(cat.id) }})</span>
                  </label>
                </li>
              </ul>
            </div>

            <!-- Plage de dates -->
            <div>
              <h3 class="text-lg font-bold mb-3">Plage de dates</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">De</label>
                  <input type="date" v-model="dateRange.start" class="w-full rounded-md border-gray-300 shadow-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">À</label>
                  <input type="date" v-model="dateRange.end" class="w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              </div>
            </div>
          </template>
        </AppSidebar>

        <!-- Articles -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="sidebar.toggleSidebar(true)" v-if="!sidebar.showSidebar.value"
            class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Barre de recherche -->
          <div class="relative mb-8">
            <input v-model="sidebar.filters.value.search" type="text" placeholder="Rechercher des articles..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
            <div class="absolute left-4 top-3.5 text-gray-400">
              <IconSearch class="h-5 w-5" />
            </div>
          </div>

          <!-- Chargement / Erreur -->
          <LogoLoader v-if="articleStore.loading" :show-text="true" size="lg" text="Chargement des articles..." />
          <div v-else-if="articleStore.error" class="text-center py-10">
            <p>Nous n'arrivons pas à afficher les articles</p>
          </div>

          <!-- Articles -->
          <div v-else-if="sidebar.paginatedItems.value.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCard v-for="article in sidebar.paginatedItems.value" :key="article.id" :article="article" />
          </div>

          <!-- Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <IconMoodConfuzed class="h-16 w-16 mx-auto mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button @click="sidebar.resetFilters()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <AppPagination :current-page="sidebar.currentPage.value" :total-pages="sidebar.totalPages.value"
            :visible-pages="sidebar.visiblePages.value" @prev="sidebar.prevPage()" @next="sidebar.nextPage()"
            @goto="sidebar.goToPage($event)" />
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useArticleStore, useCategoryStore, useAuthorStore } from '@/stores';
import { IconFilter, IconSearch, IconMoodConfuzed } from '@tabler/icons-vue';
import { useSidebar } from '@/composables/useSidebar';
import { AppPagination, AppSidebar } from '@/components/app';
import { LogoLoader } from '@/components/utils';

const articleStore = useArticleStore();
const categoryStore = useCategoryStore();
const authorStore = useAuthorStore();

const selectedCategoryIds = ref<string[]>([]);
const dateRange = ref({ start: '', end: '' });

// Sidebar avec composable
const sidebar = useSidebar(computed(() => articleStore.articles), {
  initialFilters: {
    search: '',
    sortOrder: 'newest'
  },
  itemsPerPage: 6,
  filterFn: (articles, filters) => {
    let results = articles;

    // Recherche
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtre par catégories
    if (selectedCategoryIds.value.length > 0) {
      results = results.filter(article =>
        selectedCategoryIds.value.includes(article.category.id)
      );
    }

    // Filtre par plage de dates
    if (dateRange.value.start && dateRange.value.end) {
      const startDate = new Date(dateRange.value.start);
      const endDate = new Date(dateRange.value.end);
      results = results.filter(article => {
        const articleDate = new Date(article.createdAt);
        return articleDate >= startDate && articleDate <= new Date(endDate.setHours(23, 59, 59, 999));
      });
    }

    return results;
  },
  sortFn: (articles, sortOrder) => {
    if (sortOrder === 'views') {
      return [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    const sorted = [...articles].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortOrder === 'oldest' ? sorted.reverse() : sorted;
  },
  statsFn: (articles) => {
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    return {
      articles: articles.length,
      vues: totalViews.toLocaleString()
    };
  }
});

const sortOptions = [
  { value: 'newest', label: 'Plus récent' },
  { value: 'oldest', label: 'Plus ancien' },
  { value: 'views', label: 'Plus de vues' }
];

const getArticleCountForCategory = (categoryId: string) => {
  return articleStore.articles.filter(article => article.category.id === categoryId).length;
};

const categoriesWithArticles = computed(() => {
  return categoryStore.categories.filter(cat => getArticleCountForCategory(cat.id) > 0);
});

const toggleCategory = (categoryId: string) => {
  const index = selectedCategoryIds.value.indexOf(categoryId);
  if (index > -1) {
    selectedCategoryIds.value.splice(index, 1);
  } else {
    selectedCategoryIds.value.push(categoryId);
  }
  sidebar.currentPage.value = 1;
};

onMounted(async () => {
  await Promise.all([
    articleStore.fetchArticles(),
    categoryStore.fetchCategories(),
    authorStore.fetchAuthors()
  ]);
});

// Reset categories and dateRange when filters reset
watch(() => sidebar.filters.value, (newVal, oldVal) => {
  if (newVal.search === '' && oldVal.search !== '') {
    selectedCategoryIds.value = [];
    dateRange.value = { start: '', end: '' };
  }
});

useHead(() => ({
  title: 'Articles',
}));
</script>
