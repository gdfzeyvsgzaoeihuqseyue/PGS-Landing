<template>
  <main class="min-h-screen bg-gray-50">
    <!-- En-tête  -->
    <header
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Catégories</span> d'articles
        </h1>
        <p class="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Explorez nos thèmes variés et trouvez les sujets qui vous passionnent.
        </p>
      </div>

      <!-- Bouton de retour -->
      <div class="mt-4 sm:mt-0"> <!-- Ajout de marge pour l'empilement sur mobile -->
        <button @click="$router.back()"
          class="my-2 sm:my-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowLeft class="h-5 w-5 mr-2" />
          Retour
        </button>
      </div>
    </header>

    <!-- Section principale -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Barre latérale -->
        <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <!-- En-tête mobile -->
            <div class="flex justify-between items-center mb-6 lg:hidden">
              <h3 class="text-lg font-bold">Filtres</h3>
              <button @click="showSidebar = false" class="text-gray-500">
                <IconX class="h-6 w-6" />
              </button>
            </div>
            <h3 class="text-lg font-bold mb-4">Statistiques des catégories</h3>

            <!-- Statistiques principales -->
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Total catégories uniques</p>
                <p class="text-2xl font-bold">{{ categoryStore.categories.length }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Articles par catégorie</p>
                <ul v-if="!categoryStore.loading && !articleStore.loading">
                  <li v-for="stat in categoryStatistics" :key="stat.category"
                    class="flex justify-between items-center text-gray-700">
                    <span>{{ stat.category }}</span>
                    <span class="font-medium">{{ stat.count }}</span>
                  </li>
                </ul>
                <p v-else class="text-gray-500">Chargement...</p>
              </div>
            </div>

            <!-- Filtres -->
            <div class="mt-8 space-y-6">
              <!-- Barre de recherche -->
              <div>
                <h3 class="text-lg font-bold mb-3">Rechercher une catégorie</h3>
                <input type="text" v-model="searchQuery" placeholder="Rechercher..."
                  class="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primay">
              </div>

              <!-- Tri -->
              <div>
                <h3 class="text-lg font-bold mb-3">Trier les catégories</h3>
                <select v-model="sortCategoriesBy" class="w-full rounded-md border-gray-300 shadow-sm">
                  <option value="name_asc">Nom (A-Z)</option>
                  <option value="name_desc">Nom (Z-A)</option>
                  <option value="article_count_desc">Plus d'articles</option>
                  <option value="article_count_asc">Moins d'articles</option>
                </select>
              </div>

              <!-- Bouton de réinitialisation -->
              <button @click="resetFilters"
                class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </aside>

        <!-- Liste des catégories -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Chargement / Erreur -->
          <div v-if="categoryStore.loading || articleStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des catégories...</p>
          </div>
          <div v-else-if="categoryStore.error || articleStore.error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les articles de cette catégorie</p>
          </div>

          <!-- Affichage des catégories trouvées -->
          <div v-else-if="filteredAndSortedCategories.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink v-for="cat in paginatedCategories" :key="cat.id" :to="`/actualites/categorie/${cat.slug}`"
              class="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ cat.name }}</h3>
              <p class="text-gray-600">{{ getArticleCountForCategory(cat.id) }} article(s)</p>
            </NuxtLink>
          </div>

          <!-- Aucun résultat -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="resetFilters"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination si nécessaire -->
          <div v-if="filteredAndSortedCategories.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex flex-wrap rounded-md shadow">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Précédent
              </button>
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[
                page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                'px-4 py-2 border-t border-b text-sm font-medium'
              ]">
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useCategoryStore, useArticleStore } from '@/stores'
import { IconArrowLeft, IconLoader, IconFilter, IconX } from '@tabler/icons-vue'

// Stores
const categoryStore = useCategoryStore();
const articleStore = useArticleStore();

// État réactif
const searchQuery = ref('')
const sortCategoriesBy = ref('name_asc')
const currentPage = ref(1)
const itemsPerPage = 9
const showSidebar = ref(false); // Ajout de l'état pour la visibilité de la sidebar

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    articleStore.fetchArticles()
  ]);
});

// Articles pour une catégorie donnée
const getArticleCountForCategory = (categoryId: string) => { // ID est maintenant string
  return articleStore.articles.filter(article => article.category.id === categoryId).length
}

// Liste triée et filtrée des catégories
const filteredAndSortedCategories = computed(() => {
  let result = [...categoryStore.categories]

  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(category =>
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    )
  }

  // Tri des catégories
  result.sort((a, b) => {
    switch (sortCategoriesBy.value) {
      case 'name_asc':
        return a.name.localeCompare(b.name)
      case 'name_desc':
        return b.name.localeCompare(a.name)
      case 'article_count_desc':
        return getArticleCountForCategory(b.id) - getArticleCountForCategory(a.id)
      case 'article_count_asc':
        return getArticleCountForCategory(a.id) - getArticleCountForCategory(b.id)
      default:
        return 0
    }
  })

  return result
})

// Statistiques par catégorie
const categoryStatistics = computed(() => {
  const statsMap: { [key: string]: number } = {} // ID est maintenant string

  articleStore.articles.forEach(article => {
    statsMap[article.category.id] = (statsMap[article.category.id] || 0) + 1
  })

  return categoryStore.categories.map(category => ({
    category: category.name,
    count: statsMap[category.id] || 0
  })).sort((a, b) => b.count - a.count)
})

// Liste unique des catégories
const uniqueCategories = computed(() => categoryStore.categories)

// Pagination
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedCategories.value.slice(start, end)
})

// Nombre total de pages
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedCategories.value.length / itemsPerPage)
})

// Pages visibles
const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Réinitialiser les filtres
function resetFilters() {
  searchQuery.value = ''
  sortCategoriesBy.value = 'name_asc'
  currentPage.value = 1
}

// Revenir à la page 1 quand on change le tri ou la recherche
watch([searchQuery, sortCategoriesBy], () => {
  currentPage.value = 1
})

// SEO
useHead(() => ({
  title: 'Toutes les catégories d\'articles - Blog PGS'
}))
</script>
