<template>
  <main v-if="solutionStore.currentSolution">
    <!-- Hero section -->
    <section class="relative py-24 bg-center hero-bg-responsive"
      :style="`background-image: url('${solutionStore.currentSolution?.logoDesk}');`">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">{{ solutionStore.currentSolution?.name }}</h1>
        <p class="text-xl md:text-2xl max-w-3xl mx-auto"> {{ solutionStore.currentSolution?.description }} </p>
      </div>
    </section>

    <!-- Contenu -->
    <section class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <!-- GAUCHE -->
        <aside class="md:col-span-1 order-first md:order-none">
          <div class="bg-gray-50 p-6 rounded-lg shadow-md">
            <img :src="solutionStore.currentSolution?.logo" :alt="solutionStore.currentSolution?.name"
              class="h-24 w-auto mx-auto mb-6 object-contain rounded-full"
              @error="(e) => handleImageError(e, solutionStore.currentSolution?.name || 'Solution', '100x100')" />

            <div class="flex justify-center mb-6">
              <template v-if="!solutionStore.currentSolution.disabled">
                <a :href="solutionStore.currentSolution.ctaLink"
                  class="inline-flex items-center justify-center text-center py-3 px-6 rounded-md font-medium bg-primary text-white hover:bg-secondary transition-colors duration-200"
                  target="_blank" rel="noopener noreferrer">
                  {{ solutionStore.currentSolution.ctaText || 'Accéder à la solution' }}
                  <IconExternalLink class="w-5 h-5 ml-2" />
                </a>
              </template>
              <template v-else>
                <span
                  class="inline-flex items-center justify-center text-center py-3 px-6 rounded-md font-medium bg-gray-200 text-gray-400 cursor-not-allowed"
                  aria-disabled="true">
                  {{ solutionStore.currentSolution.ctaText || 'Accéder à la solution' }}
                  <IconUnlink class="w-5 h-5 ml-2" />
                </span>
              </template>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <ul class="space-y-3">
                <li><strong>Catégorie :</strong> {{ solutionStore.currentSolution.category }}</li>
                <li>
                  <strong>Statut :</strong>
                  <span
                    :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2',
                      solutionStore.currentSolution.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']">
                    {{ solutionStore.currentSolution.disabled ? 'Indisponible' : 'Disponible' }}
                  </span>
                </li>
                <li><strong>Dernière mise à jour :</strong> {{ formatDate(solutionStore.currentSolution?.updatedAt) }}
                </li>
              </ul>
            </div>

            <!-- Ressources Wiki Section -->
            <template v-if="solutionStore.currentSolution.wiki && solutionStore.currentSolution.wiki.length > 0">
              <div class="flex items-center py-4 mt-4 gap-4 border-t">
                <h3 class="text-xl font-bold">Ressources Wiki</h3>
                ( {{ solutionStore.currentSolution.wiki.length }} Liens )
              </div>

              <div v-if="solutionStore.currentSolution.wiki.length > 2" class="gap-4 mb-8">
                <input type="search" v-model="wikiSearchQuery" placeholder="Rechercher un lien util..."
                  class="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div v-for="(item, index) in filteredWikis" :key="index" class="mb-4 last:mb-0">
                <NuxtLink :to="`/wiki/${item.slug}`" class="font-semibold text-primary hover:underline">
                  {{ item.name }}
                </NuxtLink>
                <p class="text-sm">{{ item.description }}</p>
              </div>
              <p v-if="filteredWikis.length === 0 && wikiSearchQuery" class="text-sm text-gray-500">
                Aucune lien trouvée pour votre recherche.
              </p>
            </template>
          </div>
        </aside>

        <!-- DROIT -->
        <div class="md:col-span-2 order-last md:order-none">
          <h2 class="text-3xl font-bold mb-6">Présentation détaillée</h2>
          <p class="prose max-w-none mb-8">{{ solutionStore.currentSolution.content }}</p>

          <template v-if="solutionStore.currentSolution.features && solutionStore.currentSolution.features.length > 0">
            <h3 class="text-2xl font-bold mb-4">Fonctionnalités clés</h3>
            <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <li v-for="(feature, index) in solutionStore.currentSolution.features" :key="index"
                class="flex items-center">
                <IconCheck class="h-5 w-5 text-primary mr-2" />
                {{ feature }}
              </li>
            </ul>
          </template>

          <template v-if="solutionStore.currentSolution.faq && solutionStore.currentSolution.faq.length > 0">
            <div class="flex items-center mb-4 gap-4">
              <h3 class="text-2xl font-bold">FAQ</h3>
              ( {{ solutionStore.currentSolution.faq.length }} FAQs )
            </div>

            <div v-if="solutionStore.currentSolution.faq.length > 2" class="gap-4 mb-8">
              <input type="search" v-model="faqSearchQuery" placeholder="Rechercher une question..."
                class="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <div v-for="(item, index) in filteredFaqs" :key="index" class="mb-4 last:mb-0">
              <h4 class="font-semibold">{{ item.question }}</h4>
              <p class="text-sm">{{ item.answer }}</p>
            </div>
            <p v-if="filteredFaqs.length === 0 && faqSearchQuery" class="text-sm text-gray-500">
              Aucune FAQ trouvée pour votre recherche.
            </p>
          </template>
        </div>
      </div>
    </section>

    <!-- DOCS et TUTORIELS -->
    <section
      v-if="(solutionStore.currentSolution.docs && solutionStore.currentSolution.docs.length > 0) || (solutionStore.currentSolution.tutorials && solutionStore.currentSolution.tutorials.length > 0)"
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-y border-gray-200 py-8">

      <template v-if="solutionStore.currentSolution.docs && solutionStore.currentSolution.docs.length > 0">
        <div class="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
          <div class="flex items-center mb-4 justify-between">
            <h3 class="text-xl font-bold">Documentation & Guides</h3>
            <p>
              {{ solutionStore.currentSolution.docs.length }} docs
            </p>
          </div>
          <div v-if="solutionStore.currentSolution.docs.length > 2" class="mb-4">
            <input type="search" v-model="docSearchQuery" placeholder="Rechercher une documentation..."
              class="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <ul class="space-y-3">
            <li v-for="(doc, index) in filteredDocs" :key="index">
              <a :href="doc.link" class="flex items-center text-primary hover:underline">
                <IconBook class="h-5 w-5 mr-2" />
                {{ doc.name }}
              </a>
            </li>
            <p v-if="filteredDocs.length === 0 && docSearchQuery" class="text-sm text-gray-500">
              Aucun document trouvé pour votre recherche.
            </p>
          </ul>
        </div>
      </template>

      <template v-if="solutionStore.currentSolution.tutorials && solutionStore.currentSolution.tutorials.length > 0">
        <div class="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
          <div class="flex items-center mb-4 justify-between">
            <h3 class="text-xl font-bold">Tutoriels Vidéo</h3>
            <p>
              {{ solutionStore.currentSolution.tutorials.length }} tutos
            </p>
          </div>
          <div v-if="solutionStore.currentSolution.tutorials.length > 2" class="mb-4">
            <input type="search" v-model="tutorialSearchQuery" placeholder="Rechercher un tutoriel..."
              class="w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <ul class="space-y-3">
            <li v-for="(tutorial, index) in filteredTutorials" :key="index">
              <a :href="tutorial.link" target="_blank" class="flex items-center text-primary hover:underline"
                rel="noopener noreferrer">
                <IconVideo class="h-5 w-5 mr-2" />
                {{ tutorial.title }} ({{ tutorial.time }})
              </a>
            </li>
            <p v-if="filteredTutorials.length === 0 && tutorialSearchQuery" class="text-sm text-gray-500">
              Aucun tutoriel trouvé pour votre recherche.
            </p>
          </ul>
        </div>
      </template>
    </section>

    <!-- Découvrez aussi -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Découvrez aussi</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SolutionCard :currentSolutionSlug="slug" />
        </div>
      </div>
    </section>
  </main>
  <div v-else-if="solutionStore.loading" class="text-center py-20">
    <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
    <p class="mt-2 text-gray-600">Chargement de la solution...</p>
  </div>
  <div v-else-if="solutionStore.error" class="text-center py-20">
    <p>Nous rencontrons une erreur pour afficher les détails de cette solution</p>
  </div>
  <!-- Message d'absence -->
  <div v-else class="bg-gray-50 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Bouton retour -->
    <button @click="$router.back()"
      class="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
      <IconArrowLeft class="h-5 w-5 mr-2" />
      Retour
    </button>

    <div class="text-center bg-white rounded-xl shadow-md p-8 md:p-12">
      <h2 class="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-4">Oups !</h2>
      <p class="text-base sm:text-lg text-gray-600 mb-8">
        Désolé, la solution que vous recherchez n'existe pas ou a été supprimée.
      </p>
      <NuxtLink to="/solutions"
        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
        <IconArrowBack class="mr-2 -mr-1 h-5 w-5" />
        Retour aux solutions
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSolutionStore } from '@/stores/solutions';
import { IconArrowLeft, IconExternalLink, IconUnlink, IconCheck, IconBook, IconVideo, IconLoader, IconArrowBack } from '@tabler/icons-vue';

