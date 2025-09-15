<template>
  <main class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header class="text-center mb-12 py-6 mt-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Actualités</span> & Blog
      </h1>
      <p class="mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Découvrez nos dernières actualités, analyses et conseils sur la digitalisation des PME africaines, les solutions
        logicielles et l'innovation technologique.
      </p>

      <!-- Boutons -->
      <div class="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-white">
        <NuxtLink to="/blogs/cat" 
          class="px-4 py-2 bg-primary rounded-lg hover:bg-secondary transition">
          Voir toutes les catégories
        </NuxtLink>
        <NuxtLink to="/blogs/author" 
          class="px-4 py-2 bg-secondary rounded-lg hover:bg-primary transition">
          Voir tous les auteurs
        </NuxtLink>
      </div>
    </header>

    <!-- Section principale -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Barre latérale des filtres-->
        <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <!-- En-tête mobile -->
            <div class="flex justify-between items-center mb-6 lg:hidden">
              <h3 class="text-lg font-bold">Statistiques</h3>
              <button @click="showSidebar = false" class="text-gray-500">
                <IconX class="h-6 w-6" />
              </button>
            </div>

            <!-- Bloc statistiques -->
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-4 hidden lg:block">Statistiques</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold">{{ articleStore.articles.length }}</p>
                  <p class="text-sm text-gray-500">Articles</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ totalViews.toLocaleString() }}</p>
                  <p class="text-sm text-gray-500">Vues</p>
                </div>
              </div>
            </div>

            <!-- Filtres -->
            <div class="space-y-6">
              <!-- Catégories -->
              <div>
                <h3 class="text-lg font-bold mb-3">Catégories</h3>
                <ul class="space-y-2">
                  <li v-for="cat in categoriesWithArticles" :key="cat.id">
                    <label class="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" v-model="selectedCategoryIds" :value="cat.id" class="rounded text-primary">
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
                    <input type="date" v-model="dateRange.start" class="w-full rounded-md border-gray-300 shadow-sm">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">À</label>
                    <input type="date" v-model="dateRange.end" class="w-full rounded-md border-gray-300 shadow-sm">
                  </div>
                </div>
              </div>

              <!-- Tri des articles -->
              <div>
                <h3 class="text-lg font-bold mb-3">Trier par</h3>
                <select v-model="sortBy" class="w-full rounded-md border-gray-300 shadow-sm">
                  <option value="newest">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                  <option value="views">Plus de vues</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <!-- Articles -->
        <main class="lg:w-3/4"> 
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Barre de recherche -->
          <div class="relative mb-8">
            <input v-model="searchQuery" type="text" placeholder="Rechercher des articles..."
              class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
            <div class="absolute left-4 top-3.5 text-gray-400">
              <IconSearch class="h-5 w-5" />
            </div>
          </div>

          <!-- Chargement / Erreur -->
          <div v-if="articleStore.loading || categoryStore.loading || authorStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des articles...</p>
          </div>
          <div v-else-if="articleStore.error || categoryStore.error || authorStore.error" class="text-center py-10">
            <p>Nous n'arrivons pas à afficher les articles</p>
          </div>

          <!-- Articles -->
          <div v-else-if="paginatedArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ArticleCard v-for="article in paginatedArticles" :key="article.id" :article="article" />
          </div>

          <!--Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <IconMoodConfuzed class="h-16 w-16 mx-auto mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button @click="resetFilters"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredArticles.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex flex-wrap rounded-md shadow">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Précédent
              </button>
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                :class="[page === currentPage ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'px-4 py-2 border-t border-b text-sm font-medium']">
                {{ page }}
              </button>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Suivant
              </button>
            </nav>
          </div>
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useArticleStore, useCategoryStore, useAuthorStore } from '@/stores';
import { IconX, IconFilter, IconSearch, IconMoodConfuzed, IconLoader } from '@tabler/icons-vue';

// Stores
const articleStore = useArticleStore();
const categoryStore = useCategoryStore();
const authorStore = useAuthorStore();

// Variables réactives
const showSidebar = ref(false);
const searchQuery = ref('');
const selectedCategoryIds = ref<string[]>([]); 
const sortBy = ref('newest');

const dateRange = ref({
  start: '',
  end: ''
});

const currentPage = ref(1);
const itemsPerPage = 6;

onMounted(async () => {
  await Promise.all([
    articleStore.fetchArticles(),
    categoryStore.fetchCategories(),
    authorStore.fetchAuthors()
  ]);
});

// Articles filtrés et triés selon les options sélectionnées
const filteredArticles = computed(() => {
  const options = {
    searchQuery: searchQuery.value,
    sortOrder: sortBy.value === 'oldest' ? 'asc' : 'desc' as 'asc' | 'desc',
    sortByViews: sortBy.value === 'views',
  };

  let filtered = articleStore.getFilteredAndSortedArticles(options);

  if (selectedCategoryIds.value.length > 0) {
    filtered = filtered.filter(article => 
      selectedCategoryIds.value.includes(article.category.id)
    );
  }

  // Filtrer par plage de dates
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = new Date(dateRange.value.start);
    const endDate = new Date(dateRange.value.end);
    filtered = filtered.filter(article => {
      const articleDate = new Date(article.createdAt); // Utiliser createdAt
      return articleDate >= startDate && articleDate <= new Date(endDate.setHours(23, 59, 59, 999));
    });
  }

  return filtered;
});

// Nombre total d’articles et de vue cumulées
const totalViews = computed(() => articleStore.articles.reduce((sum, article) => sum + (article.views || 0), 0));

// Nombre d'articles pour une catégorie donnée
const getArticleCountForCategory = (categoryId: string) => {
  return articleStore.articles.filter(article => article.category.id === categoryId).length;
};

// Catégories qui ont au moins un article
const categoriesWithArticles = computed(() => {
  return categoryStore.categories.filter(cat => getArticleCountForCategory(cat.id) > 0);
});

// Pagination des articles filtrés
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArticles.value.slice(start, end);
});

// Nombre total de pages 
const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / itemsPerPage)
);

// Génération dynamique des pages visibles pour la pagination
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Fonction pour réinitialiser tous les filtres
function resetFilters() {
  searchQuery.value = '';
  selectedCategoryIds.value = [];
  dateRange.value = { start: '', end: '' };
  sortBy.value = 'newest';
  currentPage.value = 1;
}

// Revenir à la première page si les filtres changent
watch([searchQuery, selectedCategoryIds, dateRange, sortBy], () => {
  currentPage.value = 1;
});

// SEO
useHead(() => ({
  title: 'Articles',
}));
</script>
