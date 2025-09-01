<template>
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
    <!-- Chargement -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-gray-600">Chargement...</p>
    </div>

    <!-- Lien non trouvé -->
    <div v-else-if="!link" class="text-center py-12">
      <div class="text-6xl mb-4">🔗</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Lien non trouvé</h1>
      <p class="text-gray-600 mb-8">Le lien que vous recherchez n'existe pas ou a été supprimé.</p>
      <NuxtLink to="/usefullinks"
        class="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors">
        Retour au répertoire
      </NuxtLink>
    </div>

    <!-- Détails du lien -->
    <div v-else>
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <NuxtLink to="/" class="hover:text-primary">Accueil</NuxtLink>
          </li>
          <li>/</li>
          <li>
            <NuxtLink to="/usefullinks" class="hover:text-primary">Répertoire de Liens</NuxtLink>
          </li>
          <li>/</li>
          <li class="text-gray-900 font-medium">{{ link.name }}</li>
        </ol>
      </nav>

      <!-- En-tête avec logo plateforme -->
      <div class="bg-white rounded-lg shadow-md mb-8">
        <!-- En-tête dynamique -->
        <div class="relative p-8 text-white bg-cover bg-center rounded-t-lg"
          :style="platform?.logoDesk ? `background-image: url('${platform.logoDesk}')` : ''">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>

          <!-- Contenu avec z-index pour passer devant -->
          <div class="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <!-- Logo -->
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <img v-if="link.platformLogo" :src="link.platformLogo" :alt="`Logo ${link.platform}`"
                class="w-12 h-12 rounded-full object-cover" />
              <span v-else class="text-2xl font-bold">{{ link.platform.charAt(0) }}</span>
            </div>

            <!-- Texte -->
            <div class="text-center md:text-left max-w-[calc(100%-6rem)]">
              <h1 class="text-2xl md:text-3xl font-bold mb-2 break-words">
                {{ link.name }}
              </h1>
              <div class="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {{ link.platform }}
                </span>
                <span class="text-white/80 text-sm">Lien vérifié et sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Description détaillée -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p class="text-gray-700 leading-relaxed">{{ link.description }}</p>
          </div>

          <!-- Informations supplémentaires -->
          <div v-if="link.additionalInfo" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Informations complémentaires</h2>
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <p class="text-blue-800">{{ link.additionalInfo }}</p>
            </div>
          </div>

          <!-- URL et actions -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Accès direct</h2>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-700">URL complète :</span>
                <div class="flex gap-2">
                  <button @click="copyUrl"
                    class="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                    <IconCopy class="w-4 h-4" />
                    Copier
                  </button>
                  <button @click="shareLink"
                    class="flex items-center gap-2 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                    <IconShare class="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
              <div class="bg-white p-3 rounded border font-mono text-sm text-gray-800 break-all">
                {{ link.url }}
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex gap-4">
            <a :href="link.url" target="_blank" rel="noopener noreferrer"
              class="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors text-center font-medium flex items-center justify-center gap-2">
              <IconExternalLink class="w-5 h-5" />
              Accéder à {{ link.platform }}
            </a>
            <NuxtLink to="/usefullinks"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
              Retour au répertoire
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Liens similaires -->
      <div v-if="similarLinks.length > 0" class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Liens similaires de {{ link.platform }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NuxtLink v-for="similarLink in similarLinks" :key="similarLink.id" :to="`/usefullinks/${similarLink.slug}`"
            class="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all">
            <h3 class="font-medium text-gray-900 mb-2">{{ similarLink.name }}</h3>
            <p class="text-sm text-gray-600 line-clamp-2">{{ similarLink.description }}</p>
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
import { useUsefulLinksStore } from '@/stores/usefulLinks'
import { getPlatformByName } from '@/stores/platforms'

const platform = computed(() => getPlatformByName(link.value?.platform || ''))

const route = useRoute()
const store = useUsefulLinksStore()
const { links, loading } = storeToRefs(store)


const link = computed(() => store.getLinkBySlug(route.params.slug as string))

const similarLinks = computed(() => {
  if (!link.value) return []
  return store.enrichedLinks
    .filter(l => l.platform === link.value!.platform && l.id !== link.value!.id)
    .slice(0, 4)
})

const copyUrl = async () => {
  if (!link.value) return
  try {
    await navigator.clipboard.writeText(link.value.url)
    // Vous pourriez ajouter une notification toast ici
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
    // Fallback: copier l'URL
    copyUrl()
  }
}

onMounted(async () => {
  if (links.value.length === 0) {
    await store.fetchLinks()
  }
})

// SEO
useHead({
  title: computed(() => link.value ? `${link.value.name} - Répertoire de Liens` : 'Lien non trouvé'),
  meta: [
    {
      name: 'description',
      content: computed(() => link.value?.description || 'Lien non trouvé dans le répertoire')
    }
  ]
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
