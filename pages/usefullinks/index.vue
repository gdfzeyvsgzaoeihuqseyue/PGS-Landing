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

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Panneau latéral de navigation -->
      <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
        <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
          <!-- En-tête mobile -->
          <div class="flex justify-between items-center mb-6 lg:hidden">
            <h3 class="text-lg font-bold">Filtres</h3>
            <button @click="showSidebar = false" class="text-gray-500">
              <IconX class="h-6 w-6" />
            </button>
          </div>

          <!-- Contrôles d'affichage -->
          <div class="mb-6">
            <div class="mb-8">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Affichage</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-secondary">{{ links.length }}</p>
                  <p class="text-gray-600">Liens disponibles</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-500">{{ availablePlatforms.length }}</p>
                  <p class="text-gray-600">Plateformes</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-purple-500">{{ availableLetters.length }}</p>
                  <p class="text-gray-600">Catégories alphabétiques</p>
                </div>
              </div>
            </div>


            <div class="flex gap-2">
              <button @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors">
                <IconGrid3x3 class="w-4 h-4 mx-auto" />
              </button>
              <button @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 px-3 py-2 rounded text-sm font-medium transition-colors">
                <IconList class="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          <!-- Filtres -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Filtrer par</h3>
            <div class="space-y-2">
              <button @click="filterMode = 'alphabetical'"
                :class="filterMode === 'alphabetical' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="w-full px-3 py-2 rounded text-sm font-medium transition-colors text-left">
                Alphabétique
              </button>
              <button @click="filterMode = 'platform'"
                :class="filterMode === 'platform' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="w-full px-3 py-2 rounded text-sm font-medium transition-colors text-left">
                Par plateforme
              </button>
            </div>
          </div>

          <!-- Navigation rapide -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Navigation rapide</h3>
            <div v-if="filterMode === 'alphabetical'" class="grid grid-cols-4 gap-1">
              <button v-for="letter in availableLetters" :key="letter" @click="scrollToSection(letter)"
                :class="selectedFilter === letter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="p-2 rounded text-xs font-medium transition-colors">
                {{ letter }}
              </button>
            </div>
            <div v-else class="grid grid-cols-2 gap-1">
              <button v-for="platform in availablePlatforms" :key="platform" @click="scrollToSection(platform)"
                :class="selectedFilter === platform ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="w-full px-3 py-2 rounded text-xs font-medium transition-colors text-left truncate">
                {{ platform }}
              </button>
            </div>
          </div>

          <!-- Tri -->
          <div class="mt-6 pt-6 border-t">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Tri</h3>
            <select v-model="sortOrder"
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-primary focus:ring-primary">
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>

          <!-- Bouton de réinitialisation -->
          <button @click="resetFilters"
            class="w-full px-4 py-2 mt-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
            Réinitialiser les filtres
          </button>
        </div>
      </aside>

      <!-- Contenu principal -->
      <div class="flex-1">
        <!-- Bouton sidebar mobile -->
        <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
          <IconFilter class="h-5 w-5 mr-2" />
          Filtres et statistiques
        </button>

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
          <!-- Affichage des liens -->
          <div v-if="filterMode === 'alphabetical'">
            <div v-for="(linksGroup, letter) in groupedLinks" :key="letter" :id="`section-${letter}`" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary">
                {{ letter }}
              </h2>

              <!-- Grille -->
              <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <LinkCard v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>

              <!-- Liste -->
              <div v-else class="space-y-4">
                <LinkListItem v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>
            </div>
          </div>

          <div v-else>
            <div v-for="(linksGroup, platform) in groupedLinks" :key="platform" :id="`section-${platform}`"
              class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary">
                {{ platform }}
              </h2>

              <!-- Grille -->
              <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
import { IconGrid3x3, IconList, IconFilter, IconX } from '@tabler/icons-vue'
import { useUsefulLinksStore } from '@/stores/usefulLinks'
import LinkCard from '~/components/LinkCard.vue'
import LinkListItem from '~/components/LinkListItem.vue'

const store = useUsefulLinksStore()
const { links, loading, error } = storeToRefs(store)

const showSidebar = ref(false); // New ref for sidebar visibility
const viewMode = ref<'grid' | 'list'>('grid')
const filterMode = ref<'alphabetical' | 'platform'>('alphabetical')
const sortOrder = ref<'asc' | 'desc'>('asc')
const selectedFilter = ref<string>('')

const groupedLinks = computed(() => {
  let result;
  if (filterMode.value === 'alphabetical') {
    result = sortOrder.value === 'asc' ? store.sortedAlphabetically : store.sortedAlphabeticallyReverse;
    const grouped: Record<string, any[]> = {};
    result.forEach(link => {
      const firstLetter = link.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(link);
    });
    return grouped;
  } else {
    result = sortOrder.value === 'asc' ? store.enrichedLinks.sort((a, b) => a.platform.localeCompare(b.platform)) : store.enrichedLinks.sort((a, b) => b.platform.localeCompare(a.platform));
    const grouped: Record<string, any[]> = {};
    result.forEach(link => {
      if (!grouped[link.platform]) {
        grouped[link.platform] = [];
      }
      grouped[link.platform].push(link);
    });
    return grouped;
  }
})

const availableLetters = computed(() => {
  return store.letters
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

const resetFilters = () => {
  viewMode.value = 'grid';
  filterMode.value = 'alphabetical';
  sortOrder.value = 'asc';
  selectedFilter.value = '';
  showSidebar.value = false; // Close sidebar on reset
};

onMounted(async () => {
  await store.fetchLinks()
})

// SEO
useHead(() => ({
  title: 'Lien rapides',
}));
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
