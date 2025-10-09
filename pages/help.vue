<template>
  <main>
    <!-- Hero Section -->
    <header class="text-center mb-12 py-6 mt-8">
      <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Centre</span> d'aide
      </h1>
      <p class="mt-4 text-xl max-w-2xl mx-auto">
        Découvrez nos guides, documentation et ressources pour tirer le meilleur parti de nos solutions
      </p>
    </header>

    <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filtres et statistiques -->
        <HelpSidebar v-model="showSidebar" :stats="stats" :filters="filters" :categories="uniqueCategories"
          @reset="resetFilters" @update:filters="filters = $event" />

        <!-- Contenu principal -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Section Documentation -->
          <DocSection :items="filteredAndPagedDocsBySolution" :loading="solutionStore.loadingStates.docs"
            :error="solutionStore.error" :start-index="docStartIndex"
            :can-scroll-right="docStartIndex + itemsPerScroll < docsBySolution.length" @scroll="scrollDocs" />

          <!-- Section FAQ -->
          <FaqSection :items="displayedFaqs" :loading="solutionStore.loadingStates.faqs" :error="solutionStore.error"
            :open-indices="openFaqs" :show-all="showAllFaqs"
            :can-show-more="filteredFaqs.length > faqsToShow && !filters.faqs.search"
            :remaining="filteredFaqs.length - faqsToShow" @toggle="toggleFaq" @toggle-show-all="showMoreFaqs" />

          <!-- Section Tutoriels Vidéo -->
          <TutoSection :items="filteredAndPagedTutorials" :loading="solutionStore.loadingStates.tutorials"
            :error="solutionStore.error" :start-index="tutorialStartIndex"
            :can-scroll-right="tutorialStartIndex + itemsPerScroll < filteredTutorials.length"
            @scroll="scrollTutorials" />
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSolutionStore } from '@/stores/solutions';
import { IconFilter } from '@tabler/icons-vue';
import { DocSection, HelpSidebar, FaqSection, TutoSection  } from '@/components/help';

const solutionStore = useSolutionStore();

// Reactive variable for items to scroll/display
const itemsPerScroll = ref(3);

// Function to update itemsPerScroll based on screen width
const updateItemsPerScroll = () => {
  if (window.innerWidth < 640) {
    itemsPerScroll.value = 1;
  } else {
    itemsPerScroll.value = 3;
  }
};

// Fetch all solutions, docs, faqs, tutorials on component mount
onMounted(async () => {
  await Promise.all([
    solutionStore.fetchSolutions(undefined, undefined, true),
    solutionStore.fetchPlateformDocs(undefined, undefined, true),
    solutionStore.fetchPlateformFaqs(undefined, undefined, true),
    solutionStore.fetchPlateformTutorials(undefined, undefined, true),
  ]);

  // Set initial value and add resize listener
  updateItemsPerScroll();
  window.addEventListener('resize', updateItemsPerScroll);
});

// Clean up resize listener on unmount
onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerScroll);
});

// --- Sidebar and Filters ---
const showSidebar = ref(false);
const filters = ref({
  docs: { search: '', category: '' },
  faqs: { search: '', category: '' },
  tutorials: { search: '', category: '' },
});

// --- UTILS ---
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// --- Statistics ---
const stats = computed(() => ({
  totalSolutions: solutionStore.solutions.length,
  totalDocs: solutionStore.allDocs.length,
  totalFaqs: solutionStore.allFaqs.length,
  totalTutorials: solutionStore.allTutorials.length,
}));

const uniqueCategories = computed(() => {
  const categories = new Set<string>();
  solutionStore.solutions.forEach(s => categories.add(s.category));
  return Array.from(categories).sort();
});

// --- SECTION DOCUMENTATION ---
const docStartIndex = ref(0);

const filteredSolutionsForDocs = computed(() => {
  const query = filters.value.docs.search.toLowerCase();
  const category = filters.value.docs.category;

  return solutionStore.solutions.filter(solution =>
    (solution.name.toLowerCase().includes(query) || solution.description.toLowerCase().includes(query)) &&
    (category === '' || solution.category === category)
  );
});

