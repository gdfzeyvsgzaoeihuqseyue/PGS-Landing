<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 p-6">

    <!-- Colonne de gauche -->
    <div class="lg:col-span-1">
      <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
        <div class="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div v-for="solution in randomSolutions" :key="solution.id" @click="selectSolution(solution)" :class="[
            'flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
            selectedSolution?.id === solution.id
              ? 'bg-primary-100 border-primary-500 shadow-lg scale-[1.02]'
              : 'bg-white border-transparent hover:bg-primary-50 hover:shadow-md'
          ]">
            <div class="relative">
              <img :src="solution.logo" :alt="solution.name" class="h-14 w-14 object-contain rounded-full mb-3"
                @error="(e) => handleImageError(e, solution.name)" />
              <!-- Badge cercle -->
              <span class="absolute top-0 right-0 h-3 w-3 rounded-full border-2 border-white"
                :class="solution.disabled ? 'bg-red-500' : 'bg-green-500'"></span>
            </div>

            <p class="text-sm font-semibold text-gray-900 text-center truncate w-full">
              {{ solution.name }}
            </p>
            <p class="text-xs text-gray-500 truncate w-full text-center">
              {{ solution.category || 'Non classifié' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Colonne de droite -->
    <div class="lg:col-span-2">
      <Transition name="fade-slide-y" mode="out-in">
        <div v-if="selectedSolution" :key="selectedSolution.id" class="space-y-6 bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center space-x-4">
            <img :src="selectedSolution?.logo" :alt="selectedSolution?.name"
              class="h-16 w-16 object-contain rounded-full"
              @error="(e) => handleImageError(e, selectedSolution?.name || 'solution')" />
            <h3 class="text-3xl font-bold text-gray-900">{{ selectedSolution?.name }}</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Statut</p>
              <span :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold mt-1',
                selectedSolution?.disabled
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              ]">
                {{ selectedSolution?.disabled ? 'Indisponible' : 'Disponible' }}
              </span>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm font-medium text-gray-600">Catégorie</p>
              <p class="text-base font-semibold text-gray-900 mt-1">
                {{ selectedSolution?.category || 'Non spécifiée' }}
              </p>
            </div>
            <div class="p-3 bg-gray-50 rounded-lg sm:col-span-2">
              <p class="text-sm font-medium text-gray-600">Accès</p>
              <div class="flex items-center mt-1 space-x-3">
                <div class="flex items-center px-2 py-1 rounded bg-white border border-gray-200 shadow-sm">
                  <component :is="selectedSolution?.allowAuth ? IconLock : IconLockOpen2" 
                    :class="selectedSolution?.allowAuth ? 'text-orange-500' : 'text-green-500'" 
                    class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium text-gray-700">
                    {{ selectedSolution?.allowAuth ? 'Restreint' : 'Libre' }}
                  </span>
                </div>

                <div v-if="selectedSolution?.allowAuth" class="flex items-center px-2 py-1 rounded bg-white border border-gray-200 shadow-sm">
                  <component :is="selectedSolution?.authType === 'user' ? IconUser : selectedSolution?.authType === 'learner' ? IconSchool : IconUsersPlus" 
                    class="w-5 h-5 text-blue-500 mr-2" />
                  <span class="text-sm font-medium text-gray-700 capitalize">
                    {{ selectedSolution?.authType === 'all' ? 'Tous' : selectedSolution?.authType === 'learner' ? 'Apprenants' : 'Utilisateurs' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-600 mb-2">Description</p>
            <p class="text-gray-700 leading-relaxed">{{ selectedSolution?.description }}</p>
          </div>

          <div v-if="selectedSolution?.features?.length">
            <p class="text-sm font-medium text-gray-600 mb-2">Fonctionnalités clés</p>
            <ul class="space-y-1 list-none p-0">
              <li v-for="(feature, index) in selectedSolution.features.slice(0, 3)" :key="index"
                class="flex items-center text-sm text-gray-700">
                <IconCheck class="h-4 w-4 text-success-500 mr-2 flex-shrink-0" />
                {{ feature }}
              </li>
              <li v-if="selectedSolution.features.length > 3" class="text-sm text-gray-500 italic mt-1">
                + {{ selectedSolution.features.length - 3 }} autres fonctionnalités...
              </li>
            </ul>
          </div>

          <div class="pt-4 border-t border-gray-200 flex flex-wrap items-center gap-3">
            <template v-if="selectedSolution && !selectedSolution.disabled">
              <a :href="selectedSolution.ctaLink"
                class="inline-flex items-center px-6 py-3 rounded-md font-medium transition duration-300 bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl"
                target="_blank" rel="noopener noreferrer">
                {{ selectedSolution.ctaText || 'Accéder à la solution' }}
                <IconExternalLink class="w-5 h-5 ml-2" />
              </a>
            </template>
            <template v-else-if="selectedSolution && selectedSolution.disabled">
              <span
                class="inline-flex items-center px-6 py-3 rounded-md font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
                aria-disabled="true">
                {{ selectedSolution.ctaText || 'Accéder à la solution' }}
                <IconUnlink class="w-5 h-5 ml-2" />
              </span>
            </template>
            <NuxtLink :to="`/apps/${selectedSolution?.slug}`"
              class="inline-flex items-center text-primary hover:text-secondary font-medium transition duration-200">
              Voir la fiche solution
              <IconArrowRight class="w-5 h-5 ml-2" />
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-10 text-gray-500">
          Cliquez sur une solution à gauche pour afficher ses détails.
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { IconArrowRight, IconExternalLink, IconUnlink, IconCheck, IconLock, IconLockOpen2, IconUser, IconSchool, IconUsersPlus } from '@tabler/icons-vue';
import { useSolutionStore } from '@/stores/solutions';
import type { Solution } from '@/types';

const props = defineProps<{ currentSolutionSlug?: string }>();
const solutionStore = useSolutionStore();
const selectedSolution = ref<Solution | null>(null);
const randomSolutions = ref<Solution[]>([]);

const shuffleArray = (array: Solution[]): Solution[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

watchEffect(async () => {
  if (!solutionStore.solutions.length && !solutionStore.loading) {
    await solutionStore.fetchSolutions(undefined, undefined, true);
  }
  const filtered = props.currentSolutionSlug
    ? solutionStore.solutions.filter(s => s.slug !== props.currentSolutionSlug)
    : solutionStore.solutions;
  const shuffled = shuffleArray(filtered).slice(0, 4);
  randomSolutions.value = shuffled;
  if (!selectedSolution.value && shuffled.length) selectedSolution.value = shuffled[0];
});

const selectSolution = (solution: Solution) => { selectedSolution.value = solution; };

// Fonction corrigée pour accepter un paramètre optionnel
const handleImageError = (e: Event, name?: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(name || 'default')}`;
  img.alt = `Logo ${name ? 'de ' + name : ''} non disponible`.trim();
};
</script>

<style scoped>
.fade-slide-y-enter-active,
.fade-slide-y-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-slide-y-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-y-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>