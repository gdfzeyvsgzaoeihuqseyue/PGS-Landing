<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement...</p>
    </div>

    <!-- Lien non trouvé -->
    <div v-else-if="!link" class="text-center py-12">
      <div class="text-4xl sm:text-6xl mb-4">🔗</div>
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Lien non trouvé</h1>
      <p class="text-gray-600 mb-8 px-4">Le lien que vous recherchez n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/wikilink"
        class="bg-primary text-white px-4 sm:px-6 py-3 rounded-md hover:bg-secondary transition-colors text-sm sm:text-base">
        Retour au répertoire
      </NuxtLink>
    </div>

    <!-- Détails du lien -->
    <div v-else>
      <!-- Breadcrumb -->
      <nav class="mb-6 sm:mb-8 overflow-x-auto">
        <ol class="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 whitespace-nowrap">
          <li>
            <NuxtLink to="/" class="hover:text-primary">Accueil</NuxtLink>
          </li>
          <li>/</li>
          <li>
            <NuxtLink to="/wikilink" class="hover:text-primary">Répertoire de Liens</NuxtLink>
          </li>
          <li>/</li>
          <li class="text-gray-900 font-medium truncate max-w-32 sm:max-w-none">{{ link.name }}</li>
        </ol>
      </nav>

      <!-- En-tête avec logo plateforme -->
      <div class="bg-white rounded-lg shadow-md mb-6 sm:mb-8 overflow-hidden">
        <!-- En-tête dynamique -->
        <div class="relative p-8 text-white bg-no-repeat bg-center rounded-t-lg" :style="headerBackgroundStyle">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>

          <!-- Contenu avec z-index pour passer devant -->
          <div class="relative z-10 flex flex-col items-center gap-4 sm:gap-6 sm:flex-row">
            <!-- Logo -->
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <img :src="link.platform?.logo" :alt="`Logo ${link.platform?.name}`"
                class="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
                @error="handleImageError($event, link.platform?.name || 'Platform')" />
            </div>

            <!-- Texte -->
            <div class="text-center sm:text-left flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 break-words leading-tight">
                {{ link.name }}
              </h1>
              <div
                class="flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <span class="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {{ link.platform?.name }}
                </span>
                <span class="text-white/80 text-xs sm:text-sm">Lien vérifié et sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 sm:p-6 lg:p-8">
          <!-- Description détaillée -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-700 leading-relaxed text-sm sm:text-base">{{ link.description }}</p>
          </div>

          <!-- Informations complémentaires -->
          <div v-if="link.additionalInfo" class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Informations complémentaires</h2>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-lg">
              <p class="text-blue-800 text-sm sm:text-base">{{ link.additionalInfo }}</p>
            </div>
          </div>

          <!-- URL et actions -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Accès direct</h2>
            <div class="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <span class="text-xs sm:text-sm font-medium text-gray-700">URL complète :</span>
                <div class="flex gap-2 self-end sm:self-auto">
                  <button @click="copyUrl"
                    class="flex items-center gap-2 px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                    <IconCopy class="w-3 h-3 sm:w-4 sm:h-4" />
                    <span class="hidden xs:inline">Copier</span>
                  </button>
                  <button @click="shareLink"
                    class="flex items-center gap-2 px-2 sm:px-3 py-1 bg-white border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                    <IconShare class="w-3 h-3 sm:w-4 sm:h-4" />
                    <span class="hidden xs:inline">Partager</span>
                  </button>
                </div>
              </div>
              <div
                class="bg-white p-2 sm:p-3 rounded border font-mono text-xs sm:text-sm text-gray-800 break-all overflow-wrap-anywhere">
                {{ link.url }}
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a :href="link.url" target="_blank" rel="noopener noreferrer"
              class="flex-1 bg-primary text-white px-4 sm:px-6 py-3 rounded-md hover:bg-secondary transition-colors text-center font-medium flex items-center justify-center gap-2 text-sm sm:text-base">
              <IconExternalLink class="w-4 h-4 sm:w-5 sm:h-5" />
              Accéder à {{ link.platform?.name }}
            </a>
            <NuxtLink to="/wikilink"
              class="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium text-center text-sm sm:text-base">
              Retour au répertoire
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Liens similaires -->
      <div v-if="similarLinks.length > 0" class="bg-white rounded-lg shadow-md p-4 sm:p-6 lg:p-8">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Liens similaires de {{ link.platform?.name }}
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <NuxtLink v-for="similarLink in similarLinks" :key="similarLink.id" :to="`/wikilink/${similarLink.slug}`"
            class="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all">
            <h3 class="font-medium text-gray-900 mb-2 text-sm sm:text-base line-clamp-1">{{ similarLink.name }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 line-clamp-2">{{ similarLink.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { IconCopy, IconShare, IconExternalLink } from '@tabler/icons-vue'
import { useSolutionStore } from '@/stores/solutions'
import type { PlateformWiki } from '@/types';

const route = useRoute()
const solutionStore = useSolutionStore()
const { allWikis: links, loading } = storeToRefs(solutionStore)

const enrichedLinks = computed(() => {
  return links.value.map((link, index) => ({
    ...link,
    order: index + 1,
  }));
});

const link = computed<PlateformWiki | undefined>(() => {
  const foundLink = enrichedLinks.value.find(l => l.slug === (route.params.slug as string));
  return foundLink;
});

const similarLinks = computed(() => {
  if (!link.value || !link.value.platform?.id) return []
  return enrichedLinks.value
    .filter(l => l.platform?.id === link.value!.platform.id && l.id !== link.value!.id)
    .slice(0, 4)
})

const copyUrl = async () => {
  if (!link.value) return
  try {
    await navigator.clipboard.writeText(link.value.url)
  } catch (err) {
    console.error('Erreur lors de la copie:', err)
  }
}

const shareLink = async () => {
  if (!link.value) return
  if (navigator.share) {
    try {
      await navigator.share({
        title: link.value.name,
        text: link.value.description,
        url: link.value.url
      })
    } catch (err) {
      console.error('Erreur lors du partage:', err)
    }
  } else {
    copyUrl()
  }
}

const handleImageError = (event: Event, platformName: string) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(platformName)}`;
  target.alt = `Logo de ${platformName} non disponible`;
};

const headerBackgroundStyle = computed(() => {
  if (link.value?.platform?.logoDesk) {
    return {
      'background-image': `url('${link.value.platform.logoDesk}')`,
      'background-size': 'contain',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'min-height': '120px',
      '@media (min-width: 640px)': {
        'background-size': 'cover',
      },
    };
  }
  return { 'min-height': '120px' };
});

onMounted(async () => {
  if (links.value.length === 0) {
    await solutionStore.fetchPlateformWikis(undefined, undefined, true)
  }
})

// SEO
useHead({
  title: computed(() => link.value ? `${link.value.name}` : 'Lien non trouvé'),
  meta: [
    {
      name: 'description',
      content: computed(() => link.value?.description || 'Lien non trouvé dans le répertoire')
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ]
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overflow-wrap-anywhere {
  overflow-wrap: anywhere;
}

@media (min-width: 475px) {
  .xs\:inline {
    display: inline;
  }
}

.min-w-0 {
  min-width: 0;
}
</style>
