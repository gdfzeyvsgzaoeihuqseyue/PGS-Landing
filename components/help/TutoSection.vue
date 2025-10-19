<template>
  <section id="tutorials-section">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Tutoriels vidéo</h2>
    </div>

    <div v-if="loading" class="text-center py-10">
      <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
      <p class="mt-2 text-gray-600">Chargement des tutoriels...</p>
    </div>

    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else-if="items.length > 0"
      class="relative grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

      <!-- Bouton gauche -->
      <button @click="$emit('scroll', -1)" :disabled="startIndex === 0" class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10
         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
        <IconChevronLeft class="w-6 h-6 text-gray-700" />
      </button>

      <!-- Card tutoriel -->
      <div v-for="tutorial in items" :key="tutorial.id" class="group relative bg-white rounded-xl shadow-lg overflow-hidden p-6 border-2 transition-all duration-300
            hover:shadow-xl hover:scale-105 border-transparent hover:border-primary">
        <!-- Badge plateforme -->
        <div class="flex items-center gap-2 absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full z-50">
          <img :src="tutorial.platform?.logo" :alt="`Logo ${tutorial.platform.name}`" class="w-5 h-5 rounded-full"
            @error="handleImageError($event, tutorial.platform?.name || 'Platform')" />
          <span class="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
            {{ tutorial.platform.name }}
          </span>
        </div>
        <!-- Thumbnail -->
        <div
          class="flex items-center justify-center mb-4 relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
          <img v-if="tutorial.thumbnail" :src="tutorial.thumbnail" :alt="tutorial.title"
            class="absolute inset-0 w-full h-full object-cover" />
          <div v-else class="flex items-center justify-center absolute inset-0">
            <IconVideo class="w-16 h-16 text-primary opacity-50" />
          </div>
        </div>
        <!-- Contenu -->
        <div>
          <p class="text-gray-400 text-xs mb-1">Durée : {{ tutorial.time }}</p>
          <a :href="tutorial.link" target="_blank" rel="noopener noreferrer"
            class="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1 hover:underline"
            :title="tutorial.title">{{ tutorial.title }}</a>
          <p class="text-gray-600 text-sm line-clamp-2" :title="tutorial.description">{{ tutorial.description }}
          </p>
        </div>
      </div>
      <!-- Bouton droit -->
      <button @click="$emit('scroll', 1)" :disabled="!canScrollRight" class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10
         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
        <IconChevronRight class="w-6 h-6 text-gray-700" />
      </button>
    </div>

    <div v-else class="text-center text-gray-500 mt-6">
      Aucun tutoriel trouvé pour votre recherche.
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconVideo, IconLoader } from '@tabler/icons-vue';

defineProps<{
  items: any[];
  loading: boolean;
  error: string | null;
  startIndex: number;
  canScrollRight: boolean;
}>();

defineEmits<{
  scroll: [direction: -1 | 1];
}>();

const handleImageError = (event: Event, platformName: string) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(platformName)}`;
  target.alt = `Logo de ${platformName} non disponible`;
};
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
