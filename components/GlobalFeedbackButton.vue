<template>
  <div>
    <!-- Bouton flottant -->
    <button @click="showModal = true"
      class="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50"
      aria-label="Ouvrir le menu d'aide et de feedback">
      <IconMessageCircle class="h-4 w-4" />
    </button>

    <!-- Modale -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button @click="showModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <IconX class="h-6 w-6" />
        </button>
        <h2 class="text-2xl font-bold mb-6 text-center">Besoin d'aide ou de nous contacter ?</h2>
        <div class="space-y-4">
          <NuxtLink to="/submit-testimony" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconStar class="h-6 w-6 text-primary mr-3" />
            <span>Donner un avis / Témoignage</span>
          </NuxtLink>
          <NuxtLink to="/legal" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconFileText class="h-6 w-6 text-primary mr-3" />
            <span>Mentions Légales</span>
          </NuxtLink>
          <NuxtLink to="/terms" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconFileDescription class="h-6 w-6 text-primary mr-3" />
            <span>Conditions Générales d'Utilisation</span>
          </NuxtLink>
          <NuxtLink to="/help" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconHelpCircle class="h-6 w-6 text-primary mr-3" />
            <span>Centre de Ressources / Aide</span>
          </NuxtLink>
          <NuxtLink to="/wikilink" @click="showModal = false"
            class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <IconLink class="h-6 w-6 text-primary mr-3" />
            <span>Wikilinks (Liens utiles)</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconMessageCircle, IconX, IconStar, IconFileText, IconFileDescription, IconHelpCircle, IconLink } from '@tabler/icons-vue';

const showModal = ref(false);
</script>

