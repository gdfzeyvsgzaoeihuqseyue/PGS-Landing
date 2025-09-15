<template>
  <main class="min-h-screen bg-gray-50">
    <!-- En-tête -->
    <header
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Auteurs</span> et contributeurs
        </h1>
        <p class="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Faites connaissance avec les experts derrière nos articles et découvrez leurs domaines de spécialité.
        </p>
      </div>

      <!-- Bouton de retour -->
      <div>
        <button @click="$router.back()"
          class="my-2 sm:my-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowLeft class="h-5 w-5 mr-2" />
          Retour
        </button>
      </div>
    </header>

    <!-- Contenu -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Barre latérale -->
        <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <!-- En-tête mobile de la sidebar -->
            <div class="flex justify-between items-center mb-6 lg:hidden">
              <h3 class="text-lg font-bold">Filtres</h3>
              <button @click="showSidebar = false" class="text-gray-500">
                <IconX class="h-6 w-6" />
              </button>
            </div>

            <!-- Statistiques -->
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-4">Statistiques des auteurs</h3>
              <div class="space-y-4">
                <div>
                  <p class="text-sm text-gray-500">Total auteurs</p>
                  <p class="text-2xl font-bold">{{ authorStore.authors.length }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Articles par auteur</p>
                  <ul v-if="!authorStore.loading && !articleStore.loading">
                    <li v-for="stat in authorStatistics" :key="stat.authorId"
                      class="flex justify-between text-gray-700">
                      <span>{{ stat.authorName }}</span>
                      <span class="font-medium">{{ stat.articleCount }}</span>
                    </li>
                  </ul>
                  <p v-else class="text-gray-500">Chargement...</p>
                </div>
              </div>
            </div>

            <!-- Filtres  -->
            <div class="mt-8 space-y-6">
              <div>
                <h3 class="text-lg font-bold mb-3">Rechercher un auteur</h3>
                <input type="text" v-model="searchQuery" placeholder="Rechercher..."
                  class="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
              </div>
              <div>
                <h3 class="text-lg font-bold mb-3">Trier les auteurs</h3>
                <select v-model="sortAuthorsBy" class="w-full rounded-md border-gray-300 shadow-sm">
                  <option value="name_asc">Nom (A-Z)</option>
                  <option value="name_desc">Nom (Z-A)</option>
                  <option value="article_count_desc">Plus d'articles</option>
                  <option value="article_count_asc">Moins d'articles</option>
                </select>
              </div>
              <button @click="resetFilters"
                class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </aside>

        <!-- Liste principale des auteurs -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Chargement / Erreur -->
          <div v-if="authorStore.loading || articleStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des auteurs...</p>
          </div>
          <div v-else-if="authorStore.error || articleStore.error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les articles de cet autheur</p>
          </div>

          <div v-else-if="filteredAndSortedAuthors.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Carte auteur -->
            <NuxtLink v-for="author in paginatedAuthors" :key="author.id" :to="`/blogs/author/${author.slug}`"
              class="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg text-center">
              <img :src="author.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=' + author.name"
                :alt="author.name" class="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-primary">
              <h3 class="text-xl font-bold text-gray-900 mb-1">{{ author.name }}</h3>
              <p class="text-primary text-sm mb-2">{{ author.role }}</p>
              <p class="text-gray-600 text-sm line-clamp-2">{{ author.bio }}</p>
              <p class="text-gray-600">{{ getArticleCountForAuthor(author.id) }} article(s)</p>
            </NuxtLink>
          </div>

          <!-- Aucun auteur trouvé -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun auteur trouvé</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="resetFilters" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="filteredAndSortedAuthors.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex flex-wrap rounded-md shadow">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Précédent
              </button>
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="[page === currentPage ? 'bg-primary border-primary text-White' : 'bg-primary border-primary text-primary',
                'px-4 py-2 border-t border-b text-sm font-medium']">
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
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthorStore, useArticleStore } from '@/stores'
import { IconArrowLeft, IconLoader, IconFilter, IconX } from '@tabler/icons-vue' // Import IconFilter and IconX

// Stores
const authorStore = useAuthorStore();
const articleStore = useArticleStore();

// --- Variables réactives ---
const searchQuery = ref('')
const sortAuthorsBy = ref('name_asc')
const currentPage = ref(1)
const itemsPerPage = 9
const showSidebar = ref(false); // Ajout de l'état pour la visibilité de la sidebar

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([
    authorStore.fetchAuthors(),
    articleStore.fetchArticles()
  ]);
});

// Nombre d’articles un auteur
const getArticleCountForAuthor = (authorId: string) => { // ID est maintenant string
  return articleStore.articles.filter(article => article.author.id === authorId).length
}

// Tri + filtrage
const filteredAndSortedAuthors = computed(() => {
  let result = [...authorStore.authors]

  // Recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(author =>
      author.name.toLowerCase().includes(query) ||
      (author.bio && author.bio.toLowerCase().includes(query)) ||
      (author.role && author.role.toLowerCase().includes(query))
    )
  }

  // Tri
  result.sort((a, b) => {
    switch (sortAuthorsBy.value) {
      case 'name_asc':
        return a.name.localeCompare(b.name)
      case 'name_desc':
        return b.name.localeCompare(a.name)
      case 'article_count_desc':
        return getArticleCountForAuthor(b.id) - getArticleCountForAuthor(a.id)
      case 'article_count_asc':
        return getArticleCountForAuthor(a.id) - getArticleCountForAuthor(b.id)
      default:
        return 0
    }
  })

  return result
})

// Total articles par auteur
const authorStatistics = computed(() => {
  const statsMap: { [key: string]: number } = {} // ID est maintenant string

  articleStore.articles.forEach(article => {
    statsMap[article.author.id] = (statsMap[article.author.id] || 0) + 1
  })

  return authorStore.authors.map(author => ({
    authorId: author.id,
    authorName: author.name,
    articleCount: statsMap[author.id] || 0
  })).sort((a, b) => b.articleCount - a.articleCount)
})

// Pagination
const paginatedAuthors = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAndSortedAuthors.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredAndSortedAuthors.value.length / itemsPerPage)
)

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

// Méthodes
function resetFilters() {
  searchQuery.value = ''
  sortAuthorsBy.value = 'name_asc'
  currentPage.value = 1
}

// Réinitialise la page quand on change filtre/tri
watch([searchQuery, sortAuthorsBy], () => {
  currentPage.value = 1
})

// SEO
useHead(() => ({
  title: 'Auteurs d\'articles'
}))
</script>
