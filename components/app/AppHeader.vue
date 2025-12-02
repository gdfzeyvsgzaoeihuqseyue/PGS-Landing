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
          <PGSAppSwitcher container-id="header-app-switcher" :on-app-click="handleAppClick" />

          <button @click="openContactModal"
            class="hidden sm:block bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-base">
            Nous contacter
          </button>

          <!-- Auth Section -->
          <div class="hidden sm:relative sm:flex sm:items-center">
            <template v-if="authStore.isLoggedIn">
              <button @click="toggleUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary focus:outline-none transition-colors">
                <div
                  class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {{ userInitials }}
                </div>
                <span class="font-medium">Salut {{ authStore.user?.firstName }}</span>
                <IconChevronDown class="w-4 h-4 transition-transform duration-200"
                  :class="{ 'rotate-180': isUserMenuOpen }" />
              </button>

              <!-- Dropdown Menu -->
              <div v-if="isUserMenuOpen"
                class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-fade-in-up">
                <a v-for="(link, index) in userLinks" :key="index" :href="link.href"
                  class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                  <component :is="link.icon" class="w-4 h-4 mr-3" />
                  {{ link.text }}
                </a>
                <div class="border-t border-gray-100 my-1"></div>
                <button @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                  <IconLogout class="w-4 h-4 mr-3" />
                  Se déconnecter
                </button>
              </div>

              <!-- Overlay to close menu when clicking outside -->
              <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false"
                class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
            </template>

            <SSOAuthButton v-else action="login" tag="a" :showIcon="false"
              class="hidden sm:flex bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-base font-medium ml-2">
              Se connecter
            </SSOAuthButton>
          </div>

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

          <!-- Mobile Auth -->
          <div class="pt-4 border-t border-gray-100 mt-2">
            <PGSAppSwitcher container-id="header-app-switcher" :on-app-click="handleAppClick" />
            
            <template v-if="authStore.isLoggedIn">
              <div class="px-4 py-2 flex items-center space-x-3 mb-2">
                <div
                  class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {{ userInitials }}
                </div>
                <span class="font-medium text-gray-900">Salut {{ authStore.user?.firstName }}</span>
              </div>
              <a v-for="(link, index) in userLinks" :key="index" :href="link.href"
                class="block px-4 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50">
                <div class="flex items-center">
                  <component :is="link.icon" class="w-4 h-4 mr-3" />
                  {{ link.text }}
                </div>
              </a>
              <button @click="handleLogout"
                class="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50">
                <div class="flex items-center">
                  <IconLogout class="w-4 h-4 mr-3" />
                  Se déconnecter
                </div>
              </button>
            </template>
            <SSOAuthButton v-else action="login" tag="a" :showIcon="false"
              class="w-full text-center block bg-white text-primary border border-primary px-4 py-2 rounded-md hover:bg-gray-50 transition-colors text-base font-medium mt-2">
              Se connecter
            </SSOAuthButton>
          </div>
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
import { ref, computed } from 'vue';
import { IconFilePencil, IconMail, IconMenuDeep, IconPhone, IconX, IconUser, IconApps, IconHistory, IconLogout, IconChevronDown } from '@tabler/icons-vue';
import { useSharedFiles } from '~/stores/sharedFiles';
import { useAuthStore } from '~/stores/auth';

const sharedFiles = useSharedFiles();
const authStore = useAuthStore();

const showContactModal = ref(false);
const isMenuOpen = ref(false);
const isUserMenuOpen = ref(false);

const userInitials = computed(() => {
  if (!authStore.user) return '';
  const first = authStore.user.firstName?.charAt(0) || '';
  const last = authStore.user.lastName?.charAt(0) || '';
  return `${first}${last}`.toUpperCase();
});

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  isUserMenuOpen.value = false;
  isMenuOpen.value = false;
  window.location.reload();
};

const navLinks = [
  { to: '/apps', text: 'Applications' },
  { to: '/events', text: 'Événements' },
  { to: '/blog', text: 'Articles' },
  { to: '/about', text: 'À propos' },
];

const userLinks = [
  { text: 'Gérer mon profil', href: 'https://pgs-user.netlify.app/me/profile', icon: IconUser },
  { text: 'Mes services', href: 'https://pgs-user.netlify.app/me/services', icon: IconApps },
  { text: 'Mes sessions', href: 'https://pgs-user.netlify.app/me/sessions', icon: IconHistory },
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
