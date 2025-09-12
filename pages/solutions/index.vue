<template>
  <main>
    <!-- Hero section -->
    <header class="text-center py-6 mt-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Nos</span> solutions
      </h1>
      <p class="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
        Des solutions innovantes pour optimiser vos processus métier
      </p>
    </header>

    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Barre latérale des filtres et statistiques -->
        <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <!-- En-tête mobile -->
            <div class="flex justify-between items-center mb-6 lg:hidden">
              <h3 class="text-lg font-bold">Filtres</h3>
              <button @click="showSidebar = false" class="text-gray-500">
                <IconX class="h-6 w-6" />
              </button>
            </div>

            <!-- Bloc statistiques -->
            <div class="mb-8">
              <h3 class="text-base sm:text-lg font-bold mb-4">Statistiques des solutions</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ solutionStatistics.total }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Solutions</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ solutionStatistics.uniqueCategories }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Catégories</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ solutionStatistics.available }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Disponibles</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ solutionStatistics.unavailable }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Indisponibles</p>
                </div>
              </div>
            </div>

            <!-- Filtres -->
            <div class="space-y-6">
              <!-- Barre de recherche -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Rechercher une solution</h3>
                <div class="relative">
                  <input v-model="searchQuery" @input="updateSuggestions" @focus="showSuggestions = true"
                    @blur="hideSuggestions" type="text" placeholder="Rechercher une solution..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconSearch class="w-5 h-5" />
                  </div>
                </div>
                <!-- Suggestions -->
                <ul v-if="showSuggestions && searchSuggestions.length"
                  class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 z-10">
                  <li v-for="suggestion in searchSuggestions" :key="suggestion"
                    @mousedown="selectSuggestion(suggestion)" class="p-2 hover:bg-gray-100 cursor-pointer">
                    {{ suggestion }}
                  </li>
                </ul>
              </div>

              <!-- Filtre par catégorie -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Filtrer par catégorie</h3>
                <select v-model="selectedCategory" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Toutes les catégories</option>
                  <option v-for="category in uniqueCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <!-- Sélecteur de tri -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Trier par</h3>
                <select v-model="sortOrder" class="w-full px-4 py-2 border rounded-lg">
                  <option value="default">Par défaut</option>
                  <option value="asc">Nom (A-Z)</option>
                  <option value="desc">Nom (Z-A)</option>
                </select>
              </div>

              <!-- Bouton de réinitialisation -->
              <button @click="resetFilters"
                class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </aside>

        <!-- Contenu principal -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Chargement / Erreur -->
          <div v-if="solutionStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des solutions...</p>
          </div>
          <div v-else-if="solutionStore.error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les solutions</p>
          </div>

          <!-- Cartes de solutions -->
          <div v-else-if="filteredSolutions.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NuxtLink v-for="solution in filteredSolutions" :key="solution.id" :to="`/solutions/${solution.slug}`"
              :class="['group relative bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105',
                solution.disabled ? 'border-dashed hover:border-warning cursor-progress' : 'border-transparent hover:border-primary']"
              :title="solution.disabled ? `${solution.name} est actuellement indisponible, cliquez pour en savoir plus.` : null">

              <!-- Indicateur de statut -->
              <div v-if="!solution.disabled"
                class="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Activé
              </div>
              <div v-else
                class="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Désactivé
              </div>

              <div class="flex items-center mb-6 space-x-2">
                <img :src="solution.logo" :alt="solution.name" class="h-[3em] w-auto scale-[1.5] mr-4"
                  @error="(e) => handleImageError(e, solution.name)" />
                <div>
                  <h2 class="text-lg sm:text-xl font-bold">{{ solution.name }}</h2>
                  <span class="text-xs sm:text-sm text-gray-500">{{ solution.category }}</span>
                </div>
              </div>

              <p class="text-sm text-gray-600 mb-6 line-clamp-3">{{ solution.description }}</p>
              <p v-if="solution.features" class="text-xs sm:text-sm text-gray-500">
                {{ solution.features.length }} fonctionnalité(s)
              </P>
            </NuxtLink>
          </div>

          <!-- Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune solutione trouvée</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="resetFilters" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { IconCheck, IconLoader, IconFilter, IconSearch, IconX } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import type { Solution } from '@/types';

const solutionStore = useSolutionStore();

const handleImageError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://placehold.co/40x40/E0F2FE/0284C7?text=${encodeURIComponent(name)}`;
  img.alt = `Logo de ${name} non disponible`;
};

// Variables réactives
const searchQuery = ref("");
const selectedCategory = ref("");
const showSuggestions = ref(false);
const searchSuggestions = ref<string[]>([]);
const sortOrder = ref<"default" | "asc" | "desc">("default");
const showSidebar = ref(false);

onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
});

// Statistics computed property
const solutionStatistics = computed(() => {
  const total = solutionStore.solutions.length;
  const available = solutionStore.solutions.filter(s => !s.disabled).length;
  const unavailable = total - available;
  const uniqueCategoriesCount = new Set(solutionStore.solutions.map(s => s.category)).size;

  return {
    total,
    available,
    unavailable,
    uniqueCategories: uniqueCategoriesCount,
  };
});

// List of unique categories for the filter
const uniqueCategories = computed<string[]>(() => {
  return [...new Set(solutionStore.solutions.map(solution => solution.category))];
});

// Generate suggestions
const updateSuggestions = () => {
  if (!searchQuery.value) {
    searchSuggestions.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  const suggestionsSet = new Set<string>();

  solutionStore.solutions.forEach(solution => {
    if (solution.name.toLowerCase().includes(query)) {
      suggestionsSet.add(solution.name);
    }
  });

  searchSuggestions.value = [...suggestionsSet].slice(0, 5);
};

// Select a suggestion
const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  searchSuggestions.value = [];
  showSuggestions.value = false;
};

// Hide suggestions after a short delay
const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

// Filtering and sorting solutions
const filteredSolutions = computed(() => {
  let results = solutionStore.solutions.filter(solution =>
    solution.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (selectedCategory.value === "" || solution.category === selectedCategory.value)
  );

  // Apply sorting
  if (sortOrder.value !== "default") {
    results = [...results].sort((a, b) => {
      const compare = a.name.localeCompare(b.name);
      return sortOrder.value === "asc" ? compare : -compare;
    });
  }

  return results;
});

// Reset all filters
function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  sortOrder.value = 'default';
}

// Watch for filter changes to reset suggestions
watch([searchQuery, selectedCategory, sortOrder], () => {
  searchSuggestions.value = [];
});

// SEO
useHead(() => ({
  title: 'Solutions',
}));
</script>