const docsBySolution = computed(() => {
  const shuffledSolutions = shuffleArray(filteredSolutionsForDocs.value);
  const results = shuffledSolutions.map(solution => {
    const allDocsForSolution = solutionStore.allDocs.filter(doc => doc.platform.id === solution.id);
    const shuffledDocs = shuffleArray(allDocsForSolution);
    const selectedDocs = shuffledDocs.slice(0, 3);
    return {
      solution,
      docs: selectedDocs
    };
  });
  return results.filter(item => item.docs.length > 0);
});

const filteredAndPagedDocsBySolution = computed(() => {
  return docsBySolution.value.slice(docStartIndex.value, docStartIndex.value + itemsPerScroll.value);
});

const scrollDocs = (direction: -1 | 1) => {
  const newIndex = docStartIndex.value + (direction * itemsPerScroll.value);
  docStartIndex.value = Math.max(0, Math.min(docsBySolution.value.length - itemsPerScroll.value, newIndex));
  document.querySelector('#documentation-section')?.scrollIntoView({ behavior: 'smooth' });
};

// --- SECTION FAQ ---
const faqsToShow = ref(4);
const openFaqs = ref<number[]>([]);
const showAllFaqs = ref(false);

const combinedFaq = computed(() => {
  return shuffleArray(solutionStore.allFaqs);
});

const filteredFaqs = computed(() => {
  const query = filters.value.faqs.search.toLowerCase();
  let results = combinedFaq.value;

  if (query) {
    results = results.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.platform.name.toLowerCase().includes(query)
    );
  }
  if (filters.value.faqs.category) {
    results = results.filter(faq => faq.platform.category === filters.value.faqs.category);
  }
  return results;
});

const displayedFaqs = computed(() => {
  return showAllFaqs.value ? filteredFaqs.value : filteredFaqs.value.slice(0, faqsToShow.value);
});

const toggleFaq = (index: number) => {
  const faqIndexInOpenFaqs = openFaqs.value.indexOf(index);
  if (faqIndexInOpenFaqs > -1) {
    openFaqs.value.splice(faqIndexInOpenFaqs, 1);
  } else {
    openFaqs.value.push(index);
  }
};

const showMoreFaqs = () => {
  showAllFaqs.value = !showAllFaqs.value;
};

// --- SECTION TUTORIELS ---
const tutorialStartIndex = ref(0);

const combinedTutorials = computed(() => {
  return shuffleArray(solutionStore.allTutorials);
});

const filteredTutorials = computed(() => {
  const query = filters.value.tutorials.search.toLowerCase();
  let results = combinedTutorials.value;

  if (query) {
    results = results.filter(tutorial =>
      tutorial.title.toLowerCase().includes(query) ||
      tutorial.description.toLowerCase().includes(query) ||
      tutorial.platform.name.toLowerCase().includes(query)
    );
  }
  if (filters.value.tutorials.category) {
    results = results.filter(tutorial => tutorial.platform.category === filters.value.tutorials.category);
  }
  return results;
});

const filteredAndPagedTutorials = computed(() => {
  return filteredTutorials.value.slice(tutorialStartIndex.value, tutorialStartIndex.value + itemsPerScroll.value);
});

const scrollTutorials = (direction: -1 | 1) => {
  const newIndex = tutorialStartIndex.value + (direction * itemsPerScroll.value);
  tutorialStartIndex.value = Math.max(0, Math.min(filteredTutorials.value.length - itemsPerScroll.value, newIndex));
  document.querySelector('#tutorials-section')?.scrollIntoView({ behavior: 'smooth' });
};

// --- Reset Filters ---
const resetFilters = () => {
  filters.value = {
    docs: { search: '', category: '' },
    faqs: { search: '', category: '' },
    tutorials: { search: '', category: '' },
  };
  docStartIndex.value = 0;
  tutorialStartIndex.value = 0;
  showAllFaqs.value = false;
  openFaqs.value = [];
};

// Watchers to reset pagination/open states when filters change
watch(() => filters.value.docs, () => {
  docStartIndex.value = 0;
}, { deep: true });

watch(() => filters.value.faqs, () => {
  showAllFaqs.value = false;
  openFaqs.value = [];
}, { deep: true });

watch(() => filters.value.tutorials, () => {
  tutorialStartIndex.value = 0;
}, { deep: true });

useHead(() => ({
  title: 'Centre d\'aide',
  meta: [
    { name: 'description', content: 'Accédez à la documentation, aux FAQ et aux tutoriels vidéo pour toutes les solutions ProGestionSoft.' }
  ],
}));
</script>
