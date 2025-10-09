<template>
  <div class="relative">
    <button @click="showModal = !showModal"
      class="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      :class="{ 'rotate-180': showModal }" aria-label="Ouvrir/fermer le menu d'aide et de feedback">
      <IconCircleChevronUp v-if="showModal" class="h-6 w-6" />
      <IconHelp v-else class="h-6 w-6" />
    </button>

    <Transition name="menu-slide-in">
      <div v-if="showModal"
        class="fixed bottom-[100px] right-6 w-80 bg-white rounded-xl shadow-2xl flex flex-col z-40 border border-gray-100"
        @click.self="showModal = false">

        <div class="p-4 border-b">
          <h2 class="text-lg font-bold text-gray-800">Menu d'aide et de contact</h2>
        </div>

        <div class="p-4 space-y-3 overflow-y-auto max-h-[400px]">
          <!-- NOAH AI -->
          <button @click="openNoahAI"
            class="w-full flex items-center justify-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png" alt="NOAH AI"
              class="h-5 w-5 mr-3 flex-shrink-0" />
            <span>Discuter avec NOAH AI BOT</span>
          </button>

          <!-- ChatGPT -->
          <a :href="chatgptUrl" target="_blank" rel="noopener noreferrer"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <div class="flex items-center">
              <IconBrandOpenai class="h-5 w-5 text-primary mr-3" />
              <span>Demander à ChatGPT</span>
            </div>
            <IconExternalLink class="h-4 w-4 text-gray-400" />
          </a>

          <!-- Témoignage -->
          <NuxtLink to="/submit-testimony" @click="showModal = false"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <div class="flex items-center">
              <IconStar class="h-5 w-5 text-primary mr-3" />
              <span>Donner un avis / Témoignage</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/help" @click="showModal = false"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <div class="flex items-center">
              <IconHelpCircle class="h-5 w-5 text-primary mr-3" />
              <span>Centre d'aide</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/wiki" @click="showModal = false"
            class="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <div class="flex items-center">
              <IconLink class="h-5 w-5 text-primary mr-3" />
              <span>Wikilinks (Liens utiles)</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useChatbotStore } from '@/stores/NoahBot';
import {
  IconBrandOpenai, IconHelp, IconCircleChevronUp,
  IconStar, IconHelpCircle, IconLink, IconExternalLink
} from '@tabler/icons-vue';

const showModal = ref(false);
const chatbotStore = useChatbotStore();

// URL ChatGPT
const chatgptUrl = computed(() => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const pageTitle = typeof document !== 'undefined' ? document.title : '';

  const customText = `Peux-tu analyser et résumer le contenu de cette page web ? Voici les informations :
Titre de la page : ${pageTitle}
URL : ${currentUrl}

Merci de me donner un résumé clair et concis des informations principales présentées sur cette page.`;

  return `https://chatgpt.com/?q=${encodeURIComponent(customText)}`;
});

const openNoahAI = () => {
  showModal.value = false;
  chatbotStore.toggleChatbot();
};
</script>

<style scoped>
/* Transition pour l'ouverture du menu flottant (du bas vers le haut) */
.menu-slide-in-enter-active,
.menu-slide-in-leave-active {
  transition: all 0.3s ease-out;
}

.menu-slide-in-enter-from,
.menu-slide-in-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
