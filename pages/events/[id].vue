<template>
  <main class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Bouton retour -->
      <button @click="$router.back()"
        class="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
        <IconArrowLeft class="h-5 w-5 mr-2" />
        Retour
      </button>

      <!-- Chargement / Erreur -->
      <div v-if="eventStore.loading" class="text-center py-10">
        <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
        <p class="mt-2 text-gray-600">Chargement de l'événement...</p>
      </div>
      <div v-else-if="eventStore.error" class="text-center py-10 text-red-500">
        <p>Erreur: {{ eventStore.error }}</p>
      </div>

      <!-- Détails de l'événement -->
      <div v-else-if="event" class="bg-white rounded-xl shadow-lg p-8">
        <!-- En-tête avec titre et badge -->
        <div
          class="relative h-48 md:h-64 bg-gradient-to-br from-primary to-secondary rounded-lg overflow-hidden mb-6 flex items-end p-6">
          <div class="absolute inset-0 flex items-center justify-center">
            <IconCalendarEvent class="w-24 h-24 text-white opacity-50" />
          </div>
          <div class="relative z-10">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-2">{{ event.title }}</h1>
            <span class="inline-block px-3 py-1 text-xs sm:text-sm font-semibold text-white rounded-full"
              :class="typeClass(event.type)">
              {{ typeDisplay(event.type) }}
            </span>
            <span class="inline-block px-3 py-1 text-xs sm:text-sm font-semibold text-white rounded-full ml-2"
              :class="badgeClass(event.format)">
              {{ formatDisplay(event.format) }}
            </span>
          </div>
        </div>

        <p class="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">{{ event.description }}</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-3">Informations clés</h2>
            <ul class="space-y-2 text-sm sm:text-base text-gray-600">
              <li class="flex items-center">
                <IconCalendar class="h-5 w-5 text-primary mr-2" />
                <span>Date: {{ formatDate(event.date) }}</span>
              </li>
              <li class="flex items-center">
                <IconClock class="h-5 w-5 text-primary mr-2" />
                <span>Heure: {{ event.time }}</span>
              </li>
              <li v-if="!isPastEvent(event)" class="flex items-center">
                <IconStopwatch class="h-5 w-5 text-primary mr-2" />
                <span>Compte à rebours: <span class="font-semibold">{{ formatCountdown(event) }}</span></span>
              </li>
              <li v-if="event.location" class="flex items-center">
                <IconMapPin class="h-5 w-5 text-primary mr-2" />
                <span>Lieu: {{ event.location }}</span>
                <button @click="openMapWarningModal(event.location)"
                  class="ml-2 text-primary hover:text-secondary text-sm underline">
                  Voir sur la carte
                </button>
              </li>
              <li v-if="event.link" class="flex items-center">
                <IconLink class="h-5 w-5 text-primary mr-2" />
                <span>Lien: <a :href="event.link" target="_blank" rel="noopener noreferrer"
                    class="text-primary hover:underline">{{ event.link }}</a></span>
              </li>
            </ul>
          </div>

          <div v-if="event.agenda && event.agenda.length > 0">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-3">Agenda</h2>
            <ul class="space-y-2 text-sm sm:text-base text-gray-600">
              <li v-for="(item, index) in event.agenda" :key="index" class="flex items-start">
                <IconCheck class="h-5 w-5 text-primary mr-2 mt-1" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="text-center mt-8">
          <a :href="event.ctaLink" target="_blank" rel="noopener noreferrer"
            class="bg-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-secondary transition-colors inline-flex items-center space-x-2">
            <span>{{ event.ctaText }}</span>
            <IconArrowRight class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Message si événement non trouvé -->
      <div v-else class="text-center bg-white rounded-xl shadow-md p-8 md:p-12">
        <h2 class="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-4">Oups !</h2>
        <p class="text-base sm:text-lg text-gray-600 mb-8">
          Désolé, l'événement que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <NuxtLink to="/events"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowBack class="mr-2 -mr-1 h-5 w-5" />
          Retour aux événements
        </NuxtLink>
      </div>
    </div>

    <!-- Modal d'avertissement Google Maps -->
    <div v-if="showMapModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button @click="showMapModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <IconX class="h-6 w-6" />
        </button>
        <h2 class="text-lg sm:text-xl font-bold mb-4 text-warning flex items-center">
          <IconAlertTriangle class="h-6 w-6 mr-2" />
          Attention
        </h2>
        <p class="text-sm sm:text-base text-gray-700 mb-6">
          Les informations de localisation sur Google Maps peuvent ne pas être entièrement précises ou à jour.
          Veuillez toujours vérifier la fiabilité de l'information auprès des sources officielles de l'événement.
        </p>
        <div class="flex justify-end gap-4">
          <button @click="showMapModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
            Annuler
          </button>
          <button @click="redirectToGoogleMaps"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors">
            Continuer vers Google Maps
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventStore } from '@/stores';
import {
  IconArrowLeft, IconLoader, IconCalendar, IconClock, IconMapPin,
  IconLink, IconCheck, IconArrowRight, IconArrowBack, IconX, IconAlertTriangle, IconStopwatch, IconCalendarEvent
} from '@tabler/icons-vue';
import type { Event } from '@/types';

