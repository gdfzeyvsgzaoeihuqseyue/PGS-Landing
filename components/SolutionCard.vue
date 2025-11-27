<template>
  <div v-for="solution in randomSolutions" :key="solution.id"
    class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
    @click="!solution.disabled && $router.push(`/apps/${solution.slug}`)">

    <!-- Image header -->
    <div class="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
      <div class="absolute inset-0 bg-black/20"></div>
      <img :src="solution.logoDesk || solution.logo" :alt="solution.name"
        class="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        @error="(e) => handleImageError(e, solution.name)" />

      <!-- Badge status -->
      <div class="absolute top-4 right-4">
        <span :class="[
          'px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm',
          solution.disabled ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
        ]">
          {{ solution.disabled ? 'Bientôt' : 'Disponible' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {{ solution.name }}
      </h3>
      <p class="text-sm text-blue-600 font-medium mb-3">
        {{ solution.category }}
      </p>
      <p class="text-gray-600 line-clamp-3 mb-4">
        {{ solution.description }}
      </p>

      <!-- Features preview -->
      <div v-if="solution.features && solution.features.length" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span v-for="(feature, idx) in solution.features.slice(0, 2)" :key="idx"
            class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {{ feature }}
          </span>
          <span v-if="solution.features.length > 2" class="text-xs text-gray-500 px-2 py-1">
            +{{ solution.features.length - 2 }} autres
          </span>
        </div>
      </div>

      <!-- CTA -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-100">
        <span class="text-blue-600 font-semibold group-hover:text-blue-700">
          {{ solution.disabled ? 'Bientôt disponible' : 'En savoir plus' }}
        </span>
        <IconArrowRight v-if="!solution.disabled"
          class="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { IconArrowRight } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import type { Solution } from '@/types';

// Exclure la solution actuellement affichée.
const props = defineProps<{
  currentSolutionSlug?: string;
}>();

const solutionStore = useSolutionStore();

// Erreurs de chargement d'image
const handleImageError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(name)}`;
  img.alt = `Logo de ${name} non disponible`;
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
