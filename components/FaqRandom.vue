<template>
  <section class="py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="text-center mb-10">
        <span class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          Questions fréquentes
        </span>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Besoin d'aide ?
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les réponses aux questions les plus posées sur nos plateformes
        </p>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="text-center py-10">
        <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
        <p class="mt-2 text-gray-600">Chargement des FAQs...</p>
      </div>

      <!-- Contenu -->
      <div v-else-if="randomTopic" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- En-tête du topic -->
        <div class="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img v-if="randomTopic.platform?.logo" :src="randomTopic.platform.logo" :alt="randomTopic.platform.name"
                class="w-12 h-12 rounded-full bg-white p-1" @error="handleImageError" />
              <div>
                <p class="text-sm opacity-90">{{ randomTopic.platform?.name }}</p>
                <h3 class="text-2xl font-bold flex items-center gap-2">
                  <IconFolder class="w-6 h-6" />
                  {{ randomTopic.name }}
                </h3>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <IconQuestionMark class="w-5 h-5" />
              <span class="font-semibold">{{ randomFaqs.length }} FAQs</span>
            </div>
          </div>
          <p v-if="randomTopic.description" class="mt-3 text-sm opacity-90">
            {{ randomTopic.description }}
          </p>
        </div>

        <!-- FAQs -->
        <div class="p-6 space-y-4">
          <div v-for="(faq, index) in randomFaqs" :key="faq.id"
            class="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
            <button @click="toggleFaq(index)"
              class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div class="flex items-start gap-3 flex-1">
                <IconHelpCircle class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <h4 class="font-semibold text-gray-900 pr-4">{{ faq.question }}</h4>
              </div>
              <IconChevronDown :class="['w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
                openIndices.includes(index) ? 'rotate-180' : '']" />
            </button>
            <div v-show="openIndices.includes(index)" class="px-4 pb-4 pt-2">
              <p class="text-gray-700 leading-relaxed pl-9">{{ faq.answer }}</p>
              <!-- Votes -->
              <div class="flex items-center gap-4 mt-4 pl-9 text-sm">
                <div class="flex items-center gap-1 text-green-600">
                  <IconThumbUp class="w-4 h-4" />
                  <span>{{ faq.isUseful }}</span>
                </div>
                <div class="flex items-center gap-1 text-red-600">
                  <IconThumbDown class="w-4 h-4" />
                  <span>{{ faq.isUseless }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton voir plus -->
        <div class="p-6 bg-gray-50 border-t border-gray-200 text-center">
          <NuxtLink to="/faq"
            class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-secondary transition-colors">
            Voir toutes les FAQs
            <IconArrowRight class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>

      <!-- Message si pas de FAQs -->
      <div v-else class="text-center py-10 bg-white rounded-2xl shadow-lg">
        <IconMoodEmpty class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600">Aucune FAQ disponible pour le moment.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IconLoader, IconFolder, IconQuestionMark, IconChevronDown, IconHelpCircle, IconThumbUp, IconThumbDown, IconArrowRight, IconMoodEmpty } from '@tabler/icons-vue';
import type { FaqTopic, Faq } from '@/types';

const loading = ref(true);
const randomTopic = ref<FaqTopic | null>(null);
const randomFaqs = ref<Faq[]>([]);
const openIndices = ref<number[]>([]);

const toggleFaq = (index: number) => {
  const idx = openIndices.value.indexOf(index);
  if (idx > -1) {
    openIndices.value.splice(idx, 1);
  } else {
    openIndices.value.push(index);
  }
};

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = 'https://api.dicebear.com/7.x/icons/svg?seed=default';
};

// Fonction pour mélanger un tableau
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

onMounted(async () => {
  try {
    const { apiFetch } = useApi();
    const { useSolutionStore } = await import('@/stores/solutions');
    const solutionStore = useSolutionStore();

    // S'assurer que les solutions sont chargées pour avoir les logos
    if (!solutionStore.solutions.length) {
      await solutionStore.fetchSolutions(undefined, undefined, true);
    }

    // Récupérer tous les topics avec leurs FAQs
    const { data: response, error: fetchError } = await apiFetch<{
      success: boolean;
      message: string;
      nb: number;
      data: FaqTopic[];
    }>('/solution/faq-topic', {
      params: {
        includeFaqs: true,
        status: 'active',
        limit: 100
      }
    });

    if (!fetchError.value && response.value?.data) {
      // Enrichir les topics avec les logos des plateformes
      const enrichedTopics = response.value.data.map(topic => {
        const fullPlatform = solutionStore.solutions.find(s => s.id === topic.platform?.id);
        if (fullPlatform) {
          return {
            ...topic,
            platform: {
              ...topic.platform,
              logo: fullPlatform.logo,
              logoDesk: fullPlatform.logoDesk,
              category: fullPlatform.category,
            }
          };
        }
        return topic;
      });

      // Filtrer uniquement les topics qui ont des FAQs
      const topicsWithFaqs = enrichedTopics.filter(topic =>
        topic.faqs && topic.faqs.length > 0
      );

      if (topicsWithFaqs.length > 0) {
        // Sélectionner un topic aléatoire
        const shuffled = shuffleArray(topicsWithFaqs);
        randomTopic.value = shuffled[0];

        // Sélectionner 4 FAQs aléatoires de ce topic
        if (randomTopic.value.faqs) {
          const shuffledFaqs = shuffleArray(randomTopic.value.faqs);
          randomFaqs.value = shuffledFaqs.slice(0, 4);
        }
      }
    }
  } catch (err) {
    console.error('Erreur lors du chargement des FAQs:', err);
  } finally {
    loading.value = false;
  }
});
</script>