const route = useRoute();
const eventStore = useEventStore();

const event = computed<Event | null>(() => eventStore.currentEvent);
const showMapModal = ref(false);
const mapLocation = ref('');

const currentTime = ref(new Date());
let timer: NodeJS.Timeout;

// Au montage du composant, récupère l'ID de l'URL et charge l'événement
onMounted(() => {
  const eventId = route.params.id as string;
  eventStore.fetchEventById(eventId);

  // Initialise le timer pour le compte à rebours
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// Nettoie le timer à la destruction du composant
onUnmounted(() => {
  clearInterval(timer);
});

// Mappe les formats backend aux classes Tailwind CSS pour les badges
const badgeClass = (format: string) => {
  const badges: { [key: string]: string } = {
    'online': 'bg-green-500',
    'hybride': 'bg-blue-500',
    'présential': 'bg-purple-500'
  };
  return badges[format] || 'bg-gray-500';
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

// Mappe les types backend aux classes Tailwind CSS
const typeClass = (type: string) => {
  const types: { [key: string]: string } = {
    'event': 'bg-orange-500',
    'webinar': 'bg-indigo-500'
  };
  return types[type] || 'bg-gray-500';
};

// Mappe les types backend aux noms d'affichage français
const typeDisplay = (type: string) => {
  const displayNames: { [key: string]: string } = {
    'event': 'Événement',
    'webinar': 'Webinaire'
  };
  return displayNames[type] || type;
};

// Formate la date pour un affichage lisible
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Vérifie si l'événement est passé
const isPastEvent = (item: Event) => {
  const eventDate = new Date(`${item.date}T${item.time}:00`);
  return currentTime.value >= eventDate;
};

// Calcule le compte à rebours jusqu'à l'événement
const formatCountdown = (item: Event) => {
  const eventDate = new Date(`${item.date}T${item.time}:00`);
  const diff = eventDate.getTime() - currentTime.value.getTime();

  if (diff <= 0) return 'Terminé';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}j ${hours}h ${minutes}m ${seconds}s`;
};

// Ouvre la modale d'avertissement avant de rediriger vers Google Maps
const openMapWarningModal = (location: string) => {
  mapLocation.value = location;
  showMapModal.value = true;
};

// Redirige vers Google Maps avec la localisation de l'événement
const redirectToGoogleMaps = () => {
  if (mapLocation.value) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapLocation.value)}`, '_blank');
  }
  showMapModal.value = false;
};

// SEO pour la page de détails de l'événement
useHead(() => ({
  title: event.value ? event.value.title : 'Détails de l\'événement',
}));
</script>
