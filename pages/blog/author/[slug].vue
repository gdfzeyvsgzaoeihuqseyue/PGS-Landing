<template>
  <main class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <template v-if="author">
        <!-- En-tête -->
        <header
          class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <img :src="authorAvatarUrl" :alt="author.name" @error="handleAvatarError"
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-primary shadow-lg" />
            <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
              Articles de <span class="text-primary">{{ author.name }}</span>
            </h1>
            <p v-if="author.role" class="mt-2 text-xl text-gray-600">{{ author.role }}</p>
            <p v-if="author.bio" class="mt-4 text-lg max-w-2xl mx-auto text-gray-700">{{ author.bio }}</p>
            <div class="mt-4 flex justify-center space-x-4" v-if="author.social">
              <a v-if="author.social.twitter" :href="author.social.twitter" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-blue-400 transition-colors">
                <IconBrandTwitter class="h-6 w-6" />
              </a>
              <a v-if="author.social.linkedin" :href="author.social.linkedin" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-blue-700 transition-colors">
                <IconBrandLinkedin class="h-6 w-6" />
              </a>
            </div>
          </div>

          <!-- Boutons -->
          <div class="mt-4 sm:mt-0">
            <button @click="$router.back()"
              class="my-2 sm:my-6 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
              <IconArrowLeft class="h-5 w-5 mr-2" />
              Retour
            </button>

            <NuxtLink to="/blog"
              class="my-2 sm:my-6 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
              <IconArrowBack class="h-5 w-5 mr-2" />
              Toutes les actualités
            </NuxtLink>
          </div>
        </header>

        <!-- Contenu principal -->
        <section class="flex flex-col lg:flex-row gap-8">
          <!-- Sidebar -->
          <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
            <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div class="flex justify-between items-center mb-6 lg:hidden">
                <h3 class="text-lg font-bold">Filtres</h3>
                <button @click="showSidebar = false" class="text-gray-500">
                  <IconX class="h-6 w-6" />
                </button>
              </div>

              <!-- Statistiques -->
              <div class="mb-8">
                <h3 class="text-lg font-bold mb-4">Statistiques</h3>
                <div class="space-y-4">
                  <div>
                    <p class="text-sm text-gray-500">Articles de cet auteur</p>
                    <p class="text-2xl font-bold">{{ articlesBySelectedAuthor.length }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Vues totales pour cet auteur</p>
                    <p class="text-2xl font-bold">{{ totalAuthorViews.toLocaleString() }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Nombre de mots écrits</p>
                    <p class="text-2xl font-bold">{{ totalWords.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <div class="space-y-6">
                <div>
                  <h3 class="text-lg font-bold mb-3">Rechercher un article</h3>
                  <div class="relative mb-8">
                    <input v-model="searchQuery" type="text" placeholder="Rechercher des articles de cet auteur..."
                      class="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
                    <div class="absolute left-4 top-3.5 text-gray-400">
                      <IconSearch class="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-bold mb-3">Catégories</h3>
                  <ul class="space-y-2">
                    <li v-for="catName in uniqueCategoriesOfAuthor" :key="catName">
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" v-model="selectedCategories" :value="catName" class="rounded text-primary">
                        <span>{{ catName }} ({{ getArticleCountForCategory(catName) }})</span>
                      </label>
                    </li>
                  </ul>
                </div>
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

          <main class="lg:w-3/4">
            <!-- Bouton sidebar mobile -->
            <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
              <IconFilter class="h-5 w-5 mr-2" />
              Filtres et statistiques
            </button>

            <!-- Chargement / Erreur -->
            <div v-if="authorStore.loading || articleStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement des articles...</p>
            </div>
            <div v-else-if="authorStore.error || articleStore.error" class="text-center py-10 text-red-500">
              <p>Nous n'avons pas réussi à charger les articles de cet autheur</p>
            </div>

            <!-- Liste des articles -->
            <div v-else-if="paginatedArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArticleCard v-for="article in paginatedArticles" :key="article.id" :article="article" />
            </div>

            <!-- Message d'absence d'article -->
            <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
              <IconMoodConfuzed class="h-16 w-16 mx-auto mb-4" />
              <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun article trouvé pour cet auteur avec ces filtres
              </h3>
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
        </section>
      </template>

      <!-- Message d'absence global -->
      <div v-else class="text-center bg-white rounded-xl shadow-md p-8 md:p-12">
        <h2 class="text-6xl font-extrabold text-gray-800 mb-4">Oups !</h2>
        <p class="text-lg text-gray-600 mb-8">
          Désolé, l'auteur que vous recherchez n'existe pas ou n'a pas encore publié d'articles.
        </p>
        <NuxtLink to="/blog"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowBack class="mr-2 -mr-1 h-5 w-5" />
          Voir toutes les actualités
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore, useAuthorStore } from '@/stores';
import type { Author as AuthorType } from '@/types';
import { IconArrowBack, IconArrowLeft, IconX, IconFilter, IconSearch, IconMoodConfuzed, IconBrandTwitter, IconBrandLinkedin, IconLoader } from '@tabler/icons-vue';

// Stores
const articleStore = useArticleStore();
const authorStore = useAuthorStore();

// Variables réactives
const route = useRoute();
const authorSlug = route.params.slug as string;

const showSidebar = ref(false);
const searchQuery = ref('');
const selectedCategories = ref<string[]>([]); 
const sortBy = ref('newest');
const dateRange = ref({
  start: '',
  end: ''
});

const currentPage = ref(1);
const itemsPerPage = 6;

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([
    authorStore.fetchAuthors(),
    articleStore.fetchArticles()
  ]);
});

// Récupération de l'auteur
const author = computed<AuthorType | undefined>(() => authorStore.getAuthorBySlug(authorSlug));

// Gérer des erreurs d'image d'avatar
const authorAvatarUrl = computed(() => author.value?.avatar || '');

const handleAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const authorName = author.value?.name || 'unknown';
  target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
};

