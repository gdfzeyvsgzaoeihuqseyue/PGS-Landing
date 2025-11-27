<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <div v-for="solution in featuredSolutions" :key="solution.id"
        class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
        @click="navigateToSolution(solution.slug)">
        <!-- Image header -->
        <div class="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          <div class="absolute inset-0 bg-black/20"></div>
          <img :src="solution.logoDesk" :alt="solution.name"
            class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            {{ solution.category || 'Solution digitale' }}
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
              En savoir plus
            </span>
            <IconArrowRight class="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { IconArrowRight } from '@tabler/icons-vue';
import { useSolutionStore } from '~/stores/solutions';
import { computed } from 'vue';

const solutionStore = useSolutionStore();
const authStore = useAuthStore();

// Récupérer les solutions vedettes
const featuredSolutions = computed(() => {
  return solutionStore.solutions.slice(0, 3);
});

onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
});

const navigateToSolution = (slug) => {
  navigateTo(`/apps/${slug}`);
};

const handleImageError = (e, name) => {
  const img = e.target;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(name || 'default')}`;
  img.alt = `Logo ${name} non disponible`;
};
</script>

<style scoped>
/* Animations blob */
@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Fade in animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  animation-fill-mode: both;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
