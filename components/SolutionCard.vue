<template>
  <div v-for="solution in randomSolutions" :key="solution.id"
    :class="['group bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105', solution.disabled ? 'border-dashed hover:border-warning' : 'border-transparent hover:border-primary']">
    <div class="flex items-center mb-4">
      <div class="mr-2">
        <img :src="solution.logo" :alt="solution.name" class="h-12 w-12 object-contain rounded-full"
          @error="(e) => handleImageError(e, solution.name)" />
      </div>

      <a :href="solution.disabled ? undefined : solution.ctaLink"
        class="text-xl font-bold text-gray-900 transition hover:underline"
        :class="solution.disabled ? 'cursor-not-allowed hover:no-underline' : 'cursor-pointer'" :title="solution.disabled
          ? `${solution.name} est indisponible.`
          : `Accéder à ${solution.name}`"
        @click.prevent="!solution.disabled && $router.push(`/apps/${solution.slug}`)">
        {{ solution.name }}
      </a>
    </div>

    <p class="text-sm text-gray-600 mb-6 leading-relaxed">
      {{ solution.description }}
    </p>

    <NuxtLink :to="`/apps/${solution.slug}`"
      class="inline-flex items-center mx-auto px-4 py-2 border rounded-lg text-base font-medium hover:text-secondary hover:bg-gray-50"
      :class="solution.disabled ? 'text-warning cursor-help' : 'text-primary'"
      @click.prevent="solution.disabled ? null : $router.push(`/apps/${solution.slug}`)">
      Savoir plus sur {{ solution.name }}
      <IconArrowRight class="w-6 h-6 ml-2" />
    </NuxtLink>
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
