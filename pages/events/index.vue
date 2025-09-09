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
        <!-- Barre latérale des filtres-->
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
              <h3 class="text-base sm:text-lg font-bold mb-4">Statistiques des événements</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ eventStatistics.total }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Evénements</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ eventStatistics.online }}</p>
                  <p class="text-sm sm:text-base text-gray-600">En ligne</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ eventStatistics.presential }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Présentiel</p>
                </div>
                <div>
                  <p class="text-xl sm:text-2xl font-bold">{{ eventStatistics.hybride }}</p>
                  <p class="text-sm sm:text-base text-gray-600">Hybride</p>
                </div>
              </div>
            </div>

            <!-- Filtres -->
            <div class="space-y-6">
              <!-- Barre de recherche -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Rechercher un événement</h3>
                <div class="relative">
                  <input v-model="searchQuery" type="text" placeholder="Rechercher un événement..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <IconSearch class="w-5 h-5" />
                  </div>
                </div>
              </div>

              <!-- Filtre par format -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Filtrer par format</h3>
                <select v-model="selectedFormat" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Tous les formats</option>
                  <option v-for="formatOption in uniqueFormats" :key="formatOption" :value="formatOption">
                    {{ formatDisplay(formatOption) }}
                  </option>
                </select>
              </div>

              <!-- Filtre par statut -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Filtrer par statut</h3>
                <select v-model="selectedStatus" class="w-full px-4 py-2 border rounded-lg">
                  <option value="upcoming">En cours</option>
                  <option value="past">Terminé</option>
                  <option value="all">Tout</option>
                </select>
              </div>

              <!-- Sélecteur de tri -->
              <div>
                <h3 class="text-base sm:text-lg font-bold mb-3">Trier par</h3>
                <select v-model="sortOrder" class="w-full px-4 py-2 border rounded-lg">
                  <option value="default">Par défaut (Date)</option>
                  <option value="asc">Titre (A-Z)</option>
                  <option value="desc">Titre (Z-A)</option>
                  <option value="closest">Plus proche</option>
                  <option value="furthest">Plus lointain</option>
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
          <div v-if="eventStore.loading" class="text-center py-10">
            <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
            <p class="mt-2 text-gray-600">Chargement des événements...</p>
          </div>
          <div v-else-if="eventStore.error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les événements</p>
          </div>

          <!-- Message si aucun résultat -->
          <div v-else-if="noResultsFound" class="bg-white rounded-xl shadow-md p-8 text-center">
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="resetFilters" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Événements en grille -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EventItemCard v-for="event in paginatedEvents" :key="event.id" :event="event" />
          </div>

          <!-- Pagination -->
          <div v-if="filteredAndSortedEvents.length > itemsPerPage" class="mt-8 flex justify-center">
            <nav class="inline-flex flex-wrap rounded-md shadow">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Précédent
              </button>
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                :class="[page === currentPage ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50', 'px-4 py-2 border-t border-b text-sm font-medium']">
                {{ page }}
              </button>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                Suivant
              </button>
            </nav>
          </div>
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEventStore } from '@/stores';
import EventItemCard from '@/components/EventItemCard.vue';
import { IconLoader, IconX, IconFilter, IconSearch } from '@tabler/icons-vue';
import type { Event } from '@/types';

const eventStore = useEventStore();

const searchQuery = ref('');
const selectedFormat = ref('');
const selectedStatus = ref<'upcoming' | 'past' | 'all'>('upcoming'); // New status filter
const sortOrder = ref<"default" | "asc" | "desc" | "closest" | "furthest">("default");
const showSidebar = ref(false);

// Reactive current time for status filtering
const currentTime = ref(new Date());
let timer: NodeJS.Timeout;

// Pagination client-side
const currentPage = ref(1);
const itemsPerPage = 9;

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

// Formats uniques disponibles dans les événements
const uniqueFormats = computed(() => {
  const formats = new Set<string>();
  eventStore.events.forEach(event => formats.add(event.format));
  return Array.from(formats);
});

// Statistiques des événements par format
const eventStatistics = computed(() => {
  const stats = {
    total: eventStore.events.length,
    online: 0,
    hybride: 0,
    presential: 0,
  };
  eventStore.events.forEach(event => {
    if (event.format === 'online') stats.online++;
    else if (event.format === 'hybride') stats.hybride++;
    else if (event.format === 'présential') stats.presential++;
  });
  return stats;
});

// Récupère tous les événements au montage du composant pour le filtrage client-side
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

// Filtre et trie les événements affichés en fonction des critères de recherche et de format
const filteredAndSortedEvents = computed(() => {
  let results = eventStore.events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    (selectedFormat.value === "" || event.format === selectedFormat.value)
  );

  // Apply status filter
  if (selectedStatus.value === 'upcoming') {
    results = results.filter(event => !isPastEvent(event));
  } else if (selectedStatus.value === 'past') {
    results = results.filter(event => isPastEvent(event));
  }
  // If selectedStatus is 'all', no additional filtering is needed here

  // Apply sorting
  if (sortOrder.value === "asc") {
    results = [...results].sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }));
  } else if (sortOrder.value === "desc") {
    results = [...results].sort((a, b) => b.title.localeCompare(a.title, 'fr', { sensitivity: 'base' }));
  } else if (sortOrder.value === "closest") {
    results = [...results].sort((a, b) => parseEventDateTime(a).getTime() - parseEventDateTime(b).getTime());
  } else if (sortOrder.value === "furthest") {
    results = [...results].sort((a, b) => parseEventDateTime(b).getTime() - parseEventDateTime(a).getTime());
  } else {
    // Default sort by date, newest first (or closest if not past)
    results = [...results].sort((a, b) => parseEventDateTime(b).getTime() - parseEventDateTime(a).getTime());
  }

  return results;
});

// Événements paginés (à partir de la liste filtrée et triée)
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAndSortedEvents.value.slice(start, end);
});

// Indique si aucun résultat n'a été trouvé après filtrage
const noResultsFound = computed(() => filteredAndSortedEvents.value.length === 0 && !eventStore.loading && !eventStore.error);

// Calcule le nombre total de pages pour la pagination
const totalPages = computed(() =>
  Math.ceil(filteredAndSortedEvents.value.length / itemsPerPage)
);

// Calcule les pages visibles dans la pagination
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  const total = totalPages.value;
  const current = currentPage.value;

  let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
  let endPage = Math.min(total, startPage + maxVisible - 1);

  // Ajuste startPage if we are at the end of the page range
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

// Réinitialise tous les filtres et la pagination
function resetFilters() {
  searchQuery.value = '';
  selectedFormat.value = '';
  selectedStatus.value = 'upcoming'; // Reset status filter
  sortOrder.value = 'default';
  currentPage.value = 1;
}

// Réinitialise la page actuelle à 1 lorsque les filtres ou le tri changent
watch([searchQuery, selectedFormat, selectedStatus, sortOrder], () => {
  currentPage.value = 1;
});

// SEO
useHead(() => ({
  title: 'Événements',
}));
</script>
