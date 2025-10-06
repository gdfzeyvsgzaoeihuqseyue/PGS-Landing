<template>
  <main>
    <!-- Hero section -->
    <section class="relative min-h-screen bg-gradient-to-br from-primary to-secondary text-white overflow-hidden">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div class="absolute inset-0">
        <img :src="sharedFiles.paths.page.indexHero" alt="Equipe PGS" class="w-full h-full object-cover opacity-50" />
        <div class="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-blue-800/50"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-5xl md:text-7xl font-bold font-heading mb-8 leading-tight animate-fade-in">
            Transformez votre <span class="text-accent">gestion d'entreprise</span> avec PRO GESTION SOFT
          </h1>
          <p class="text-lg md:text-2xl mb-12 leading-relaxed text-gray-100 animate-fade-in-delay">
            Des solutions innovantes pour optimiser vos processus métier et accélérer votre croissance
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-delay-2">
            <NuxtLink to="/solutions/suitops"
              class="group bg-white text-primary px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2">
              <IconRocket class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Découvrir SuitOps</span>
            </NuxtLink>

            <NuxtLink to="/solutions"
              class="group bg-transparent text-white px-8 py-4 rounded-full font-medium border-2 border-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2">
              <IconEye class="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Voir nos solutions</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Vague décorative -->
      <div class="absolute -bottom-4 left-0 right-0">
        <svg class="w-full h-24 fill-current text-white" viewBox="0 0 1440 74" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,37 C240,74 480,74 720,37 C960,0 1200,0 1440,37 L1440,74 L0,74 Z" />
        </svg>
      </div>
    </section>

    <!-- Statistiques -->
    <!-- <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div
            class="text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
            <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">15+</div>
            <div class="text-gray-600 font-medium text-lg">Années d'expérience</div>
          </div>
          <div
            class="text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
            <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">500+</div>
            <div class="text-gray-600 font-medium text-lg">Clients satisfaits</div>
          </div>
          <div
            class="text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
            <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">50+</div>
            <div class="text-gray-600 font-medium text-lg">Experts dédiés</div>
          </div>
          <div
            class="text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
            <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">24/7</div>
            <div class="text-gray-600 font-medium text-lg">Support client</div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Solution -->
    <section v-if="!solutionStore.loading && !solutionStore.error && solutionStore.solutions.length > 0" class="py-16 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-0 md:ml-auto text-center lg:text-right mb-8">
        <h2 class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl font-extrabold">
          Votre partenaire technologique de confiance
        </h2>
        <p class="mt-4 text-xl leading-relaxed">
          Un écosystème complet d'outils numériques conçus spécialement pour répondre aux besoins des entreprises
          africaines.
        </p>
      </div>

      <div v-if="!solutionStore.loading && !solutionStore.error && solutionStore.solutions.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SolutionCard />
      </div>

      <div v-if="!solutionStore.loading && !solutionStore.error && solutionStore.solutions?.length"
        class="flex justify-center mt-8">
        <NuxtLink to="/solutions"
          class="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition-all duration-300">
          Voir plus de solutions
        </NuxtLink>
      </div>
    </section>

    <!-- A propos -->
    <section id="about" class="py-10 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <h2
            class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl text-center font-extrabold mb-6 block lg:hidden">
            À propos de PRO GESTION SOFT
          </h2>

          <!-- Image -->
          <div class="relative lg:order-2">
            <div
              class="aspect-w-4 aspect-h-3 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl overflow-hidden">
              <img :src="sharedFiles.paths.page.indexAbout" alt="Équipe PRO GESTION SOFT au travail"
                class="w-full h-full object-cover">
            </div>

            <!-- Badge flottant -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
              <div class="flex items-center space-x-3">
                <IconAward class="h-8 w-8 text-secondary" />
                <div>
                  <div class="font-bold text-gray-900">Résidence du Numérique</div>
                  <div class="text-sm text-gray-600">Labis Porto-Novo</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Texte -->
          <div class="lg:order-1 text-center lg:text-left flex flex-col justify-center">
            <h2
              class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl font-extrabold mb-6 hidden lg:block">
              À propos de PRO GESTION SOFT
            </h2>

            <p class="text-base text-gray-600 mb-4 md:text-lg">
              Fondée par des entrepreneurs africains pour des entrepreneurs africains, PRO GESTION SOFT (PGS)
              développe des solutions numériques innovantes qui répondent aux défis spécifiques des PME du continent.
            </p>
            <p class="text-base text-gray-600 mb-6 md:text-lg">
              Notre mission est de démocratiser l'accès aux technologies de pointe en proposant des outils
              intuitifs, abordables et parfaitement adaptés au contexte économique et culturel africain.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="https://t.me/PGSUsers" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                <IconUsers class="mr-2 h-5 w-5" />
                Rejoindre la communauté
              </a>
              <NuxtLink to="/about"
                class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                <IconFileText class="mr-2 h-5 w-5" />
                Notre histoire
              </NuxtLink>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Section Carte Google Maps -->
    <section class="py-4 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white p-8 rounded-lg shadow-md">
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              src="https://maps.google.com/maps?q=PRO%20GESTION%20SOFT%2C%20Tanm%C3%A8%2C%20Adjarra%2C%20B%C3%A9nin&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Partenaires -->
    <section class="py-20 bg-gray-50">
      <Partners />
    </section>

    <!-- Communauté -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <Community />
    </section>

    <!-- Newsletter -->
    <section class="py-20 bg-gray-900 text-white">
      <Newsletter />
    </section>
  </main>
</template>

<script setup>
import { IconRocket, IconEye, IconUsers, IconFileText, IconAward, IconLoader } from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles';
import { useSolutionStore } from '~/stores/solutions';

const sharedFiles = useSharedFiles();
const solutionStore = useSolutionStore();

onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
});

useHead({
  title: 'Pro Gestion Soft - Solutions numériques pour les PME africaines',
})
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.3s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 1s ease-out 0.6s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.counter {
  @apply relative;
}

.counter::after {
  content: '';
  @apply absolute bottom-0 left-1/2 w-12 h-1 bg-primary rounded-full transform -translate-x-1/2 transition-all duration-300;
}

.counter:hover::after {
  @apply w-16;
}
</style>
