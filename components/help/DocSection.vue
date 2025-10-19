<template>
  <section class="mb-24" id="documentation-section">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Documentation</h2>
    </div>

    <div v-if="loading" class="text-center py-10">
      <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
      <p class="mt-2 text-gray-600">Chargement de la documentation...</p>
    </div>
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else-if="items.length > 0"
      class="relative grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
      <!-- Bouton de navigation gauche -->
      <button @click="$emit('scroll', -1)" :disabled="startIndex === 0"
        class="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
        <IconChevronLeft class="w-6 h-6 text-gray-700" />
      </button>

      <!-- Conteneur des cards de documentation -->
      <NuxtLink v-for="item in items" :key="item.solution.id"
        :to="`/solutions/${item.solution.slug}`"
        class="flex flex-col bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
        <div class="flex items-center mb-6">
          <div class="w-16 h-16 mr-4 flex items-center justify-center">
            <img :src="item.solution.logo" :alt="item.solution.name" class="h-[3em] w-auto scale-[1.5] rounded-full"
              @error="handleImageError" />
          </div>
          <div class="flex-grow">
            <h3 class="text-xl font-bold leading-tight">{{ item.solution.name }}</h3>
            <p class="text-gray-500 text-sm">{{ item.solution.category }}</p>
          </div>
        </div>

        <div v-if="!item.docs.length" class="text-center text-gray-500 italic flex-grow">
          Aucun document disponible
        </div>
        <ul v-else class="space-y-4 flex-grow">
          <li v-for="doc in item.docs" :key="doc.id">
            <a :href="doc.link" target="_blank"
              class="group flex items-center text-gray-600 hover:text-primary transition-colors"
              :title="doc.name">
              <span class="mr-2 overflow-hidden whitespace-nowrap text-ellipsis line-clamp-1">
                {{ doc.name }}
              </span>
              <IconChevronRight class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </li>
        </ul>
      </NuxtLink>

      <!-- Bouton de navigation droite -->
      <button @click="$emit('scroll', 1)" :disabled="!canScrollRight"
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors">
        <IconChevronRight class="w-6 h-6 text-gray-700" />
      </button>
    </div>

    <div v-else class="text-center text-gray-500 mt-6">
      Aucune documentation trouvée pour votre recherche.
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronRight, IconLoader } from '@tabler/icons-vue';

defineProps<{
  items: Array<{ solution: any; docs: any[] }>;
  loading: boolean;
  error: string | null;
  startIndex: number;
  canScrollRight: boolean;
}>();

defineEmits<{
  scroll: [direction: -1 | 1];
}>();

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const name = target.alt || 'Logo non disponible';
  target.src = `https://api.dicebear.com/7.x/icons/svg?seed=${name}`;
};
</script>
