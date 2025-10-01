<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 hover:scale-105 overflow-hidden transition-all duration-300">
          <div class="hidden lg:block">
            <img :src="sharedFiles.paths.logo.dc" alt="Logo" class="h-8 w-auto sm:h-10 dark:hidden" />
            <img :src="sharedFiles.paths.logo.dw" alt="Logo" class="h-8 w-auto sm:h-10 hidden dark:block" />
          </div>
          <div class="lg:hidden flex-shrink-0 mr-3">
            <img :src="sharedFiles.paths.logo.mc" alt="Logo" class="h-8 w-auto sm:h-10 dark:hidden" />
            <img :src="sharedFiles.paths.logo.mw" alt="Logo" class="h-8 w-auto sm:h-10 hidden dark:block" />
          </div>
        </NuxtLink>

        <!-- Navigation desktop -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <NuxtLink v-for="(link, index) in navLinks" :key="index" :to="link.to" class="nav-link">
            {{ link.text }}
          </NuxtLink>
        </div>

        <!-- Partie droite avec bouton contact et hamburger sur mobile -->
        <div class="flex items-center space-x-4">
          <button @click="openContactModal"
            class="hidden sm:block bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-base">
            Nous contacter
          </button>

          <!-- Bouton hamburger mobile -->
          <button @click="isMenuOpen = !isMenuOpen"
            class="sm:hidden p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none" aria-label="Menu">
            <IconMenuDeep class="h-6 w-6" :class="{ 'hidden': isMenuOpen, 'block': !isMenuOpen }" />
            <IconX class="h-6 w-6" :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }" />
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div class="sm:hidden transition-all duration-300 ease-in-out"
        :class="{ 'max-h-screen opacity-100': isMenuOpen, 'max-h-0 opacity-0': !isMenuOpen, 'overflow-hidden': !isMenuOpen }">
        <div class="py-3 space-y-1">
          <NuxtLink v-for="(link, index) in navLinks" :key="index" :to="link.to"
            class="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
            @click="isMenuOpen = false">
            {{ link.text }}
          </NuxtLink>
          <button @click="openContactModal"
            class="w-full text-left sm:hidden bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-base mt-2">
            Nous contacter
          </button>
        </div>
      </div>
    </nav>

    <!-- Modal de contact -->
    <div v-if="showContactModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Contactez-nous</h2>
          <button @click="closeContactModal" class="text-gray-500 hover:text-gray-700">
            <IconX class="h-6 w-6" />
          </button>
        </div>
        <div class="space-y-4">
          <p class="text-gray-600 mb-4">Comment souhaitez-vous nous contacter ?</p>
          <div class="space-y-3">
            <a href="tel:+2290152535380"
              class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <IconPhone class="h-6 w-6 text-primary mr-3" />
              <span>+229 01 52535380</span>
            </a>
            <a href="mailto:contact@progestionsoft.com"
              class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <IconMail class="h-6 w-6 text-primary mr-3" />
              <span>contact@progestionsoft.com</span>
            </a>
            <NuxtLink to="/contact" class="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              @click="closeContactModal">
              <IconFilePencil class="h-6 w-6 text-primary mr-3" />
              <span>Formulaire de contact</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { IconFilePencil, IconMail, IconMenuDeep, IconPhone, IconX } from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();

const showContactModal = ref(false);
const isMenuOpen = ref(false);

const navLinks = [
  { to: '/solutions', text: 'Solutions' },
  { to: '/events', text: 'Événements' },
  { to: '/blogs', text: 'Articles' },
  { to: '/about', text: 'À propos' },
];

const openContactModal = () => {
  showContactModal.value = true;
  isMenuOpen.value = false; 
};

const closeContactModal = () => {
  showContactModal.value = false;
};
</script>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary border-b-2 border-transparent hover:border-primary transition-colors;
}

.nav-link.router-link-active {
  @apply border-primary text-primary;
}
</style>
