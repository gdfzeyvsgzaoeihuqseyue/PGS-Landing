<template>
  <div
    class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary"
  >
    <div class="p-6">
      <h3 class="text-xl font-bold mb-2 line-clamp-2">{{ event.title }}</h3>

      <!-- Badge Type d'événement -->
      <span class="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full mb-2"
        :class="typeClass(event.type)">
        {{ typeDisplay(event.type) }}
      </span>

      <!-- Badge Nature de l'événement -->
      <span
        class="inline-block px-3 py-1 text-xs font-semibold text-white rounded-full mb-3"
        :class="badgeClass(event.format)"
      >
        {{ formatDisplay(event.format) }}
      </span>

      <div class="space-y-2 mb-4 text-gray-600 text-sm">
        <!-- Moment -->
        <div class="flex items-center">
          <IconCalendar class="h-5 w-5 text-primary mr-2" />
          <span>{{ formatDate(event.date) }} à {{ event.time }}</span>
        </div>

        <!-- Localisation ou Lien -->
        <div v-if="event.location" class="flex items-center">
          <IconMapPin class="h-5 w-5 text-primary mr-2" />
          <span>{{ event.location }}</span>
        </div>
        <div v-else-if="event.link" class="flex items-center">
          <IconLivePhoto class="h-5 w-5 text-primary mr-2" />
          <span>En ligne</span>
        </div>

        <!-- Compte à rebours -->
        <div v-if="!isPastEvent(event)" class="flex items-center">
          <IconStopwatch class="h-5 w-5 text-primary mr-2" />
          <span>Dans <span class="font-semibold">{{ formatCountdown(event) }}</span></span>
        </div>
        <div v-else class="flex items-center text-red-500">
          <IconInfoCircle class="h-5 w-5 mr-2" />
          <span>Événement terminé</span>
        </div>
      </div>

      <NuxtLink
        :to="`/events/${event.id}`"
        class="inline-flex items-center bg-primary text-white hover:bg-secondary px-4 py-2 rounded-md transition-colors text-sm font-medium"
        :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': isPastEvent(event) }"
        :aria-disabled="isPastEvent(event)"
      >
        Voir les détails
        <IconArrowRight class="w-4 h-4 ml-2" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { IconCalendar, IconStopwatch, IconMapPin, IconLivePhoto, IconArrowRight, IconInfoCircle } from '@tabler/icons-vue';
import type { Event } from '@/types';

const props = defineProps<{
  event: Event;
}>();

const currentTime = ref(new Date());
let timer: NodeJS.Timeout;

// Mappe les formats backend aux classes Tailwind CSS
const badgeClass = (format: string) => {
  const badges: { [key: string]: string } = {
    'online': 'bg-green-500',
    'hybride': 'bg-blue-500',
    'présential': 'bg-purple-500'
  };
  return badges[format] || 'bg-gray-500';
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

// Mappe les formats backend aux noms d'affichage français
const formatDisplay = (format: string) => {
  const displayNames: { [key: string]: string } = {
    'online': 'En ligne',
    'hybride': 'Hybride',
    'présential': 'Présentiel'
  };
  return displayNames[format] || format;
};

// Vérifie si l'événement est passé
const isPastEvent = (item: Event) => {
  const eventDate = new Date(`${item.date}T${item.time}:00`);
  return new Date() >= eventDate;
};

// Formate la date pour l'affichage
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
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

// Met à jour le temps actuel chaque seconde pour le compte à rebours
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date();
  }, 1000);
});

// Nettoie l'intervalle lors de la destruction du composant
onUnmounted(() => {
  clearInterval(timer);
});
</script>