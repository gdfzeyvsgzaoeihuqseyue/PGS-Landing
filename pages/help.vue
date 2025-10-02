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
        <!-- Barre latérale des filtres et statistiques -->
        <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !showSidebar, 'block': showSidebar }">
          <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <!-- En-tête mobile -->
            <div class="flex justify-between items-center mb-6 lg:hidden">
              <h3 class="text-lg font-bold">Filtres</h3>
              <button @click="showSidebar = false" class="text-gray-500">
                <IconX class="h-6 w-6" />
              </button>
            </div>

            <!-- Bloc statistiques -->
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-4">Statistiques</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold">{{ solutionStore.solutions.length }}</p>
                  <p class="text-gray-600">Total solutions</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ totalDocs }}</p>
                  <p class="text-gray-600">Docs</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ totalFaqs }}</p>
                  <p class="text-gray-600">FAQs</p>
                </div>
                <div>
                  <p class="text-2xl font-bold">{{ totalTutorials }}</p>
                  <p class="text-gray-600">Tutoriels</p>
                </div>
              </div>
            </div>

            <!-- Filtres pour la Documentation -->
            <div class="space-y-6 mb-8">
              <h3 class="text-lg font-bold mb-3">Filtres Documentation</h3>
              <div>
                <input v-model="searchQueryDocs" type="search" placeholder="Rechercher une documentation..."
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
              </div>
              <div>
                <select v-model="selectedCategoryDocs" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Toutes les catégories</option>
                  <option v-for="category in uniqueCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Filtres pour les Questions fréquentes -->
            <div class="space-y-6 mb-8">
              <h3 class="text-lg font-bold mb-3">Filtres Questions fréquentes</h3>
              <div>
                <input v-model="searchQueryFaq" type="search" placeholder="Rechercher une question..."
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
              </div>
              <div>
                <select v-model="selectedCategoryFaq" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Toutes les catégories</option>
                  <option v-for="category in uniqueCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Filtres pour les Tutoriels Vidéo -->
            <div class="space-y-6 mb-8">
              <h3 class="text-lg font-bold mb-3">Filtres Tutoriels Vidéo</h3>
              <div>
                <input v-model="searchQueryTutorials" type="search" placeholder="Rechercher un tutoriel..."
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
              </div>
              <div>
                <select v-model="selectedCategoryTutorials" class="w-full px-4 py-2 border rounded-lg">
                  <option value="">Toutes les catégories</option>
                  <option v-for="category in uniqueCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Bouton de réinitialisation -->
            <button @click="resetFilters"
              class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
              Réinitialiser les filtres
            </button>
          </div>
        </aside>

        <!-- Contenu principal -->
        <main class="lg:w-3/4">
          <!-- Bouton sidebar mobile -->
          <button @click="showSidebar = true" v-if="!showSidebar" class="lg:hidden mb-6 flex items-center text-primary">
            <IconFilter class="h-5 w-5 mr-2" />
            Filtres et statistiques
          </button>

          <!-- Section Documentation -->
          <section class="mb-24" id="documentation-section">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold">Documentation</h2>
            </div>

            <div v-if="solutionStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement de la documentation...</p>
            </div>
            <div v-else-if="solutionStore.error" class="text-center py-10">
              <p>Nous n'avons pas réussi à charger les documents</p>
            </div>
            <div v-else-if="filteredAndPagedDocsBySolution.length > 0"
              class="relative grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <!-- Bouton de navigation gauche -->
              <button @click="scrollDocs(-1)" :disabled="docStartIndex === 0"
                class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronLeft class="w-6 h-6 text-gray-700" />
              </button>

              <!-- Conteneur des cards de documentation -->
              <NuxtLink v-for="item in filteredAndPagedDocsBySolution" :key="item.solution.id"
                :to="`/solutions/${item.solution.slug}`"
                class="flex flex-col bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="flex items-center mb-6">
                  <div class="w-16 h-16 mr-4 flex items-center justify-center">
                    <img :src="item.solution.logo" :alt="item.solution.name" class="h-[3em] w-auto scale-[1.5]"
                      @error="handleImageError" />
                  </div>
                  <div class="flex-grow">
                    <h3 class="text-xl font-bold leading-tight">{{ item.solution.name }}</h3>
                    <p class="text-gray-500 text-sm">{{ item.solution.category }}</p>
                  </div>
                </div>

                <div v-if="!item.docs.length" class="text-center text-gray-500 italic flex-grow">
                  Aucun document disponible
                </div>
                <ul v-else class="space-y-4 flex-grow">
                  <li v-for="doc in item.docs" :key="doc.id">
                    <a :href="doc.link" target="_blank"
                      class="group flex items-center text-gray-600 hover:text-primary transition-colors"
                      :title="doc.name">
                      <span class="mr-2 overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1">
                        {{ doc.name }}
                      </span>
                      <IconChevronRight class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </li>
                </ul>
              </NuxtLink>

              <!-- Bouton de navigation droite -->
              <button @click="scrollDocs(1)" :disabled="docStartIndex + itemsPerScroll >= docsBySolution.length"
                class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronRight class="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div v-else class="text-center text-gray-500 mt-6">
              Aucune documentation trouvée pour votre recherche.
            </div>
          </section>

          <!-- Section FAQ -->
          <section class="mb-24">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold">Questions fréquentes</h2>
              <div class="flex items-center space-x-2">
                <button v-if="filteredFaqs.length > faqsToShow && !searchQueryFaq" @click="showMoreFaqs"
                  class="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  {{ showAllFaqs ? 'Voir moins' : `Voir plus (${filteredFaqs.length - faqsToShow})` }}
                </button>
              </div>
            </div>

            <div v-if="solutionStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement des FAQs...</p>
            </div>
            <div v-else-if="solutionStore.error" class="text-center py-10">
              <p>Nous n'avons pas réussi à charger les FAQs</p>
            </div>
            <div v-else-if="displayedFaqs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                v-for="(item, index) in displayedFaqs" :key="item.id" @click="toggleFaq(index)">
                <!-- Badge plateforme -->
                <div class="mb-2 flex justify-between items-center text-xs font-semibold">
                  <!-- Affichage logo + nom plateforme -->
                  <div class="flex items-center gap-2">
                    <img :src="item.platform?.logo" :alt="`Logo ${item.platform.name}`" class="w-5 h-5 rounded-full" />
                    <span class="text-xs font-medium text-primary bg-primary/30 px-2 py-1 rounded-full">
                      {{ item.platform.name }}
                    </span>
                  </div>
                </div>

                <h3 class="text-xl font-bold mb-4 flex justify-between items-center">
                  {{ item.question }}
                  <IconChevronDown
                    :class="['w-6 h-6 transform transition-transform duration-300', { 'rotate-180': openFaqs.includes(index) }]" />
                </h3>

                <div class="overflow-hidden transition-all duration-300"
                  :class="openFaqs.includes(index) ? 'max-h-96 mt-4' : 'max-h-0'">
                  <p class="text-gray-600 leading-relaxed">{{ item.answer }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 mt-6">
              Aucune FAQ trouvée pour votre recherche.
            </div>
          </section>

          <!-- Section Tutoriels Vidéo -->
          <section id="tutorials-section">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold">Tutoriels vidéo</h2>
            </div>

            <div v-if="solutionStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement des tutoriels...</p>
            </div>

            <div v-else-if="solutionStore.error" class="text-center py-10">
              <p>Nous n'avons pas réussi à charger les tutoriels</p>
            </div>

            <div v-else-if="filteredAndPagedTutorials.length > 0"
              class="relative grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

              <!-- Bouton gauche -->
              <button @click="scrollTutorials(-1)" :disabled="tutorialStartIndex === 0" class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10
             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronLeft class="w-6 h-6 text-gray-700" />
              </button>

              <!-- Card tutoriel -->
              <div v-for="tutorial in filteredAndPagedTutorials" :key="tutorial.id" class="group relative bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300
                hover:shadow-xl hover:scale-105 border-transparent hover:border-primary">
                <!-- Badge plateforme -->
                <div
                  class="flex items-center gap-2 absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-primary/30 text-blue-800 shadow-sm z-50">
                  <img :src="tutorial.platform?.logo" :alt="`Logo ${tutorial.platform.name}`"
                    class="w-5 h-5 rounded-full" />
                  <span class="text-xs font-medium text-primary px-2 py-1 rounded-full">
                    {{ tutorial.platform.name }}
                  </span>
                </div>
                <!-- Thumbnail -->
                <div
                  class="flex items-center justify-center mb-4 relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <img v-if="tutorial.thumbnail" :src="tutorial.thumbnail" :alt="tutorial.title"
                    class="absolute inset-0 w-full h-full object-cover" />
                  <div v-else class="flex items-center justify-center absolute inset-0">
                    <IconVideo class="w-16 h-16 text-primary opacity-50" />
                  </div>
                </div>
                <!-- Contenu -->
                <div>
                  <p class="text-gray-400 text-xs mb-1">Durée : {{ tutorial.time }}</p>
                  <a :href="tutorial.link" target="_blank" rel="noopener noreferrer"
                    class="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 hover:underline"
                    :title="tutorial.title">{{ tutorial.title }}</a>
                  <p class="text-gray-600 text-sm line-clamp-2" :title="tutorial.description">{{ tutorial.description }}
                  </p>
                </div>
              </div>
              <!-- Bouton droit -->
              <button @click="scrollTutorials(1)"
                :disabled="tutorialStartIndex + itemsPerScroll >= filteredTutorials.length" class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10
             disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronRight class="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div v-else class="text-center text-gray-500 mt-6">
              Aucun tutoriel trouvé pour votre recherche.
            </div>
          </section>
        </main>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useSolutionStore } from '@/stores/solutions';

