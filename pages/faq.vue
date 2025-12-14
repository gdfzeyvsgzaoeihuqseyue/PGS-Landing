<template>
  <main>
    <!-- Hero section -->
    <header class="text-center py-6 mt-8">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Questions</span> fréquentes
      </h1>
      <p class="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
        Trouvez rapidement des réponses aux questions les plus posées sur toutes nos plateformes
      </p>
    </header>

    <section class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <AppSidebar v-model="sidebar.showSidebar.value" :filters="sidebar.filters.value" :stats="sidebar.stats.value"
          :categories="uniquePlatforms" :sort-options="sortOptions" title="Filtres" stats-title="Statistiques des FAQs"
          search-label="Rechercher une FAQ" search-placeholder="Rechercher une question..."
          category-label="Filtrer par plateforme" category-all-label="Toutes les plateformes"
          @update:filters="sidebar.filters.value = $event" @reset="sidebar.resetFilters()">
          <!-- Filtres personnalisés -->
          <template #custom-filters="{ filters }">
            <!-- Filtre par topic -->
            <div v-if="uniqueTopics.length > 1">
              <h3 class="text-base sm:text-lg font-bold mb-3">Filtrer par sujet</h3>
              <select v-model="selectedTopic" class="w-full px-4 py-2 border rounded-lg">
                <option value="">Tous les sujets</option>
                <option v-for="topic in uniqueTopics" :key="topic.id" :value="topic.id">
                  {{ topic.name }} ({{ getCountForTopic(topic.id) }})
                </option>
              </select>
            </div>
          </template>
        </AppSidebar>

        <!-- Contenu principal -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="sidebar.toggleSidebar(true)" v-if="!sidebar.showSidebar.value"
            class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Chargement / Erreur -->
          <LogoLoader v-if="loading" :show-text="true" size="lg" text="Chargement des FAQs..." />
          <div v-else-if="error" class="text-center py-10">
            <p>Nous n'avons pas réussi à charger les FAQs</p>
          </div>

          <!-- FAQs groupées par topic -->
          <div v-else-if="sidebar.paginatedItems.value.length > 0" class="space-y-6">
            <div v-for="topic in sidebar.paginatedItems.value" :key="topic.id"
              class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">

              <!-- En-tête du topic -->
              <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-gray-200">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div class="flex items-center gap-3">
                    <img v-if="topic.platform?.logo" :src="topic.platform.logo" :alt="topic.platform.name"
                      class="w-10 h-10 rounded-full"
                      @error="(e) => handleImageError(e, topic.platform?.name || 'Platform')" />
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {{ topic.platform?.name }}
                        </span>
                        <span
                          class="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-full flex items-center gap-1">
                          <IconFolder class="w-3 h-3" />
                          {{ topic.name }}
                        </span>
                      </div>
                      <p v-if="topic.description" class="text-sm text-gray-600 mt-1">{{ topic.description }}</p>
                    </div>
                  </div>
                  <button @click="toggleTopic(topic.id)"
                    class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
                    <span class="text-sm font-medium">{{ topic.faqCount || topic.faqs?.length || 0 }} questions</span>
                    <IconChevronDown :class="['w-5 h-5 transition-transform',
                      openTopics.includes(topic.id) ? 'rotate-180' : '']" />
                  </button>
                </div>
              </div>

              <!-- FAQs du topic -->
              <div v-show="openTopics.includes(topic.id)" class="p-6 space-y-4">
                <div v-for="(faq, faqIndex) in topic.faqs" :key="faq.id"
                  class="border border-gray-200 rounded-lg overflow-hidden">
                  <button @click="toggleFaq(topic.id + '-' + faqIndex)"
                    class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div class="flex items-start gap-3 flex-1">
                      <IconHelpCircle class="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <h4 class="font-semibold text-gray-900 pr-4">{{ faq.question }}</h4>
                    </div>
                    <IconChevronDown :class="['w-5 h-5 text-gray-400 transition-transform flex-shrink-0',
                      openFaqs.includes(topic.id + '-' + faqIndex) ? 'rotate-180' : '']" />
                  </button>
                  <div v-show="openFaqs.includes(topic.id + '-' + faqIndex)" class="px-4 pb-4 pt-2">
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
                <p v-if="!topic.faqs || topic.faqs.length === 0" class="text-center text-gray-500 py-8">
                  Aucune FAQ disponible pour ce sujet.
                </p>
              </div>
            </div>
          </div>

          <!-- Message d'absence -->
          <div v-else class="bg-white rounded-xl shadow-md p-8 text-center">
            <IconMoodEmpty class="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 class="text-xl font-medium text-gray-900 mb-2">Aucune FAQ trouvée</h3>
            <p class="text-gray-600 mb-4">Essayez de modifier vos critères de recherche.</p>
            <button @click="sidebar.resetFilters()"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Pagination -->
          <AppPagination :current-page="sidebar.currentPage.value" :total-pages="sidebar.totalPages.value"
            :visible-pages="sidebar.visiblePages.value" @prev="sidebar.prevPage()" @next="sidebar.nextPage()"
            @goto="sidebar.goToPage($event)" />
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { IconFilter, IconFolder, IconChevronDown, IconHelpCircle, IconThumbUp, IconThumbDown, IconMoodEmpty } from '@tabler/icons-vue';
import { useSidebar } from '@/composables/useSidebar';
import { AppPagination, AppSidebar } from '@/components/app';
import { LogoLoader } from '@/components/utils';
import type { FaqTopic } from '@/types';

