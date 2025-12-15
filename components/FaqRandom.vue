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
      <div v-if="faqStore.loading" class="text-center py-10">
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
              <!-- Votes interactifs -->
              <div class="flex items-center gap-4 mt-4 pl-9">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-600">Cette réponse vous a-t-elle été utile ?</span>
                </div>
                <button @click="handleVoteUseful(faq.id)"
                  :disabled="faqStore.hasUserVoted(faq.id) || votingFaq === faq.id" :class="[
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all',
                    faqStore.getUserVote(faq.id) === 'useful'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-500 hover:text-green-700',
                    (faqStore.hasUserVoted(faq.id) || votingFaq === faq.id) && 'opacity-50 cursor-not-allowed'
                  ]">
                  <IconThumbUp :class="['w-4 h-4', votingFaq === faq.id && 'animate-pulse']" />
                  <span class="font-medium">{{ faq.isUseful }}</span>
                  <span v-if="faqStore.getUserVote(faq.id) === 'useful'" class="text-xs ml-1">(Voté)</span>
                </button>
                <button @click="handleVoteUseless(faq.id)"
                  :disabled="faqStore.hasUserVoted(faq.id) || votingFaq === faq.id" :class="[
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all',
                    faqStore.getUserVote(faq.id) === 'useless'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-500 hover:text-red-700',
                    (faqStore.hasUserVoted(faq.id) || votingFaq === faq.id) && 'opacity-50 cursor-not-allowed'
                  ]">
                  <IconThumbDown :class="['w-4 h-4', votingFaq === faq.id && 'animate-pulse']" />
                  <span class="font-medium">{{ faq.isUseless }}</span>
                  <span v-if="faqStore.getUserVote(faq.id) === 'useless'" class="text-xs ml-1">(Voté)</span>
                </button>
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
import { ref, onMounted } from 'vue';
import { IconLoader, IconFolder, IconQuestionMark, IconChevronDown, IconHelpCircle, IconThumbUp, IconThumbDown, IconArrowRight, IconMoodEmpty } from '@tabler/icons-vue';
import { useFaqStore } from '@/stores/faq';
import type { FaqTopic, Faq } from '@/types';

const faqStore = useFaqStore();
const randomTopic = ref<FaqTopic | null>(null);
const randomFaqs = ref<Faq[]>([]);
const openIndices = ref<number[]>([]);
const votingFaq = ref<string | null>(null);

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

// Vote handlers
const handleVoteUseful = async (faqId: string) => {
  if (votingFaq.value || faqStore.hasUserVoted(faqId)) return;

  votingFaq.value = faqId;
  try {
    await faqStore.voteUseful(faqId);
    // Mettre à jour localement les FAQs affichées
    updateLocalFaqVotes(faqId);
  } catch (err: any) {
    console.error('Vote error:', err);
    alert(err.message || 'Erreur lors du vote');
  } finally {
    votingFaq.value = null;
  }
};

const handleVoteUseless = async (faqId: string) => {
  if (votingFaq.value || faqStore.hasUserVoted(faqId)) return;

  votingFaq.value = faqId;
  try {
    await faqStore.voteUseless(faqId);
    // Mettre à jour localement les FAQs affichées
    updateLocalFaqVotes(faqId);
  } catch (err: any) {
    console.error('Vote error:', err);
    alert(err.message || 'Erreur lors du vote');
  } finally {
    votingFaq.value = null;
  }
};

// Mettre à jour les votes localement pour les FAQs affichées
const updateLocalFaqVotes = (faqId: string) => {
  const updatedFaq = faqStore.getFaqById(faqId);
  if (updatedFaq) {
    randomFaqs.value = randomFaqs.value.map(faq =>
      faq.id === faqId ? updatedFaq : faq
    );
  }
};

onMounted(async () => {
  try {
    // Charger les votes de l'utilisateur
    faqStore.loadUserVotesFromStorage();

    // Si les topics ne sont pas encore chargés, les charger
    if (faqStore.topics.length === 0) {
      await faqStore.fetchTopics({ status: 'active' });
    }

    // Récupérer un topic aléatoire avec ses FAQs
    const randomData = faqStore.getRandomTopic();
    if (randomData) {
      randomTopic.value = randomData.topic;
      randomFaqs.value = randomData.faqs;
    }
  } catch (err) {
    console.error('Erreur lors du chargement des FAQs:', err);
  }
});
</script>
