<template>
  <div v-for="solution in randomSolutions" :key="solution.id"
    :class="['group bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105', solution.disabled ? 'border-dashed hover:border-warning' : 'border-transparent hover:border-primary']">
    <div class="flex items-center mb-4">
      <div class="mr-2">
        <img :src="solution.logo" :alt="solution.name" class="h-12 w-12 object-contain rounded-full"
          @error="(e) => handleImageError(e, solution.name, '40x40')" />
      </div>
      <h3 class="text-xl font-bold text-gray-900">{{ solution.name }}</h3>
    </div>

    <p class="text-gray-600 mb-6 leading-relaxed">{{ solution.description }}</p>

    <NuxtLink :to="`/solutions/${solution.slug}`"
      class="inline-flex items-center mx-auto px-4 py-2 border rounded-lg text-base font-medium hover:text-secondary hover:bg-gray-50"
      :class="solution.disabled ? 'text-warning cursor-help' : 'text-primary'"
      :title="solution.disabled ? `${solution.name} est actuellement indisponible, cliquez pour en savoir plus.` : null"
      @click.prevent="solution.disabled ? null : $router.push(`/solutions/${solution.slug}`)">
      Savoir plus sur {{ solution.name }}
      <IconArrowRight class="w-6 h-6 ml-2" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { IconArrowRight } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions'; // Import the new store
import type { Solution } from '@/types';

// Exclure la solution actuellement affichée.
const props = defineProps<{
  currentSolutionSlug?: string;
}>();

const solutionStore = useSolutionStore(); // Initialize the store

// Erreurs de chargement d'image
const handleImageError = (e: Event, name: string, size: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://placehold.co/${size}/E0F2FE/0284C7?text=${encodeURIComponent(name)}`;
  img.alt = `Image non disponible pour ${name}`;
};

// Mélange aléatoirement les éléments
const shuffleArray = (array: Solution[]): Solution[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Solutions sélectionnées aléatoirement.
const randomSolutions = ref<Solution[]>([]);

watchEffect(async () => {
  // Ensure solutions are loaded
  if (solutionStore.solutions.length === 0 && !solutionStore.loading) {
    await solutionStore.fetchSolutions(undefined, undefined, true);
  }

  const filteredSolutions = props.currentSolutionSlug
    ? solutionStore.solutions.filter(s => s.slug !== props.currentSolutionSlug)
    : solutionStore.solutions;

  // Mélange les solutions filtrées et en prend les 3 premières
  randomSolutions.value = shuffleArray([...filteredSolutions]).slice(0, 3);
});
</script>
