<template>
  <main class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Bouton retour -->
      <button @click="$router.back()" class="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
        <IconArrowLeft class="h-5 w-5 mr-2" />
        Retour
      </button>

      <template v-if="articleStore.loading">
        <div class="text-center py-10">
          <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
          <p class="mt-2 text-gray-600">Chargement de l'article...</p>
        </div>
      </template>
      <template v-else-if="articleStore.error">
        <div class="text-center py-10">
          <p>Désolé, nous n'avons pas réussi à charger cet article</p>
        </div>
      </template>
      <template v-else-if="article">
      <!-- Contenu de l'article -->
      <article class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Image d'en-tête de l'article -->
        <div class="relative">
          <img :src="articleImageUrl" :alt="article.title" @error="handleArticleImageError"
            class="w-full h-64 md:h-96 object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

          <!-- Catégorie, titre, auteur, date -->
          <div class="absolute bottom-0 left-0 p-4 md:p-8 text-white w-full">
            <NuxtLink :to="`/blogs/cat/${article.category.slug}`" class="inline-block px-3 py-1 bg-primary text-white text-xs font-medium rounded-full mb-2 hover:bg-secondary transition">
              {{ article.category.name }}
            </NuxtLink>
            <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">{{ article.title }}</h1>
            <div class="flex flex-wrap items-center text-white/90 text-sm sm:text-base">
              <!-- Auteur -->
              <NuxtLink :to="`/blogs/author/${article.author.slug}`" class="flex items-center group">
                <img :src="authorAvatarUrl" :alt="article.author.name"
                  class="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2" />
                <span class="font-medium hover:underline">{{ article.author.name }}</span>
              </NuxtLink>
              <span class="mx-2">•</span>
              <time :datetime="article.createdAt">{{ formatDate(article.createdAt) }}</time>
              <span class="mx-2">•</span>
              <span>{{ readingTime }} min de lecture</span>
            </div>
          </div>
        </div>

        <!-- Article -->
        <div class="p-6 md:p-8 prose max-w-none" v-html="article.content"></div>

        <div class="border-t border-gray-200 p-6 md:p-8">
          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span v-for="tag in article.tags" :key="tag" class="px-3 py-1 bg-gray-100 text-sm rounded-full">
              {{ tag }}
            </span>
          </div>

          <!-- Statistiques -->
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <button @click="handleLike" class="flex items-center hover:text-primary" :class="{ 'text-secondary': isLiked }">
                <IconHeart class="h-5 w-5 mr-1" />
                <span>{{ likes }}</span>
              </button>

              <button @click="showComments = !showComments" class="flex items-center hover:text-primary">
                <IconMessageDots class="h-5 w-5 mr-1" />
                <span>{{ comments }}</span>
              </button>
            </div>

            <div class="text-gray-500">
              <span>{{ article.views.toLocaleString() }} vues</span>
            </div>
          </div>

          <!-- Bloc de commentaires -->
          <div v-if="showComments" class="mt-6 pt-6 border-t border-gray-200">
            <div class="mb-4">
              <textarea v-model="newComment" placeholder="Ajouter un commentaire..."
                class="w-full p-3 border rounded-lg focus:ring-primary focus:border-primary"></textarea>
              <button @click="addComment" class="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">
                Publier
              </button>
            </div>

            <!-- Liste des commentaires -->
            <div class="space-y-4">
              <div v-for="(comment, index) in commentList" :key="index" class="p-3 bg-gray-50 rounded-lg">
                <p class="text-gray-800">{{ comment }}</p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Articles similaires -->
      <div v-if="relatedArticles.length > 0" class="mt-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Articles similaires</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArticleCard v-for="related in relatedArticles" :key="related.id" :article="{ ...related }" />
        </div>
      </div>
      </template>

      <!-- Article absent -->
      <div v-else class="text-center bg-white rounded-xl shadow-md p-8 md:p-12">
        <h2 class="text-6xl font-extrabold text-gray-800 mb-4">Oups !</h2>
        <p class="text-lg mb-8">
          Désolé, l'article que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <NuxtLink to="/blogs" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowBack class="mr-2 -mr-1 h-5 w-5" />
          Retour aux actualités
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore, useAuthorStore } from '@/stores' 
import { IconArrowLeft, IconArrowBack, IconHeart, IconMessageDots, IconLoader } from '@tabler/icons-vue'

const route = useRoute()
const slug = route.params.slug as string

// Stores
const articleStore = useArticleStore();
const authorStore = useAuthorStore(); 

// Article correspondant au slug 
const article = computed(() => articleStore.currentArticle);

// Images
const articleImageUrl = computed(() => article.value?.imageUrl || '');
const authorAvatarUrl = computed(() => {
  const authorName = article.value?.author?.name || 'unknown';
  // Utiliser l'avatar de l'auteur depuis le authorStore
  const authorFromStore = authorStore.getAuthorById(article.value?.author?.id || '');
  if (authorFromStore?.avatar) {
    return authorFromStore.avatar;
  }
  // Si non disponible, tente d'utiliser l'avatar directement de la prop article
  if (article.value?.author?.avatar) {
    return article.value.author.avatar;
  }
  // Fallback générique si aucun avatar n'est trouvé
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
});

const handleArticleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://placehold.co/600x400/E0F2FE/0284C7?text=${article.value?.title || 'Article'}`;
};

// Infos lecture
const readingTime = computed(() => article.value ? articleStore.calculateReadingTime(article.value.content) : 0);

// Likes & commentaires simulés
const likes = ref(Math.floor(Math.random() * 100))
const isLiked = ref(false)
const comments = ref(Math.floor(Math.random() * 50))
const showComments = ref(false)
const newComment = ref('')
const commentList = ref<string[]>([])

// Actions
const handleLike = () => {
  isLiked.value = !isLiked.value
  likes.value += isLiked.value ? 1 : -1
}

const addComment = () => {
  if (newComment.value.trim()) {
    commentList.value.unshift(newComment.value)
    comments.value++
    newComment.value = ''
  }
}

onMounted(async () => {
  await authorStore.fetchAuthors();
  await articleStore.fetchArticleBySlug(slug);
  if (articleStore.articles.length === 0) {
    await articleStore.fetchArticles();
  }
});

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    await articleStore.fetchArticleBySlug(newSlug as string);
  }
});

// Liste d'articles similaires
const relatedArticles = computed(() =>
  article.value 
    ? articleStore.getFilteredAndSortedArticles({
        categoryId: article.value.category.id 
      }).filter(a => a.id !== article.value?.id).slice(0, 2)
    : []
)

// Formatage de la date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

// SEO
useHead(() => ({
  title: article.value ? article.value.title : 'Article non trouvé',
}));
</script>