// Articles de l'auteur sélectionné
const articlesBySelectedAuthor = computed(() => {
  // Vérifie si l'auteur existe avant de filtrer les articles
  if (!author.value) return [];
  return articleStore.articles.filter(article => article.author.id === author.value?.id);
});

// Catégories uniques des articles de cet auteur
const uniqueCategoriesOfAuthor = computed(() => {
  const categoriesSet = new Set<string>();
  articlesBySelectedAuthor.value.forEach(article => categoriesSet.add(article.category.name));
  return Array.from(categoriesSet).sort();
});

// Filtrage et tri
const filteredArticles = computed(() => {
  let filtered = [...articlesBySelectedAuthor.value];

  // Filtrer par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filtrer par catégories sélectionnées
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(article => selectedCategories.value.includes(article.category.name));
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

  // Trier les articles
  if (sortBy.value === 'views') {
    filtered.sort((a, b) => b.views - a.views);
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } else { 
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return filtered;
});

// Vues totales pour les articles de cet auteur
const totalAuthorViews = computed(() =>
  articlesBySelectedAuthor.value.reduce((sum, article) => sum + (article.views || 0), 0)
);

const getArticleCountForCategory = (categoryName: string) => {
  return articlesBySelectedAuthor.value.filter(article => article.category.name === categoryName).length;
};

const totalWords = computed(() => {
  return filteredArticles.value.reduce((sum, article) => {
    const text = article.content.replace(/<[^>]*>/g, '')
    return sum + text.split(/\s+/).length
  }, 0)
})

// Pagination
const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredArticles.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / itemsPerPage)
);

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

// Réinitialiser les filtres
function resetFilters() {
  searchQuery.value = '';
  selectedCategories.value = [];
  dateRange.value = { start: '', end: '' };
  sortBy.value = 'newest';
  currentPage.value = 1;
}

// Réinitialiser la page actuelle à 1
watch([searchQuery, selectedCategories, dateRange, sortBy], () => {
  currentPage.value = 1;
});

// SEO
useHead(() => ({
  title: author.value ? `Articles de ${author.value.name}` : 'Auteur non trouvé',
}));
</script>