import { IconChevronLeft, IconChevronRight, IconChevronDown, IconVideo, IconLoader, IconFilter, IconX } from '@tabler/icons-vue';

const solutionStore = useSolutionStore();

// Reactive variable for items to scroll/display
const itemsPerScroll = ref(3);

// Function to update itemsPerScroll based on screen width
const updateItemsPerScroll = () => {
  if (window.innerWidth < 640) { // Tailwind's 'sm' breakpoint is 640px
    itemsPerScroll.value = 1;
  } else {
    itemsPerScroll.value = 3;
  }
};

// Fetch all solutions, docs, faqs, tutorials on component mount
onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
  solutionStore.fetchPlateformDocs(undefined, undefined, true);
  solutionStore.fetchPlateformFaqs(undefined, undefined, true);
  solutionStore.fetchPlateformTutorials(undefined, undefined, true);

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
const searchQueryDocs = ref('');
const selectedCategoryDocs = ref('');
const searchQueryFaq = ref('');
const selectedCategoryFaq = ref('');
const searchQueryTutorials = ref('');
const selectedCategoryTutorials = ref('');

// --- UTILS ---
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  const name = target.alt || 'Logo non disponible'
  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
}

// --- Statistics ---
const totalDocs = computed(() => solutionStore.allDocs.length);
const totalFaqs = computed(() => solutionStore.allFaqs.length);
const totalTutorials = computed(() => solutionStore.allTutorials.length);

