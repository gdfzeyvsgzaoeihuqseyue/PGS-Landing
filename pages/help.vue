<template>
  <main>
    <!-- Hero Section -->
    <header class="text-center mb-12 py-6 mt-8">
      <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Centre</span> de Ressources
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
              <h3 class="text-lg font-bold mb-4">Statistiques des ressources</h3>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p class="text-2xl font-bold text-secondary">{{ solutionStore.solutions.length }}</p>
                  <p class="text-gray-600">Total solutions</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-green-500">{{ totalDocs }}</p>
                  <p class="text-gray-600">Docs</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-purple-500">{{ totalFaqs }}</p>
                  <p class="text-gray-600">FAQs</p>
                </div>
                <div>
                  <p class="text-2xl font-bold text-blue-500">{{ totalTutorials }}</p>
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
          <section class="mb-24">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold">Documentation</h2>
            </div>

            <div v-if="solutionStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement de la documentation...</p>
            </div>
            <div v-else-if="solutionStore.error" class="text-center py-10 text-red-500">
              <p>Erreur: {{ solutionStore.error }}</p>
            </div>
            <div v-else-if="filteredAndPagedDocs.length > 0"
              class="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <!-- Bouton de navigation gauche -->
              <button @click="scrollDocs(-1)" :disabled="docStartIndex === 0"
                class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronLeft class="w-6 h-6 text-gray-700" />
              </button>

              <!-- Conteneur des cards de documentation -->
              <div v-for="docSolution in filteredAndPagedDocs" :key="docSolution.id"
                class="flex flex-col bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div class="flex items-center justify-center w-16 h-16 mb-6">
                  <img :src="docSolution.logo" :alt="docSolution.name" class="h-[3em] w-auto scale-[1.5] mr-4"
                    @error="(e) => handleImageError(e, docSolution.name)" />
                </div>
                <h3 class="text-xl font-bold mb-4">{{ docSolution.name }}</h3>
                <ul class="space-y-4 flex-grow" v-if="docSolution.docs">
                  <li v-for="(item, idx) in docSolution.docs.slice(0, 3)" :key="idx">
                    <a :href="item.link"
                      class="group flex items-center text-gray-600 hover:text-primary transition-colors">
                      <span class="mr-2">{{ item.name }}</span>
                      <IconChevronRight class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </li>
                  <li v-if="docSolution.docs.length > 3" class="text-sm text-gray-500">
                    ... et {{ docSolution.docs.length - 3 }} autres documents
                  </li>
                </ul>
              </div>

              <!-- Bouton de navigation droite -->
              <button @click="scrollDocs(1)" :disabled="docStartIndex + 3 >= filteredSolutionsWithDocs.length"
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
            <div v-else-if="solutionStore.error" class="text-center py-10 text-red-500">
              <p>Erreur: {{ solutionStore.error }}</p>
            </div>
            <div v-else-if="displayedFaqs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                v-for="(item, index) in displayedFaqs" :key="index" @click="toggleFaq(index)">
                <h3 class="text-xl font-bold mb-4 flex justify-between items-center">
                  {{ item.question }}
                  <IconChevronDown
                    :class="['w-6 h-6 transform transition-transform duration-300', { 'rotate-180': openFaqs.includes(index) }]" />
                </h3>

                <div class="overflow-hidden transition-all duration-300"
                  :class="openFaqs.includes(index) ? 'max-h-96 mt-4' : 'max-h-0'">
                  <p class="text-gray-600 leading-relaxed">{{ item.answer }}</p>
                  <p class="text-gray-500 text-sm mt-2">Source: {{ item.solutionName }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center text-gray-500 mt-6">
              Aucune FAQ trouvée pour votre recherche.
            </div>
          </section>

          <!-- Section Tutoriels Vidéo -->
          <section>
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-3xl font-bold">Tutoriels vidéo</h2>
            </div>

            <div v-if="solutionStore.loading" class="text-center py-10">
              <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
              <p class="mt-2 text-gray-600">Chargement des tutoriels...</p>
            </div>
            <div v-else-if="solutionStore.error" class="text-center py-10 text-red-500">
              <p>Erreur: {{ solutionStore.error }}</p>
            </div>
            <div v-else-if="filteredAndPagedTutorials.length > 0"
              class="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              <!-- Bouton de navigation gauche -->
              <button @click="scrollTutorials(-1)" :disabled="tutorialStartIndex === 0"
                class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
                <IconChevronLeft class="w-6 h-6 text-gray-700" />
              </button>

              <div
                class="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                v-for="(tutorial, index) in filteredAndPagedTutorials" :key="index">
                <a :href="tutorial.link" target="_blank" rel="noopener noreferrer"
                  class="block aspect-w-16 aspect-h-9 bg-gray-100 group-hover:opacity-75 transition-opacity relative">
                  <img v-if="tutorial.thumbnail" :src="tutorial.thumbnail" :alt="tutorial.title"
                    class="absolute inset-0 w-full h-full object-cover" />
                  <div v-else class="flex items-center justify-center absolute inset-0">
                    <IconVideo class="w-16 h-16 text-primary opacity-50" />
                  </div>
                </a>
                <div class="p-6">
                  <p class="text-gray-400 text-xs">Durée : {{ tutorial.time }}</p>
                  <h3 class="font-bold mb-2 group-hover:text-primary transition-colors">{{ tutorial.title }}</h3>
                  <p class="text-gray-600 text-sm">{{ tutorial.description }}</p>
                  <p class="text-gray-500 text-sm mt-2">Source: {{ tutorial.solutionName }}</p>
                </div>
              </div>

              <!-- Bouton de navigation droite -->
              <button @click="scrollTutorials(1)" :disabled="tutorialStartIndex + 3 >= filteredTutorials.length"
                class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
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
import { ref, computed, onMounted, watch } from 'vue';
import { useSolutionStore } from '@/stores/solutions';

import {
  IconChevronLeft, IconChevronRight, IconChevronDown, IconVideo, IconLoader,
  IconFilter, IconX
} from '@tabler/icons-vue';

const solutionStore = useSolutionStore();

// Fetch all solutions on component mount
onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
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

const handleImageError = (e: Event, title: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://placehold.co/400x400/E0F2FE/0284C7?text=${encodeURIComponent(title)}`;
  img.alt = `Image de ${title} non disponible`;
};

// --- Statistics ---
const totalDocs = computed(() => solutionStore.solutions.reduce((sum, s) => sum + (s.docs?.length || 0), 0));
const totalFaqs = computed(() => solutionStore.solutions.reduce((sum, s) => sum + (s.faq?.length || 0), 0));
const totalTutorials = computed(() => solutionStore.solutions.reduce((sum, s) => sum + (s.tutorials?.length || 0), 0));

const uniqueCategories = computed(() => {
  const categories = new Set<string>();
  solutionStore.solutions.forEach(s => categories.add(s.category));
  return Array.from(categories).sort();
});

// --- SECTION DOCUMENTATION ---
const docStartIndex = ref(0);

const solutionsWithDocs = computed(() => {
  const activeDocs = solutionStore.solutions.filter(s => !s.disabled && s.docs && s.docs.length > 0);
  const disabledDocs = solutionStore.solutions.filter(s => s.disabled && s.docs && s.docs.length > 0);
  const shuffledActive = shuffleArray(activeDocs);
  const shuffledDisabled = shuffleArray(disabledDocs);
  return [...shuffledActive, ...shuffledDisabled];
});

const filteredSolutionsWithDocs = computed(() => {
  const query = searchQueryDocs.value.toLowerCase();
  let results = solutionsWithDocs.value;

  if (query) {
    results = results.filter(solution =>
      solution.name.toLowerCase().includes(query) ||
      solution.docs?.some(doc => doc.name.toLowerCase().includes(query))
    );
  }
  if (selectedCategoryDocs.value) {
    results = results.filter(solution => solution.category === selectedCategoryDocs.value);
  }
  return results;
});

const filteredAndPagedDocs = computed(() => {
  return filteredSolutionsWithDocs.value.slice(docStartIndex.value, docStartIndex.value + 3);
});

const scrollDocs = (direction: -1 | 1) => {
  const newIndex = docStartIndex.value + (direction * 3);
  docStartIndex.value = Math.max(0, Math.min(filteredSolutionsWithDocs.value.length - 3, newIndex));
  // Smooth scroll to the documentation section
  document.querySelector('#documentation-section')?.scrollIntoView({ behavior: 'smooth' });
};

// --- SECTION FAQ ---
const faqsToShow = ref(4);
const openFaqs = ref<number[]>([]);
const showAllFaqs = ref(false);

const combinedFaq = computed(() => {
  let allFaqs: ({ question: string; answer: string; solutionDisabled: boolean; solutionName: string; category: string })[] = [];

  solutionStore.solutions.forEach(solution => {
    if (solution.faq) {
      solution.faq.forEach(faq => {
        allFaqs.push({ ...faq, solutionDisabled: solution.disabled, solutionName: solution.name, category: solution.category });
      });
    }
  });

  const activeFaqs = allFaqs.filter(faq => !faq.solutionDisabled);
  const disabledFaqs = allFaqs.filter(faq => faq.solutionDisabled);
  const shuffledActive = shuffleArray(activeFaqs);
  const shuffledDisabled = shuffleArray(disabledFaqs);

  return [...shuffledActive, ...shuffledDisabled].map(({ solutionDisabled, ...rest }) => rest);
});

const filteredFaqs = computed(() => {
  const query = searchQueryFaq.value.toLowerCase();
  let results = combinedFaq.value;

  if (query) {
    results = results.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
  }
  if (selectedCategoryFaq.value) {
    results = results.filter(faq => faq.category === selectedCategoryFaq.value);
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
  let allTutorials: Array<{ title: string; description: string; time: string; link: string; thumbnail?: string; solutionDisabled: boolean; solutionName: string; category: string }> = [];

  solutionStore.solutions.forEach(solution => {
    if (solution.tutorials) {
      solution.tutorials.forEach(tutorial => {
        allTutorials.push({
          ...tutorial,
          solutionDisabled: solution.disabled,
          solutionName: solution.name,
          category: solution.category
        });
      });
    }
  });

  const activeTutorials = allTutorials.filter(tutorial => !tutorial.solutionDisabled);
  const disabledTutorials = allTutorials.filter(tutorial => tutorial.solutionDisabled);
  const shuffledActive = shuffleArray(activeTutorials);
  const shuffledDisabled = shuffleArray(disabledTutorials);

  return [...shuffledActive, ...shuffledDisabled].map(({ solutionDisabled, ...rest }) => rest);
});

const filteredTutorials = computed(() => {
  const query = searchQueryTutorials.value.toLowerCase();
  let results = combinedTutorials.value;

  if (!query) return combinedTutorials.value;
  results = results.filter(tutorial =>
    tutorial.title.toLowerCase().includes(query) ||
    tutorial.description.toLowerCase().includes(query)
  );
  if (selectedCategoryTutorials.value) {
    results = results.filter(tutorial => tutorial.category === selectedCategoryTutorials.value);
  }
  return results;
});

const filteredAndPagedTutorials = computed(() => {
  return filteredTutorials.value.slice(tutorialStartIndex.value, tutorialStartIndex.value + 3);
});

const scrollTutorials = (direction: -1 | 1) => {
  const newIndex = tutorialStartIndex.value + (direction * 3);
  tutorialStartIndex.value = Math.max(0, Math.min(filteredTutorials.value.length - 3, newIndex));
  // Smooth scroll to the tutorials section
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
  title: 'Centre de Ressources - ProGestionSoft',
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
