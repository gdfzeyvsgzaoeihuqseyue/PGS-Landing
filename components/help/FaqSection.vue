<template>
  <section class="mb-24">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">Questions fréquentes</h2>
      <div class="flex items-center space-x-2">
        <button v-if="canShowMore" @click="$emit('toggleShowAll')"
          class="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
          {{ showAll ? 'Voir moins' : `Voir plus (${remaining})` }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
      <p class="mt-2 text-gray-600">Chargement des FAQs...</p>
    </div>
    <div v-else-if="error" class="text-center py-10">
      <p class="text-red-600">{{ error }}</p>
    </div>
    <div v-else-if="items.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        v-for="(item, index) in items" :key="item.id" @click="$emit('toggle', index)">
        <!-- Badge plateforme -->
        <div class="mb-2 flex justify-between items-center text-xs font-semibold">
          <!-- Affichage logo + nom plateforme -->
          <div class="flex items-center gap-2">
            <img :src="item.platform?.logo" :alt="`Logo ${item.platform.name}`" class="w-5 h-5 rounded-full" />
            <span class="text-xs font-medium text-primary bg-primary/30 px-2 py-1 rounded-full">
              {{ item.platform.name }}
            </span>
          </div>
        </div>

        <h3 class="text-xl font-bold mb-4 flex justify-between items-center">
          {{ item.question }}
          <IconChevronDown
            :class="['w-6 h-6 transform transition-transform duration-300', { 'rotate-180': openIndices.includes(index) }]" />
        </h3>

        <div class="overflow-hidden transition-all duration-300"
          :class="openIndices.includes(index) ? 'max-h-96 mt-4' : 'max-h-0'">
          <p class="text-gray-600 leading-relaxed">{{ item.answer }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 mt-6">
      Aucune FAQ trouvée pour votre recherche.
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconChevronDown, IconLoader } from '@tabler/icons-vue';

defineProps<{
  items: any[];
  loading: boolean;
  error: string | null;
  openIndices: number[];
  showAll: boolean;
  canShowMore: boolean;
  remaining: number;
}>();

defineEmits<{
  toggle: [index: number];
  toggleShowAll: [];
}>();
</script>
