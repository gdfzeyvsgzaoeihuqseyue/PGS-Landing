<template>
  <main class="min-h-screen">
    <!-- Chargement -->
    <LogoLoader
      v-if="!solutionStore.initializedStates.currentSolution || solutionStore.loadingStates.currentSolution || solutionStore.loading"
      :show-text="true" size="lg" text="Chargement de l'application..." />

    <!-- Erreur lors du chargement -->
    <div v-else-if="solutionStore.initializedStates.currentSolution && solutionStore.error" class="text-center py-20">
      <p>Nous rencontrons une erreur pour afficher les détails de cette solution</p>
    </div>

    <!-- Contenu principal de la solution -->
    <main v-else-if="solutionStore.initializedStates.currentSolution && solutionStore.currentSolution">
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
                  <li>
                    <strong>Accès :</strong>
                    <div
                      class="inline-flex items-center ml-2 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      <component :is="solutionStore.currentSolution.allowAuth ? IconLock : IconLockOpen2"
                        :class="solutionStore.currentSolution.allowAuth ? 'text-orange-500' : 'text-green-500'"
                        class="w-4 h-4 mr-1" />
                      <span class="text-xs font-medium text-gray-700 mr-2">
                        {{ solutionStore.currentSolution.allowAuth ? 'Restreint' : 'Libre' }}
                      </span>

                      <template v-if="solutionStore.currentSolution.allowAuth">
                        <div class="w-px h-3 bg-gray-300 mx-1"></div>
                        <component
                          :is="solutionStore.currentSolution.authType === 'user' ? IconUser : solutionStore.currentSolution.authType === 'learner' ? IconSchool : IconUsersPlus"
                          class="w-4 h-4 text-blue-500 mr-1" />
                        <span class="text-xs font-medium text-gray-700 capitalize">
                          {{ solutionStore.currentSolution.authType === 'all' ? 'Tous' :
                            solutionStore.currentSolution.authType === 'learner' ? 'Apprenants' : 'Utilisateurs' }}
                        </span>
                      </template>
                    </div>
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

            <template
              v-if="solutionStore.currentSolution.features && solutionStore.currentSolution.features.length > 0">
              <h3 class="text-2xl font-bold mb-4">Fonctionnalités clés</h3>
              <ul class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <li v-for="(feature, index) in solutionStore.currentSolution.features" :key="index"
                  class="flex items-center">
                  <IconCheck class="h-5 w-5 text-primary mr-2" />
                  {{ feature }}
                </li>
              </ul>
            </template>


            <template
              v-if="solutionStore.currentSolution.faqTopics && solutionStore.currentSolution.faqTopics.length > 0">
              <div class="flex items-center mb-4 gap-4">
                <h3 class="text-2xl font-bold">FAQ</h3>
                ( {{ totalFaqCount }} FAQs dans {{ solutionStore.currentSolution.faqTopics.length }} sujets )
              </div>

              <div v-if="solutionStore.currentSolution.faqTopics.length > 2" class="gap-4 mb-8">
                <input type="search" v-model="faqSearchQuery" placeholder="Rechercher une question..."
                  class="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              <!-- Topics et leurs FAQs -->
              <div class="space-y-4">
                <div v-for="(topic, topicIndex) in filteredTopics" :key="topic.id"
                  class="border border-gray-200 rounded-lg overflow-hidden">

                  <!-- En-tête du topic -->
                  <button @click="toggleTopic(topicIndex)"
                    class="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <IconFolder
                        :class="['w-6 h-6', openTopics.includes(topicIndex) ? 'text-primary' : 'text-gray-400']" />
                      <div class="text-left">
                        <h4 class="font-semibold text-lg">{{ topic.name }}</h4>
                        <p v-if="topic.description" class="text-sm text-gray-600">{{ topic.description }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                        {{ topic.faqs?.length || 0 }} question{{ (topic.faqs?.length || 0) > 1 ? 's' : '' }}
                      </span>
                      <IconChevronDown
                        :class="['w-5 h-5 transition-transform', openTopics.includes(topicIndex) ? 'rotate-180' : '']" />
                    </div>
                  </button>

                  <!-- FAQs du topic -->
                  <div v-show="openTopics.includes(topicIndex)" class="p-4 bg-white space-y-3">
                    <div v-for="(faq, faqIndex) in topic.faqs" :key="faq.id"
                      class="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <h5 class="font-semibold text-gray-900">{{ faq.question }}</h5>
                      <p class="text-sm text-gray-700 mt-2">{{ faq.answer }}</p>
                    </div>
                    <p v-if="!topic.faqs || topic.faqs.length === 0" class="text-sm text-gray-500 italic">
                      Aucune FAQ disponible pour ce sujet.
                    </p>
                  </div>
                </div>
              </div>

              <p v-if="filteredTopics.length === 0 && faqSearchQuery" class="text-sm text-gray-500 mt-4">
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

    <!-- Message d'absence -->
    <div v-else class="bg-gray-50 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <NuxtLink to="/apps"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition">
          <IconArrowBack class="mr-2 h-5 w-5" />
          Retour aux applications
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSolutionStore } from '@/stores/solutions';
import { IconArrowLeft, IconExternalLink, IconUnlink, IconCheck, IconBook, IconVideo, IconLoader, IconArrowBack, IconLock, IconLockOpen2, IconUser, IconSchool, IconUsersPlus, IconFolder, IconChevronDown } from '@tabler/icons-vue';
import { LogoLoader } from '@/components/utils';

const route = useRoute();
const slug = route.params.slug as string;
const solutionStore = useSolutionStore();

const faqSearchQuery = ref('');
const docSearchQuery = ref('');
const tutorialSearchQuery = ref('');
const wikiSearchQuery = ref('');
const openTopics = ref<number[]>([]);

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

// FAQ Topics - Maintenant avec hiérarchie
const totalFaqCount = computed(() => {
  if (!solutionStore.currentSolution?.faqTopics) return 0;
  return solutionStore.currentSolution.faqTopics.reduce((total, topic) => {
    return total + (topic.faqs?.length || 0);
  }, 0);
});

const filteredTopics = computed(() => {
  if (!solutionStore.currentSolution?.faqTopics) return [];

  const query = faqSearchQuery.value.toLowerCase();

  if (!query) {
    return solutionStore.currentSolution.faqTopics;
  }

  // Filtrer les topics qui ont des FAQs correspondantes
  return solutionStore.currentSolution.faqTopics
    .map(topic => {
      const filteredFaqs = topic.faqs?.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );

      return {
        ...topic,
        faqs: filteredFaqs
      };
    })
    .filter(topic => (topic.faqs?.length || 0) > 0 || topic.name.toLowerCase().includes(query));
});

const toggleTopic = (index: number) => {
  const idx = openTopics.value.indexOf(index);
  if (idx > -1) {
    openTopics.value.splice(idx, 1);
  } else {
    openTopics.value.push(index);
  }
};

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