const route = useRoute();
const slug = route.params.slug as string;
const solutionStore = useSolutionStore();

const faqSearchQuery = ref('');
const docSearchQuery = ref('');
const tutorialSearchQuery = ref('');
const wikiSearchQuery = ref('');

// Charger les solutions
onMounted(async () => {
  await solutionStore.fetchSolutionByIdentifier(slug);
});

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    await solutionStore.fetchSolutionByIdentifier(newSlug as string);
  }
});

// Utility function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Image loading error handling
const handleImageError = (e: Event, title: string, size: string) => {
  const img = e.target as HTMLImageElement;
  img.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(title)}`;
  img.alt = `Image non disponible pour ${title}`;
};

// Filtered FAQs
const filteredFaqs = computed(() => {
  if (!solutionStore.currentSolution?.faq) return [];

  const faqs = solutionStore.currentSolution.faq;
  const query = faqSearchQuery.value.toLowerCase();

  if (query) {
    return faqs.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  } else {
    return faqs.slice(0, 2);
  }
});

// Filtered Docs
const filteredDocs = computed(() => {
  if (!solutionStore.currentSolution?.docs) return [];

  const docs = solutionStore.currentSolution.docs;
  const query = docSearchQuery.value.toLowerCase();

  if (query) {
    return docs.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.link.toLowerCase().includes(query)
    );
  } else {
    return docs.slice(0, 2);
  }
});


// Filtered Tutorials
const filteredTutorials = computed(() => {
  if (!solutionStore.currentSolution?.tutorials) return [];

  const tutorials = solutionStore.currentSolution.tutorials;
  const query = tutorialSearchQuery.value.toLowerCase();

  if (query) {
    return tutorials.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  } else {
    return tutorials.slice(0, 2);
  }
});

// Filtered Wikis
const filteredWikis = computed(() => {
  if (!solutionStore.currentSolution?.wiki) return [];

  const wikis = solutionStore.currentSolution.wiki;
  const query = wikiSearchQuery.value.toLowerCase();

  if (query) {
    return wikis.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  } else {
    return wikis.slice(0, 2);
  }
});

// SEO
useHead(() => ({
  title: solutionStore.currentSolution ? `${solutionStore.currentSolution.name}` : 'Solution Introuvable',
  meta: [
    { name: 'description', content: solutionStore.currentSolution ? solutionStore.currentSolution.description : 'Page de détail d\'une solution.' }
  ],
}));
</script>

<style scoped>
.hero-bg-responsive {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

@media (min-width: 768px) {

  /* md breakpoint */
  .hero-bg-responsive {
    background-size: cover;
  }
}
</style>
