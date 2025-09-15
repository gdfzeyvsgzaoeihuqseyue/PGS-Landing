<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        Wiki<span class="text-primary">links</span>
      </h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Découvrez tous les liens utiles de l'écosystème Pro Gestion Soft et de nos partenaires. Organisés et facilement
        accessibles pour optimiser votre expérience.
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
                  <p class="text-2xl font-bold">{{ filteredLinksCount }}</p>
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

          <!-- Barre de recherche -->
          <div class="mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Rechercher un lien</h3>
            <input v-model="searchQuery" type="search" placeholder="Rechercher..."
              class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-primary focus:ring-primary">
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
              <button v-for="letter in availableLetters" :key="letter" @click="toggleLetterFilter(letter)"
                :class="selectedLetter === letter ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                class="p-2 rounded text-xs font-medium transition-colors">
                {{ letter }}
              </button>
            </div>
            <div v-else class="grid grid-cols-2 gap-1">
              <button v-for="platform in availablePlatforms" :key="platform.id"
                @click="togglePlatformFilter(platform.id)"
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
          <div v-if="Object.keys(groupedLinks).length > 0">
            <div v-for="(linksGroup, key) in groupedLinks" :key="key" :id="`section-${key}`" class="mb-12">
              <h2 class="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-primary">
                {{ key }}
              </h2>

              <!-- Grille -->
              <div v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <LinkCard v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>

              <!-- Liste -->
              <div v-else class="space-y-4">
                <LinkListItem v-for="link in linksGroup" :key="link.id" :link="link" />
              </div>

              <!-- Bouton Voir plus/moins -->
              <div v-if="getOriginalGroupSize(key) > 3" class="text-center mt-6">
                <button @click="toggleGroupExpansion(key)"
                  class="text-gray-800 hover:font-bold transition">
                  {{ expandedGroups[key] ? 'Voir moins' : `Voir plus (${getOriginalGroupSize(key) - 3})` }}
                </button>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun lien trouvé</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="resetFilters" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { IconGrid3x3, IconList, IconFilter, IconX, IconLoader } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import LinkCard from '~/components/LinkCard.vue';
import LinkListItem from '~/components/LinkListItem.vue';
import type { PlateformWiki, Solution } from '@/types';

const solutionStore = useSolutionStore();
const { allWikis: links, loading, error, counts } = storeToRefs(solutionStore);

const showSidebar = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');
const filterMode = ref<'alphabetical' | 'platform'>('alphabetical');
const sortOrder = ref<'asc' | 'desc'>('asc');
const selectedLetter = ref<string | null>(null);
const selectedPlatformId = ref<string | null>(null);
const searchQuery = ref(''); 
const expandedGroups = ref<Record<string, boolean>>({});

const allPlatforms = ref<Solution[]>([]);

// Computed property to get the count of currently filtered links
const filteredLinksCount = computed(() => {
  let currentLinks = [...links.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    currentLinks = currentLinks.filter(link =>
      link.name.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.platform?.name.toLowerCase().includes(query)
    );
  }
  return currentLinks.length;
});

// Function to get the original size of a group before slicing for 'View More/Less'
const getOriginalGroupSize = (key: string) => {
  let currentLinks = [...links.value];
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    currentLinks = currentLinks.filter(link =>
      link.name.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.platform?.name.toLowerCase().includes(query)
    );
  }

  let grouped: Record<string, PlateformWiki[]> = {};
  if (filterMode.value === 'alphabetical') {
    currentLinks.forEach(link => {
      const firstLetter = link.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(link);
    });
  } else {
    currentLinks.forEach(link => {
      const platformName = link.platform?.name || 'Inconnue';
      if (!grouped[platformName]) {
        grouped[platformName] = [];
      }
      grouped[platformName].push(link);
    });
  }
  return grouped[key]?.length || 0;
};


const setFilterMode = async (mode: 'alphabetical' | 'platform') => {
  if (filterMode.value === mode) return;
  filterMode.value = mode;
  selectedLetter.value = null;
  selectedPlatformId.value = null;
  searchQuery.value = ''; 
  expandedGroups.value = {}; 
  await fetchData();
};

// Toggle letter filter (deselection included)
const toggleLetterFilter = async (letter: string) => {
  if (selectedLetter.value === letter) {
    selectedLetter.value = null;
  } else {
    selectedLetter.value = letter;
    selectedPlatformId.value = null;
  }
  expandedGroups.value = {};
  await fetchData();
};

// Toggle platform filter (deselection included)
const togglePlatformFilter = async (platformId: string) => {
  if (selectedPlatformId.value === platformId) {
    selectedPlatformId.value = null;
  } else {
    selectedPlatformId.value = platformId;
    selectedLetter.value = null; // Deselect letter filter if platform is selected
  }
  expandedGroups.value = {}; // Reset expanded groups
  await fetchData();
};

const resetFilters = async () => {
  viewMode.value = 'grid';
  filterMode.value = 'alphabetical';
  sortOrder.value = 'asc';
  searchQuery.value = '';
  selectedLetter.value = null;
  selectedPlatformId.value = null;
  showSidebar.value = false;
  expandedGroups.value = {}; 
  await fetchData();
};

// Toggle expansion for a specific group
const toggleGroupExpansion = (key: string) => {
  expandedGroups.value[key] = !expandedGroups.value[key];
};

const fetchData = async () => {
  const currentLetter = selectedLetter.value;
  const currentPlatform = selectedPlatformId.value;

  await solutionStore.fetchPlateformWikis(
    1, // page (can be 1 as 'all' is true)
    1000, // limit (can be a large number as 'all' is true)
    true, // tout
    currentLetter,
    currentPlatform,
    false // loadMore is not needed here as we fetch all for the filter
  );
};

const groupedLinks = computed(() => {
  let result: PlateformWiki[];
  // Start with all fetched wikis
  let currentLinks = [...links.value];

  // Apply search query filter first
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    currentLinks = currentLinks.filter(link =>
      link.name.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.platform?.name.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  if (sortOrder.value === 'asc') {
    currentLinks.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    currentLinks.sort((a, b) => b.name.localeCompare(a.name));
  }

  const grouped: Record<string, PlateformWiki[]> = {};

  if (filterMode.value === 'alphabetical') {
    currentLinks.forEach(link => {
      const firstLetter = link.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(link);
    });
  } else { 
    currentLinks.forEach(link => {
      const platformName = link.platform?.name || 'Inconnue';
      if (!grouped[platformName]) {
        grouped[platformName] = [];
      }
      grouped[platformName].push(link);
    });
  }

  // Apply display limit based on expandedGroups
  const finalGrouped: Record<string, PlateformWiki[]> = {};
  for (const key in grouped) {
    if (Object.prototype.hasOwnProperty.call(grouped, key)) {
      finalGrouped[key] = expandedGroups.value[key] ? grouped[key] : grouped[key].slice(0, 3);
    }
  }
  return finalGrouped;
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
  await solutionStore.fetchSolutions(1, 100, true); // Fetch all solutions for platform info
  allPlatforms.value = solutionStore.solutions;
  await fetchData(); // Initial fetch of wikis
});

// Watch for changes in filters or search query to re-fetch data and reset expanded groups
watch([selectedLetter, selectedPlatformId, sortOrder, searchQuery], () => {
  expandedGroups.value = {}; // Reset expanded groups when main filters change
  fetchData(); // Re-fetch data when search query changes
});

// SEO
useHead(() => ({
  title: 'Lien rapides',
}));
</script>
