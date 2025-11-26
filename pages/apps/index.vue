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
        <!-- Sidebar -->
        <AppSidebar v-model="sidebar.showSidebar.value" :filters="sidebar.filters.value" :stats="sidebar.stats.value"
          :categories="uniqueCategories" :sort-options="sortOptions" title="Filtres"
          stats-title="Statistiques des solutions" search-label="Rechercher une solution"
          search-placeholder="Rechercher une solution..." @update:filters="sidebar.filters.value = $event"
          @reset="sidebar.resetFilters()">
          <!-- Filtres personnalisés -->
          <template #custom-filters="{ filters }">
          </template>
        </AppSidebar>

        <!-- Contenu principal -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="sidebar.toggleSidebar(true)" v-if="!sidebar.showSidebar.value"
            class="lg:hidden mb-6 flex items-center text-primary">
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
          <div v-else-if="sidebar.paginatedItems.value.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <NuxtLink v-for="solution in sidebar.paginatedItems.value" :key="solution.id"
              :to="`/apps/${solution.slug}`" :class="[
                'group relative bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105',
                solution.disabled
                  ? 'border-dashed hover:border-warning cursor-progress'
                  : 'border-transparent hover:border-primary'
              ]"
              :title="solution.disabled ? `${solution.name} est actuellement indisponible, cliquez pour en savoir plus.` : null">
              <!-- Indicateur de statut -->
              <div v-if="!solution.disabled"
                class="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Actif
              </div>
              <div v-else
                class="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                Inactif
              </div>

              <div class="flex items-center mb-6 space-x-2">
                <img :src="solution.logo" :alt="solution.name" class="h-[3em] w-auto scale-[1.5] mr-4 rounded-full"
                  @error="(e) => handleImageError(e, solution.name)" />
                <div>
                  <h2 class="text-lg sm:text-xl font-bold">{{ solution.name }}</h2>
                  <span class="text-xs sm:text-sm text-gray-500">{{ solution.category }}</span>
                </div>
              </div>

              <p class="text-sm text-gray-600 mb-6 line-clamp-3">{{ solution.description }}</p>
              <p v-if="solution.features" class="text-xs sm:text-sm text-gray-500">
                {{ solution.features.length }} fonctionnalité(s)
              </p>
            </NuxtLink>
          </div>

          <!-- Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune solution trouvée</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="sidebar.resetFilters()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <AppPagination :current-page="sidebar.currentPage.value" :total-pages="sidebar.totalPages.value"
            :visible-pages="sidebar.visiblePages.value" @prev="sidebar.prevPage()" @next="sidebar.nextPage()"
            @goto="sidebar.goToPage($event)" />
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { IconFilter, IconLoader } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import { useSidebar } from '@/composables/useSidebar';
import { AppPagination, AppSidebar } from '@/components/app';

const solutionStore = useSolutionStore();

// Initialisation du sidebar avec le composable
const sidebar = useSidebar(computed(() => solutionStore.solutions), {
  initialFilters: {
    search: '',
    category: '',
    sortOrder: 'default'
  },
  itemsPerPage: 9,
  filterFn: (solutions, filters) => {
    return solutions.filter(solution =>
      solution.name.toLowerCase().includes(filters.search?.toLowerCase() || '') &&
      (filters.category === '' || solution.category === filters.category)
    );
  },
  sortFn: (solutions, sortOrder) => {
    if (sortOrder === 'default') return solutions;
    const sorted = [...solutions].sort((a, b) => a.name.localeCompare(b.name));
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  },
  statsFn: (solutions) => {
    const available = solutions.filter(s => !s.disabled).length;
    const unavailable = solutions.length - available;
    const uniqueCategories = new Set(solutions.map(s => s.category)).size;

    return {
      Solution: solutions.length,
      Catégories: uniqueCategories,
      Disponibles: available,
      Indisponibles: unavailable,
    };
  }
});

// Options de tri
const sortOptions = [
  { value: 'default', label: 'Par défaut' },
  { value: 'asc', label: 'Nom (A-Z)' },
  { value: 'desc', label: 'Nom (Z-A)' }
];

// Catégories uniques
const uniqueCategories = computed(() => {
  return [...new Set(solutionStore.solutions.map(solution => solution.category))];
});

// Gestion des erreurs d'image
const handleImageError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(name)}`;
  img.alt = `Logo de ${name} non disponible`;
};

onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
});

// SEO
useHead(() => ({
  title: 'Solutions',
}));
</script>