const loading = ref(true);
const error = ref<string | null>(null);
const allTopics = ref<FaqTopic[]>([]);
const selectedTopic = ref('');
const openTopics = ref<string[]>([]);
const openFaqs = ref<string[]>([]);

const toggleTopic = (topicId: string) => {
  const idx = openTopics.value.indexOf(topicId);
  if (idx > -1) {
    openTopics.value.splice(idx, 1);
  } else {
    openTopics.value.push(topicId);
  }
};

const toggleFaq = (faqId: string) => {
  const idx = openFaqs.value.indexOf(faqId);
  if (idx > -1) {
    openFaqs.value.splice(idx, 1);
  } else {
    openFaqs.value.push(faqId);
  }
};

const handleImageError = (e: Event, name: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(name)}`;
};

// Initialisation du sidebar
const sidebar = useSidebar(computed(() => allTopics.value), {
  initialFilters: {
    search: '',
    category: '',
    sortOrder: 'default'
  },
  itemsPerPage: 10,
  filterFn: (topics, filters) => {
    let results = topics;

    // Filtre par recherche (dans les questions et réponses)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(topic =>
        topic.name.toLowerCase().includes(query) ||
        topic.description?.toLowerCase().includes(query) ||
        topic.faqs?.some(faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        )
      );
    }

    // Filtre par plateforme
    if (filters.category) {
      results = results.filter(topic => topic.platform?.name === filters.category);
    }

    // Filtre par topic
    if (selectedTopic.value) {
      results = results.filter(topic => topic.id === selectedTopic.value);
    }

    return results;
  },
  sortFn: (topics, sortOrder) => {
    if (sortOrder === 'default') return topics;
    const sorted = [...topics].sort((a, b) => a.name.localeCompare(b.name));
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  },
  statsFn: (topics) => {
    const totalFaqs = topics.reduce((sum, topic) => sum + (topic.faqCount || topic.faqs?.length || 0), 0);
    const platforms = new Set(topics.map(t => t.platform?.name)).size;

    return {
      'Plateformes': platforms,
      'Topics': topics.length,
      'FAQs': totalFaqs,
    };
  }
});

const sortOptions = [
  { value: 'default', label: 'Par défaut' },
  { value: 'asc', label: 'Nom (A-Z)' },
  { value: 'desc', label: 'Nom (Z-A)' }
];

const uniquePlatforms = computed(() => {
  return [...new Set(allTopics.value.map(topic => topic.platform?.name).filter(Boolean))];
});

const uniqueTopics = computed(() => {
  return allTopics.value.map(topic => ({
    id: topic.id,
    name: topic.name
  }));
});

const getCountForTopic = (topicId: string) => {
  const topic = allTopics.value.find(t => t.id === topicId);
  return topic?.faqCount || topic?.faqs?.length || 0;
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

    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Erreur lors du chargement');
    }

    if (response.value?.data) {
      // Enrichir les topics avec les logos des plateformes
      allTopics.value = response.value.data.map(topic => {
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

      // Ouvrir le premier topic par défaut
      if (allTopics.value.length > 0) {
        openTopics.value.push(allTopics.value[0].id);
      }
    }
  } catch (err: any) {
    error.value = 'Erreur lors du chargement des FAQs: ' + (err.message || 'Erreur inconnue');
    console.error(error.value, err);
  } finally {
    loading.value = false;
  }
});

// Reset topic selection when filters reset
watch(() => sidebar.filters.value, (newVal, oldVal) => {
  if (newVal.search === '' && oldVal.search !== '') {
    selectedTopic.value = '';
  }
});

// SEO
useHead(() => ({
  title: 'FAQs - Questions fréquentes',
  meta: [
    { name: 'description', content: 'Trouvez rapidement des réponses aux questions les plus posées sur toutes nos plateformes.' }
  ],
}));
</script>