const uniqueCategories = computed(() => {
  const categories = new Set<string>();
  solutionStore.solutions.forEach(s => categories.add(s.category));
  return Array.from(categories).sort();
});

// --- SECTION DOCUMENTATION ---
const docStartIndex = ref(0);

const filteredSolutionsForDocs = computed(() => {
  const query = searchQueryDocs.value.toLowerCase();
  const category = selectedCategoryDocs.value;

  return solutionStore.solutions.filter(solution =>
    (solution.name.toLowerCase().includes(query) || solution.description.toLowerCase().includes(query)) &&
    (category === '' || solution.category === category)
  );
});

const docsBySolution = computed(() => {
  // Mélanger l'array de solutions avant de le traiter
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
  const query = searchQueryFaq.value.toLowerCase();
  let results = combinedFaq.value;

  if (query) {
    results = results.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.platform.name.toLowerCase().includes(query)
    );
  }
  if (selectedCategoryFaq.value) {
    results = results.filter(faq => faq.platform.category === selectedCategoryFaq.value);
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
  const query = searchQueryTutorials.value.toLowerCase();
  let results = combinedTutorials.value;

  if (query) {
    results = results.filter(tutorial =>
      tutorial.title.toLowerCase().includes(query) ||
      tutorial.description.toLowerCase().includes(query) ||
      tutorial.platform.name.toLowerCase().includes(query)
    );
  }
  if (selectedCategoryTutorials.value) {
    results = results.filter(tutorial => tutorial.platform.category === selectedCategoryTutorials.value);
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
  searchQueryDocs.value = '';
  selectedCategoryDocs.value = '';
  searchQueryFaq.value = '';
  selectedCategoryFaq.value = '';
  searchQueryTutorials.value = '';
  selectedCategoryTutorials.value = '';
  docStartIndex.value = 0;
  tutorialStartIndex.value = 0;
  showAllFaqs.value = false;
  openFaqs.value = [];
};

// Watchers to reset pagination/open states when filters change
watch([searchQueryDocs, selectedCategoryDocs], () => {
  docStartIndex.value = 0;
});
watch([searchQueryFaq, selectedCategoryFaq], () => {
  showAllFaqs.value = false;
  openFaqs.value = [];
});
watch([searchQueryTutorials, selectedCategoryTutorials], () => {
  tutorialStartIndex.value = 0;
});


useHead(() => ({
  title: 'Centre d\aide',
  meta: [
    { name: 'description', content: 'Accédez à la documentation, aux FAQ et aux tutoriels vidéo pour toutes les solutions ProGestionSoft.' }
  ],
}));
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-w-16>* {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
