<template>
  <main>
    <!-- Hero section -->
    <header class="text-center py-6 mt-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Nos</span> événements
      </h1>
      <p class="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
        Des événements pour accélérer votre croissance
      </p>
    </header>

    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <AppSidebar v-model="sidebar.showSidebar.value" :filters="sidebar.filters.value" :stats="sidebar.stats.value"
          :categories="uniqueFormats" :sort-options="sortOptions" title="Filtres"
          stats-title="Statistiques des événements" search-label="Rechercher un événement"
          search-placeholder="Rechercher un événement..." category-label="Filtrer par format"
          category-all-label="Tous les formats" @update:filters="sidebar.filters.value = $event"
          @reset="sidebar.resetFilters()">
          <!-- Filtres personnalisés -->
          <template #custom-filters="{ filters }">
            <!-- Filtre par statut -->
            <div>
              <h3 class="text-base sm:text-lg font-bold mb-3">Filtrer par statut</h3>
              <select v-model="selectedStatus" class="w-full px-4 py-2 border rounded-lg">
                <option value="upcoming">En cours</option>
                <option value="past">Terminé</option>
                <option value="all">Tout</option>
              </select>
            </div>
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
          <div v-if="eventStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des événements...</p>
          </div>
          <div v-else-if="eventStore.error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les événements</p>
          </div>

          <!-- Événements en grille -->
          <div v-else-if="sidebar.paginatedItems.value.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventCard v-for="event in sidebar.paginatedItems.value" :key="event.id" :event="event" />
          </div>

          <!-- Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEventStore } from '@/stores';
import EventCard from '@/components/EventCard.vue';
import { IconLoader, IconFilter } from '@tabler/icons-vue';
import { useSidebar } from '@/composables/useSidebar';
import { AppPagination, AppSidebar } from '@/components/app';
import type { Event } from '@/types';

const eventStore = useEventStore();
const selectedStatus = ref<'upcoming' | 'past' | 'all'>('upcoming');

// Reactive current time for status filtering
const currentTime = ref(new Date());
let timer: NodeJS.Timeout;

// Helper to convert date and time to a Date object
const parseEventDateTime = (event: Event) => {
  return new Date(`${event.date}T${event.time}:00`);
};

// Helper to check if an event is in the past
const isPastEvent = (event: Event) => {
  return parseEventDateTime(event) < currentTime.value;
};

// Mappe les formats backend aux noms d'affichage français
const formatDisplay = (format: string) => {
  const displayNames: { [key: string]: string } = {
    'online': 'En ligne',
    'hybride': 'Hybride',
    'présential': 'Présentiel'
  };
  return displayNames[format] || format;
};

// Formats uniques disponibles dans les événements (mappés en français)
const uniqueFormats = computed(() => {
  const formats = new Set<string>();
  eventStore.events.forEach(event => formats.add(formatDisplay(event.format)));
  return Array.from(formats);
});

// Initialisation du sidebar avec le composable
const sidebar = useSidebar(computed(() => eventStore.events), {
  initialFilters: {
    search: '',
    category: '',
    sortOrder: 'default'
  },
  itemsPerPage: 9,
  filterFn: (events, filters) => {
    let results = events.filter(event =>
      event.title.toLowerCase().includes(filters.search?.toLowerCase() || '') &&
      (filters.category === '' || formatDisplay(event.format) === filters.category)
    );

    // Apply status filter
    if (selectedStatus.value === 'upcoming') {
      results = results.filter(event => !isPastEvent(event));
    } else if (selectedStatus.value === 'past') {
      results = results.filter(event => isPastEvent(event));
    }

    return results;
  },
  sortFn: (events, sortOrder) => {
    if (sortOrder === 'default') {
      return [...events].sort((a, b) => parseEventDateTime(b).getTime() - parseEventDateTime(a).getTime());
    }
    if (sortOrder === 'asc') {
      return [...events].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortOrder === 'desc') {
      return [...events].sort((a, b) => b.title.localeCompare(a.title));
    }
    if (sortOrder === 'closest') {
      return [...events].sort((a, b) => parseEventDateTime(a).getTime() - parseEventDateTime(b).getTime());
    }
    if (sortOrder === 'furthest') {
      return [...events].sort((a, b) => parseEventDateTime(b).getTime() - parseEventDateTime(a).getTime());
    }
    return events;
  },
  statsFn: (events) => {
    const online = events.filter(e => e.format === 'online').length;
    const hybride = events.filter(e => e.format === 'hybride').length;
    const presential = events.filter(e => e.format === 'présential').length;
    const upcoming = events.filter(e => !isPastEvent(e)).length;
    const past = events.filter(e => isPastEvent(e)).length;

    return {
      'Total': events.length,
      'En ligne': online,
      'Hybride': hybride,
      'Présentiel': presential,
      'En cours': upcoming,
      'Terminés': past
    };
  }
});

// Options de tri
const sortOptions = [
  { value: 'default', label: 'Par défaut (Date)' },
  { value: 'asc', label: 'Titre (A-Z)' },
  { value: 'desc', label: 'Titre (Z-A)' },
  { value: 'closest', label: 'Plus proche' },
  { value: 'furthest', label: 'Plus lointain' }
];

onMounted(() => {
  eventStore.fetchEvents(undefined, undefined, true);
  // Start timer to update currentTime
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// Clear timer on unmount
onUnmounted(() => {
  clearInterval(timer);
});

// Watch selectedStatus to trigger filter re-computation
watch(selectedStatus, () => {
  sidebar.currentPage.value = 1;
});

// SEO
useHead(() => ({
  title: 'Événements',
}));
</script>
