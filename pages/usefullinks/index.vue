<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <header class="text-center mb-12 py-6 mt-8">
      <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
        Répertoire de <span class="text-primary">liens utiles</span> 
      </h1>
      <p class="mt-4 text-xl max-w-2xl mx-auto">
        Découvrez tous les liens utiles de l'écosystème LocaSpace et de nos partenaires. 
        Organisés et facilement accessibles pour optimiser votre expérience.
      </p>
    </header>

    <div class="flex gap-8">
      <!-- Panneau latéral de navigation -->
      <div class="w-64 flex-shrink-0">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <!-- Contrôles d'affichage -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Affichage</h3>
            <div class="flex gap-2">
              <button 
                @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors"
              >
                <IconGrid3x3 class="w-4 h-4 mx-auto" />
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors"
              >
                <IconList class="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <!-- Filtres -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Filtrer par</h3>
            <div class="space-y-2">
              <button 
                @click="filterMode = 'alphabetical'"
                :class="filterMode === 'alphabetical' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="w-full px-3 py-2 rounded text-sm font-medium transition-colors text-left"
              >
                Alphabétique
              </button>
              <button 
                @click="filterMode = 'platform'"
                :class="filterMode === 'platform' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="w-full px-3 py-2 rounded text-sm font-medium transition-colors text-left"
              >
                Par plateforme
              </button>
            </div>
          </div>

          <!-- Navigation rapide -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Navigation rapide</h3>
            <div v-if="filterMode === 'alphabetical'" class="grid grid-cols-4 gap-1">
              <button 
                v-for="letter in availableLetters" 
                :key="letter"
                @click="scrollToSection(letter)"
                :class="selectedFilter === letter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="p-2 rounded text-xs font-medium transition-colors"
              >
                {{ letter }}
              </button>
            </div>
            <div v-else class="grid grid-cols-2 gap-1">
              <button 
                v-for="platform in availablePlatforms" 
                :key="platform"
                @click="scrollToSection(platform)"
                :class="selectedFilter === platform ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="w-full px-3 py-2 rounded text-xs font-medium transition-colors text-left truncate"
              >
                {{ platform }}
              </button>
            </div>
          </div>

          <!-- Tri -->
          <div class="mt-6 pt-6 border-t">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Tri</h3>
            <select 
              v-model="sortOrder"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-primary focus:ring-primary"
            >
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex-1">
        <!-- Chargement -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-4 text-gray-600">Chargement des liens...</p>
        </div>

        <!-- Erreur -->
        <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
          <p class="text-red-700">{{ error }}</p>
        </div>

        <!-- Contenu -->
        <div v-else>
          <!-- Statistiques -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ links.length }}</div>
                <div class="text-sm text-gray-600">Liens disponibles</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ availablePlatforms.length }}</div>
                <div class="text-sm text-gray-600">Plateformes</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ availableLetters.length }}</div>
                <div class="text-sm text-gray-600">Catégories alphabétiques</div>
              </div>
            </div>
          </div>

          <!-- Affichage des liens -->
          <div v-if="filterMode === 'alphabetical'">
            <div 
              v-for="(linksGroup, letter) in groupedLinks" 
              :key="letter"
              :id="`section-${letter}`"
              class="mb-12"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary">
                {{ letter }}
              </h2>
              
              <!-- Grille -->
              <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LinkCard v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>
              
              <!-- Liste -->
              <div v-else class="space-y-4">
                <LinkListItem v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>
            </div>
          </div>

          <div v-else>
            <div 
              v-for="(linksGroup, platform) in groupedLinks" 
              :key="platform"
              :id="`section-${platform}`"
              class="mb-12"
            >
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary">
                {{ platform }}
              </h2>
              
              <!-- Grille -->
              <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LinkCard v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>
              
              <!-- Liste -->
              <div v-else class="space-y-4">
                <LinkListItem v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { IconGrid3x3, IconList } from '@tabler/icons-vue'
import { useUsefulLinksStore } from '@/stores/usefulLinks'
import LinkCard from '~/components/LinkCard.vue'
import LinkListItem from '~/components/LinkListItem.vue'

const store = useUsefulLinksStore()
const { links, loading, error } = storeToRefs(store)

const viewMode = ref<'grid' | 'list'>('grid')
const filterMode = ref<'alphabetical' | 'platform'>('alphabetical')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedFilter = ref<string>('')

const groupedLinks = computed(() => {
  if (filterMode.value === 'alphabetical') {
    const grouped = store.groupedByLetter
    if (sortOrder.value === 'desc') {
      const reversed: Record<string, any> = {}
      Object.keys(grouped).sort().reverse().forEach(key => {
        reversed[key] = grouped[key]
      })
      return reversed
    }
    return grouped
  } else {
    return store.groupedByPlatform
  }
})

const availableLetters = computed(() => {
  return sortOrder.value === 'asc' ? store.letters : [...store.letters].reverse()
})

const availablePlatforms = computed(() => {
  return store.platforms
})

const scrollToSection = (section: string) => {
  selectedFilter.value = section
  nextTick(() => {
    const element = document.getElementById(`section-${section}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

onMounted(async () => {
  await store.fetchLinks()
})

// SEO
useHead(() => ({
  title: 'Lien rapides',
}));
</script>
