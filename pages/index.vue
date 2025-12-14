<template>
  <main class="overflow-hidden">
    <!-- Hero Section - Plus dynamique avec parallax effect -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background avec gradient animé -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div class="absolute inset-0">
          <div
            class="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
          </div>
          <div
            class="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
          </div>
          <div
            class="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000">
          </div>
        </div>
      </div>

      <!-- Image overlay -->
      <div class="absolute inset-0">
        <img :src="sharedFiles.paths.page.indexHero" alt="PRO GESTION SOFT"
          class="w-full h-full object-cover opacity-20" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-blue-900/80"></div>
      </div>

      <!-- Contenu Hero -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center">
          <!-- Badge animé -->
          <div
            class="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in-down">
            <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span class="text-white text-sm font-medium">Solutions innovantes pour l'Afrique</span>
          </div>

          <!-- Titre principal -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Transformez votre entreprise avec
            <span
              class="block mt-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              PRO GESTION SOFT
            </span>
          </h1>

          <!-- Sous-titre -->
          <p
            class="text-xl sm:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Des solutions numériques innovantes pour optimiser vos processus et accélérer votre croissance en Afrique
          </p>

          <!-- CTA Buttons -->
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <div v-if="authStore.isLoggedIn" class="group relative">
              <div
                class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000">
              </div>
              <div
                class="relative bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-xl flex items-center space-x-3">
                <span class="text-2xl">👋</span>
                <span>Bonjour {{ authStore.user?.firstName }}</span>
              </div>
            </div>

            <SSOAuthButton v-else action="login" tag="a" :showIcon="false" class="group relative">
              <div
                class="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000">
              </div>
              <div
                class="relative bg-white text-blue-700 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2">
                <IconLogin class="w-5 h-5" />
                <span>Se connecter</span>
              </div>
            </SSOAuthButton>

            <NuxtLink to="/apps"
              class="group relative px-8 py-4 rounded-full font-semibold text-white border-2 border-white/50 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 shadow-lg">
              <IconApps class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Découvrir nos solutions</span>
              <IconArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </NuxtLink>
          </div>

          <!-- Statistiques -->
          <!-- <div class="flex items-center justify-center gap-8 mx-auto mt-16 animate-fade-in-up animation-delay-600">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div
                  class="bg-white text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
                  <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">15+</div>
                  <div class="text-gray-600 font-medium text-lg">Années d'expérience</div>
                </div>
                <div
                  class="bg-white text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
                  <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">500+</div>
                  <div class="text-gray-600 font-medium text-lg">Clients satisfaits</div>
                </div>
                <div
                  class="bg-white text-center transform hover:scale-105 transition-all duration-300 p-8 rounded-2xl hover:shadow-xl">
                  <div class="text-4xl md:text-6xl font-bold text-primary mb-4 counter">24/7</div>
                  <div class="text-gray-600 font-medium text-lg">Support client</div>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <IconChevronDown class="w-8 h-8 text-white/60" />
      </div>

      <!-- Wave -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-20 sm:h-32 fill-current text-gray-50" viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z">
          </path>
        </svg>
      </div>
    </section>

    <!-- Solution -->
    <section
      v-if="solutionStore.initializedStates.solutions && !solutionStore.error && solutionStore.solutions.length > 0"
      class="py-16 bg-gray-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <span class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          Nos Solutions
        </span>
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Un écosystème complet d'outils
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez nos solutions conçues pour répondre aux besoins des entreprises africaines
        </p>
      </div>

      <div v-if="solutionStore.initializedStates.solutions && !solutionStore.error && solutionStore.solutions.length">
        <SolutionListDetails />

        <NuxtLink to="/apps"
          class="flex justify-center text-primary px-6 rounded-full font-medium hover:text-secondary hover:underline transition-all duration-300">
          Voir plus d'apps
        </NuxtLink>
      </div>
    </section>

    <!-- Section À propos -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Content -->
          <div class="space-y-6">
            <span class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Qui sommes-nous ?
            </span>
            <h2 class="text-4xl sm:text-5xl font-bold text-gray-900">
              À propos de <span class="text-blue-600">PRO GESTION SOFT</span>
            </h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              Fondée par des entrepreneurs africains pour des entrepreneurs africains, PRO GESTION SOFT (PGS)
              développe des solutions numériques innovantes qui répondent aux défis spécifiques des PME du continent.
            </p>
            <p class="text-lg text-gray-600 leading-relaxed">
              Notre mission est de démocratiser l'accès aux technologies de pointe en proposant des outils
              intuitifs, abordables et parfaitement adaptés au contexte économique et culturel africain.
            </p>

            <!-- Key features -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconRocket class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Innovation continue</h4>
                  <p class="text-sm text-gray-600">Solutions adaptées au marché africain</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconUsers class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900 mb-1">Support dédié</h4>
                  <p class="text-sm text-gray-600">Accompagnement 24/7 en français</p>
                </div>
              </div>
            </div>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="https://t.me/PGSUsers" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 space-x-2">
                <IconBrandTelegram class="w-5 h-5" />
                <span>Rejoindre la communauté</span>
              </a>
              <NuxtLink to="/about"
                class="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 space-x-2">
                <IconInfoCircle class="w-5 h-5" />
                <span>Notre histoire</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Image avec badge -->
          <div class="relative">
            <div class="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
              <img :src="sharedFiles.paths.page.indexAbout" alt="Équipe PRO GESTION SOFT"
                class="w-full h-full object-cover" />
            </div>

            <!-- Floating badge -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-6 max-w-xs">
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <IconAward class="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <div class="font-bold text-gray-900 text-lg">Résidence du Numérique</div>
                  <div class="text-sm text-gray-600">Labis Porto-Novo, Bénin</div>
                </div>
              </div>
            </div>

            <!-- Decorative element -->
            <div class="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Localisation -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            Où nous trouver
          </span>
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Notre localisation</h2>
          <p class="text-xl text-gray-600">Visitez-nous à Tanmè, Adjarra, Bénin</p>
        </div>

        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              src="https://maps.google.com/maps?q=PRO%20GESTION%20SOFT%2C%20Tanm%C3%A8%2C%20Adjarra%2C%20B%C3%A9nin&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade" class="rounded-2xl"></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Partenaires -->
    <section class="py-20 bg-white">
      <Partners />
    </section>

    <!-- Section FAQ Aléatoire -->
    <FaqRandom />

    <!-- Section Communauté -->
    <section class="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <Community />
    </section>

    <!-- Section Newsletter -->
    <section class="py-20 bg-gray-900 text-white">
      <Newsletter />
    </section>
  </main>
</template>

<script setup>
import {
  IconLogin, IconApps, IconArrowRight, IconChevronDown, IconRocket,
  IconUsers, IconBrandTelegram, IconInfoCircle, IconAward
} from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles';
import { useSolutionStore } from '~/stores/solutions';
import { useAuthStore } from '~/stores/auth';
import { computed } from 'vue';

const sharedFiles = useSharedFiles();
const solutionStore = useSolutionStore();
const authStore = useAuthStore();

onMounted(() => {
  solutionStore.fetchSolutions(undefined, undefined, true);
  authStore.initAuth();
});

useHead({
  title: 'Pro Gestion Soft - Solutions numériques pour les PME africaines',
});
</script>

<style scoped>
/* Grid pattern background */
.bg-grid-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

/* Animations blob */
@keyframes blob {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  25% {
    transform: translate(20px, -50px) scale(1.1);
  }

  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  75% {
    transform: translate(50px, 50px) scale(1.05);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Fade in animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  animation-fill-mode: both;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  animation-fill-mode: both;
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
