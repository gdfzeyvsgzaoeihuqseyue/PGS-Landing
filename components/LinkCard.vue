<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
    <div class="p-6">
      <!-- En-tête avec ordre et plateforme -->
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">#{{ link.order }}</span>

        <!-- Affichage logo + nom plateforme -->
        <div class="flex items-center gap-2">
          <img :src="link.platform.logo" :alt="`Logo ${link.platform?.name}`" class="w-5 h-5 rounded-full"
            @error="handleImageError($event, link.platform?.name || 'Platform')" />
          <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {{ link.platform?.name }}
          </span>
        </div>
      </div>

      <!-- Nom du lien -->
      <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
        <NuxtLink :to="`/wiki/${link.slug}`">
          {{ link.name }}
        </NuxtLink>
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ link.description }}</p>

      <!-- URL avec boutons -->
      <div class="mb-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-gray-500">URL:</span>
          <div class="flex items-center gap-1">
            <button @click="copyUrl" class="p-1 text-gray-400 hover:text-primary" title="Copier l'URL">
              <IconCopy class="w-4 h-4" />
            </button>
            <button @click="toggleFullUrl" class="p-1 text-gray-400 hover:text-primary" title="Afficher l'URL complète">
              <IconEye class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 break-all">
          {{ showFullUrl ? link.url : truncatedUrl }}
        </div>
      </div>

      <!-- Boutons -->
      <div class="flex gap-2">
        <a :href="link.url" target="_blank" rel="noopener noreferrer"
          class="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary text-center text-sm font-medium truncate"
          :title="`Aller à ${link.name}`">
          Aller à {{ link.name }}
        </a>
        <NuxtLink :to="`/wiki/${link.slug}`"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
          Détails
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconCopy, IconEye } from '@tabler/icons-vue'
import type { PlateformWiki } from '@/types'

interface Props {
  link: PlateformWiki
}

const props = defineProps<Props>()
const showFullUrl = ref(false)

const truncatedUrl = computed(() => {
  if (props.link.url.length <= 30) return props.link.url
  return props.link.url.substring(0, 27) + '...'
})

const toggleFullUrl = () => {
  showFullUrl.value = !showFullUrl.value
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(props.link.url)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

const handleImageError = (event: Event, platformName: string) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(platformName)}`;
  target.alt = `Logo de ${platformName} non disponible`;
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
