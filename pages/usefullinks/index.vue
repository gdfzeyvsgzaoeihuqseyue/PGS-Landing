<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
     <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        Wiki<span class="text-primary">links</span>
      </h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Découvrez tous les liens utiles de l'écosystème LocaSpace et de nos partenaires. Organisés et facilement accessibles pour optimiser votre expérience.
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
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold">{{ links.length }}</p>
                  <p class="text-gray-600">Liens</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ availablePlatforms.length }}</p>
                  <p class="text-gray-600">Plateformes</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ availableLetters.length }}</p>
                  <p class="text-gray-600">Lettres</p>
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
            <div class="grid grid-cols-2 gap-4">
              <button @click="setFilterMode('alphabetical')"
                :class="filterMode === 'alphabetical' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
                class="w-full px-3 py-2 rounded text-sm font-medium transition-colors text-left">
                Alphabétique
              </button>
              <button @click="setFilterMode('platform')"
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
              <button v-for="letter in availableLetters" :key="letter" @click="applyFilter(letter, 'startLetter')"
                :class="selectedLetter === letter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="p-2 rounded text-xs font-medium transition-colors">
                {{ letter }}
              </button>
            </div>
            <div v-else class="grid grid-cols-2 gap-1">
              <button v-for="platform in availablePlatforms" :key="platform.id" @click="applyFilter(platform.id, 'platformId')"
                :class="selectedPlatformId === platform.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="w-full px-3 py-2 rounded text-xs font-medium transition-colors text-left truncate">
                {{ platform.name }}
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
          <IconLoader class="animate-spin h-12 w-12 text-primary mx-auto" />
          <p class="mt-4 text-gray-600">Chargement des liens utiles...</p>
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

          <div v-if="showPaginationControls" class="flex justify-center mt-8">
            <button v-if="hasMore" @click="loadMore"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium mr-4">
              Voir plus ({{ remainingCount }})
            </button>
            <button v-if="isNotInitialPage" @click="viewLess"
              class="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Voir moins
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { IconGrid3x3, IconList, IconFilter, IconX, IconLoader } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import LinkCard from '~/components/LinkCard.vue';
import LinkListItem from '~/components/LinkListItem.vue';
import type { PlateformWiki, Solution } from '@/types';

const solutionStore = useSolutionStore();
const { allWikis: links, loading, error, pagination, counts } = storeToRefs(solutionStore);

const showSidebar = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const filterMode = ref<'alphabetical' | 'platform'>('alphabetical');
const sortOrder = ref<'asc' | 'desc'>('asc');
const selectedLetter = ref<string | null>(null);
const selectedPlatformId = ref<string | null>(null);

const currentPage = ref(1);
const limitPerPage = 10;

// Calculer le nombre total basé sur le filtre actif
const currentTotalCount = computed(() => {
  if (filterMode.value === 'alphabetical' && selectedLetter.value) {
    return counts.value.byLetter[selectedLetter.value] || 0;
  }
  if (filterMode.value === 'platform' && selectedPlatformId.value) {
    // Trouvez le nom de la plateforme pour obtenir le décompte
    const platform = availablePlatforms.value.find(p => p.id === selectedPlatformId.value);
    const platformName = platform ? platform.name : 'Inconnue';
    return counts.value.byPlatform[platformName]?.count || 0;
  }
  return pagination.value.totalSolutions;
});

// Affichez les contrôles de pagination basés sur le décompte actuel
const hasMore = computed(() => links.value.length < currentTotalCount.value);
const remainingCount = computed(() => currentTotalCount.value - links.value.length);
const isNotInitialPage = computed(() => currentPage.value > 1);
const showPaginationControls = computed(() => links.value.length > 0 && (hasMore.value || isNotInitialPage.value));

const allPlatforms = ref<Solution[]>([]);

const setFilterMode = async (mode: 'alphabetical' | 'platform') => {
  if (filterMode.value === mode) return;
  filterMode.value = mode;
  selectedLetter.value = null;
  selectedPlatformId.value = null;
  currentPage.value = 1;
  await fetchData();
};

const applyFilter = async (value: string, type: 'startLetter' | 'platformId') => {
  if (type === 'startLetter') {
    selectedLetter.value = value;
    selectedPlatformId.value = null;
  } else {
    selectedPlatformId.value = value;
    selectedLetter.value = null;
  }
  currentPage.value = 1;
  await fetchData();
};

const resetFilters = async () => {
  viewMode.value = 'grid';
  filterMode.value = 'alphabetical';
  sortOrder.value = 'asc';
  selectedLetter.value = null;
  selectedPlatformId.value = null;
  currentPage.value = 1;
  showSidebar.value = false;
  await fetchData();
};

const loadMore = async () => {
  currentPage.value++;
  await fetchData(true);
};

const viewLess = async () => {
  currentPage.value = 1;
  await fetchData();
};

const fetchData = async (loadMore: boolean = false) => {
  const currentLetter = selectedLetter.value;
  const currentPlatform = selectedPlatformId.value;
  
  await solutionStore.fetchPlateformWikis(
    currentPage.value,
    limitPerPage,
    false,
    currentLetter,
    currentPlatform,
    loadMore
  );
};

const sortedAlphabetically = computed(() => {
  return [...links.value].sort((a, b) => a.name.localeCompare(b.name));
});

const sortedAlphabeticallyReverse = computed(() => {
  return [...links.value].sort((a, b) => b.name.localeCompare(a.name));
});

const groupedLinks = computed(() => {
  let result: PlateformWiki[];
  if (filterMode.value === 'alphabetical') {
    result = sortOrder.value === 'asc' ? sortedAlphabetically.value : sortedAlphabeticallyReverse.value;
    const grouped: Record<string, PlateformWiki[]> = {};
    result.forEach(link => {
      const firstLetter = link.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(link);
    });
    return grouped;
  } else {
    result = sortOrder.value === 'asc' ? links.value.sort((a, b) => (a.platform?.name || '').localeCompare(b.platform?.name || '')) : links.value.sort((a, b) => (b.platform?.name || '').localeCompare(a.platform?.name || ''));
    const grouped: Record<string, PlateformWiki[]> = {};
    result.forEach(link => {
      const platformName = link.platform?.name || 'Inconnue';
      if (!grouped[platformName]) {
        grouped[platformName] = [];
      }
      grouped[platformName].push(link);
    });
    return grouped;
  }
});

const availableLetters = computed(() => {
  return Object.keys(counts.value.byLetter).sort();
});

const availablePlatforms = computed(() => {
  return Object.keys(counts.value.byPlatform).sort().map(name => {
    return {
      id: counts.value.byPlatform[name]?.id || '',
      name: name,
    };
  });
});

onMounted(async () => {
  await solutionStore.fetchCounts();
  await solutionStore.fetchSolutions(1, 100, true);
  allPlatforms.value = solutionStore.solutions;
  if (links.value.length === 0) {
    await fetchData();
  }
});

// SEO
useHead(() => ({
  title: 'Lien rapides',
}));
</script>
