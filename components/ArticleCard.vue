<template>
  <article class="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
    <!-- Image de l'article -->
    <div class="relative h-48 overflow-hidden bg-gray-100">
      <NuxtLink :to="`/blog/${article.slug}`">
        <img :src="articleImageUrl" :alt="article.title" @error="handleArticleImageError"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </NuxtLink>

      <!-- Badge de catégorie -->
      <NuxtLink :to="`/blog/cat/${article.category.slug}`"
        class="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full hover:bg-secondary transition hover:scale-105">
        {{ article.category.name }}
      </NuxtLink>
    </div>

    <!-- Contenu de la carte -->
    <div class="p-5">
      <!-- Métadonnées : date + durée de lecture -->
      <div class="flex items-center text-xs text-gray-500 mb-2">
        <time :datetime="article.createdAt">{{ formatDate(article.createdAt) }}</time>
        <span class="mx-2">•</span>
        <span>{{ articleStore.calculateReadingTime(article.content) }} min de lecture</span>
      </div>

      <h3 class="text-lg font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
        <NuxtLink :to="`/blog/${article.slug}`">{{ article.title }}</NuxtLink>
      </h3>

      <!-- Extrait de l'article -->
      <p class="text-gray-600 mb-3 line-clamp-2">{{ article.excerpt }}</p>

      <div class="flex items-center justify-between">
        <!-- Auteur -->
        <div class="flex items-center">
          <NuxtLink :to="`/blog/author/${article.author.slug}`" class="flex items-center group">
            <img :src="authorAvatarUrl" :alt="article.author.name" @error="handleAvatarError"
              class="w-6 h-6 rounded-full mr-2" />
            <span class="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
              {{ article.author.name }}
            </span>
          </NuxtLink>
        </div>

        <!-- Statistiques de vues -->
        <div class="flex items-center space-x-3 text-gray-500">
          <span class="flex items-center text-xs">
            <IconEye class="h-4 w-4 mr-1" />
            {{ article.views?.toLocaleString() || 0 }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useArticleStore, useAuthorStore } from '@/stores';
import type { Article as ArticleType } from '@/types';
import { ref, computed } from 'vue';
import { IconEye } from '@tabler/icons-vue';

const props = defineProps<{
  article: ArticleType;
}>();

const articleStore = useArticleStore();
const authorStore = useAuthorStore();
const articleImageUrl = ref(props.article.imageUrl);

// URL de l'avatar de l'auteur
const authorAvatarUrl = computed(() => {
  // Utiliser l'avatar directement
  if (props.article.author?.avatar) {
    return props.article.author.avatar;
  }
  // Si non récupérer depuis le authorStore
  const authorFromStore = authorStore.getAuthorById(props.article.author.id);
  if (authorFromStore?.avatar) {
    return authorFromStore.avatar;
  }
  // Si aucun avatar n'est trouvé
  const authorName = props.article.author?.name || 'Auteur';
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
});

const handleArticleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://placehold.co/600x400/E0F2FE/0284C7?text=${props.article.title}`;
};

const handleAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const authorName = props.article.author?.name || 'unknown';
  target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(authorName)}`;
};

// Formatage de la date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
</script>
