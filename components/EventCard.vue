<template>
  <div 
    v-for="event in filteredEvents" 
    :key="event.title" 
    class="bg-gradient-to-br from-rose-50 to-yellow-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 hover border-2 hover:border-primary"
  >
    <div class="text-primary">{{ event.format }}</div>
    <h3 class="text-2xl font-bold">{{ event.title }}</h3>
    <div class="text-gray-400 mb-6">{{ event.date }} à {{ event.time }}</div>
    <p class="text-gray-600 mb-6 leading-relaxed">{{ event.description }}</p>
    <NuxtLink 
      :to="event.link" 
      class="inline-flex items-center text-primary hover:text-secondary group"
      :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': isPastEvent(event) }"
    >
      En savoir plus sur l'événement
      <IconArrowRight class="w-6 h-6 mx-2" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref } from 'vue';
import { IconArrowRight } from '@tabler/icons-vue';

const events = ref([
  {
    format: "Hybride",
    title: "Next Summit 2025",
    date: "2025-08-27",
    time: "01:00",
    description: "Conférence annuelle sur l'innovation technologique et la transformation digitale.",
    link: "#",
  },
  {
    format: "En ligne",
    title: "Webinaire : Optimisation des processus",
    date: "2025-05-20",
    time: "14:00",
    description: "Découvrez comment optimiser vos processus métier avec PRO GESTION SOFT.",
    link: "#",
  },
  {
    format: "Hybride",
    title: "Webinaire : Introduction à PGS GAMEBOT",
    date: "2025-01-26",
    time: "22:00",
    description: "Présentation des fonctionnalités d'automatisation de PGS GAMEBOT.",
    link: "#",
  },
]);

const isPastEvent = (event: { date: string; time: string }) => {
  const eventDateTime = new Date(`${event.date}T${event.time}:00`);
  return new Date() >= eventDateTime;
};

const filteredEvents = computed(() => {
  return unref(events).filter(event => {
    const eventDateTime = new Date(`${event.date}T${event.time}:00`);
    const tenHoursLater = new Date(eventDateTime.getTime() + 10 * 60 * 60 * 1000);
    return new Date() < tenHoursLater;
  });
});
</script>
