<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    <div class="flex items-start gap-4">
      <!-- Ordre et logo plateforme -->
      <div class="flex-shrink-0 flex flex-col items-center gap-2">
        <span class="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">#{{ link.order }}</span>
        <img :src="link.platform?.logo" :alt="`Logo ${link.platform?.name}`" class="w-8 h-8 rounded-full"
          @error="handleImageError($event, link.platform?.name || 'Platform')" />
      </div>

      <!-- Contenu principal -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-900 hover:text-primary transition-colors">
            <NuxtLink :to="`/usefullinks/${link.slug}`">
              {{ link.name }}
            </NuxtLink>
          </h3>
          <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full ml-2">
            {{ link.platform?.name }}
          </span>
        </div>

        <p class="text-gray-600 text-sm mb-3">{{ link.description }}</p>

        <!-- URL et actions -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <span class="text-xs text-gray-500">URL:</span>
            <div class="bg-gray-50 px-2 py-1 rounded text-xs font-mono text-gray-700 truncate flex-1">
              {{ showFullUrl ? link.url : truncatedUrl }}
            </div>
            <div class="flex items-center gap-1">
              <button @click="copyUrl" class="p-1 text-gray-400 hover:text-primary" title="Copier l'URL">
                <IconCopy class="w-4 h-4" />
              </button>
              <button @click="toggleFullUrl" class="p-1 text-gray-400 hover:text-primary"
                title="Afficher l'URL complète">
                <IconEye class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex gap-2 ml-4">
            <a :href="link.url" target="_blank" rel="noopener noreferrer"
              class="bg-primary text-white px-3 py-1 rounded text-xs font-medium hover:bg-secondary truncate max-w-[140px] text-center"
              :title="`Aller à ${link.name}`">
              Aller à {{ link.name }}
            </a>
            <NuxtLink :to="`/usefullinks/${link.slug}`"
              class="border border-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
              Détails
            </NuxtLink>
          </div>
        </div>
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
  if (props.link.url.length <= 40) return props.link.url
  return props.link.url.substring(0, 37) + '...'
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
