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
      <!-- Section Documentation -->
      <section class="mb-24">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Documentation</h2>
          <div class="flex items-center">
            <input v-model="searchQueryDocs" type="search" placeholder="Rechercher une documentation..."
              class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
          </div>
        </div>

        <div v-if="filteredAndPagedDocs.length > 0"
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
                <a :href="item.link" class="group flex items-center text-gray-600 hover:text-primary transition-colors">
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
            <input v-model="searchQueryFaq" type="search" placeholder="Rechercher une question..."
              class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">

            <button 
              v-if="filteredFaqs.length > faqsToShow && !searchQueryFaq" 
              @click="showMoreFaqs"
              class="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
              {{ showAllFaqs ? 'Voir moins' : `Voir plus (${filteredFaqs.length - faqsToShow})` }}
            </button>
          </div>
        </div>

        <div v-if="displayedFaqs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            v-for="(item, index) in displayedFaqs" :key="index" @click="toggleFaq(index)">
            <h3 class="text-xl font-bold mb-4 flex justify-between items-center">
              {{ item.question }}
              <IconChevronDown :class="['w-6 h-6 transform transition-transform duration-300', { 'rotate-180': openFaqs.includes(index) }]" />
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
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Tutoriels vidéo</h2>
          <div class="flex items-center">
            <input v-model="searchQueryTutorials" type="search" placeholder="Rechercher un tutoriel..."
              class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
          </div>
        </div>

        <div v-if="filteredAndPagedTutorials.length > 0"
          class="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <!-- Bouton de navigation gauche -->
          <button @click="scrollTutorials(-1)" :disabled="tutorialStartIndex === 0"
            class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
            <IconChevronLeft class="w-6 h-6 text-gray-700" />
          </button>

          <div class="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
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
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { allSolutions } from '@/stores/solutions';

import { IconChevronLeft, IconChevronRight, IconChevronDown, IconVideo } from '@tabler/icons-vue';

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

// --- SECTION DOCUMENTATION ---
const searchQueryDocs = ref('');
const docStartIndex = ref(0);

const solutionsWithDocs = computed(() => {
  const activeDocs = allSolutions.filter(s => !s.disabled && s.docs && s.docs.length > 0);
  const disabledDocs = allSolutions.filter(s => s.disabled && s.docs && s.docs.length > 0);
  const shuffledActive = shuffleArray(activeDocs);
  const shuffledDisabled = shuffleArray(disabledDocs);
  return [...shuffledActive, ...shuffledDisabled];
});

const filteredSolutionsWithDocs = computed(() => {
  const query = searchQueryDocs.value.toLowerCase();
  if (!query) return solutionsWithDocs.value;
  return solutionsWithDocs.value.filter(solution =>
    solution.name.toLowerCase().includes(query) ||
    solution.docs?.some(doc => doc.name.toLowerCase().includes(query))
  );
});

const filteredAndPagedDocs = computed(() => {
  return filteredSolutionsWithDocs.value.slice(docStartIndex.value, docStartIndex.value + 3);
});

const scrollDocs = (direction: -1 | 1) => {
  const newIndex = docStartIndex.value + (direction * 3);
  docStartIndex.value = Math.max(0, Math.min(filteredSolutionsWithDocs.value.length - 3, newIndex));
};

// --- SECTION FAQ ---
const searchQueryFaq = ref('');
const faqsToShow = ref(4);
const openFaqs = ref<number[]>([]);
const showAllFaqs = ref(false);

const combinedFaq = computed(() => {
  let allFaqs: ({ question: string; answer: string } & { solutionDisabled: boolean })[] = [];

  allSolutions.forEach(solution => {
    if (solution.faq) {
      solution.faq.forEach(faq => {
        allFaqs.push({ ...faq, solutionDisabled: solution.disabled });
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
  if (!query) return combinedFaq.value;
  return combinedFaq.value.filter(faq =>
    faq.question.toLowerCase().includes(query) ||
    faq.answer.toLowerCase().includes(query)
  );
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
const searchQueryTutorials = ref('');
const tutorialStartIndex = ref(0);

const combinedTutorials = computed(() => {
  let allTutorials: Array<{ title: string; description: string; time: string; link: string; thumbnail?: string; solutionDisabled: boolean; }> = [];

  allSolutions.forEach(solution => {
    if (solution.tutorials) {
      solution.tutorials.forEach(tutorial => {
        allTutorials.push({ 
          ...tutorial, 
          solutionDisabled: solution.disabled 
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
  if (!query) return combinedTutorials.value;
  return combinedTutorials.value.filter(tutorial =>
    tutorial.title.toLowerCase().includes(query) ||
    tutorial.description.toLowerCase().includes(query)
  );
});

const filteredAndPagedTutorials = computed(() => {
  return filteredTutorials.value.slice(tutorialStartIndex.value, tutorialStartIndex.value + 3);
});

const scrollTutorials = (direction: -1 | 1) => {
  const newIndex = tutorialStartIndex.value + (direction * 3);
  tutorialStartIndex.value = Math.max(0, Math.min(filteredTutorials.value.length - 3, newIndex));
};

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