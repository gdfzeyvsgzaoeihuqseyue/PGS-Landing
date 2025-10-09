<template>
  <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !modelValue, 'block': modelValue }">
    <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <!-- En-tête mobile -->
      <div class="flex justify-between items-center mb-6 lg:hidden">
        <h3 class="text-lg font-bold">Filtres</h3>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500">
          <IconX class="h-6 w-6" />
        </button>
      </div>

      <!-- Bloc statistiques -->
      <div class="mb-8">
        <h3 class="text-lg font-bold mb-4">Statistiques</h3>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold">{{ stats.totalSolutions }}</p>
            <p class="text-gray-600">Total solutions</p>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.totalDocs }}</p>
            <p class="text-gray-600">Docs</p>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.totalFaqs }}</p>
            <p class="text-gray-600">FAQs</p>
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stats.totalTutorials }}</p>
            <p class="text-gray-600">Tutoriels</p>
          </div>
        </div>
      </div>

      <!-- Filtres pour la Documentation -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-bold mb-3">Filtres Documentation</h3>
        <div>
          <input 
            :value="filters.docs.search" 
            @input="$emit('update:filters', { ...filters, docs: { ...filters.docs, search: ($event.target as HTMLInputElement).value } })"
            type="search" 
            placeholder="Rechercher une documentation..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
        </div>
        <div>
          <select 
            :value="filters.docs.category" 
            @change="$emit('update:filters', { ...filters, docs: { ...filters.docs, category: ($event.target as HTMLSelectElement).value } })"
            class="w-full px-4 py-2 border rounded-lg">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filtres pour les Questions fréquentes -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-bold mb-3">Filtres Questions fréquentes</h3>
        <div>
          <input 
            :value="filters.faqs.search" 
            @input="$emit('update:filters', { ...filters, faqs: { ...filters.faqs, search: ($event.target as HTMLInputElement).value } })"
            type="search" 
            placeholder="Rechercher une question..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
        </div>
        <div>
          <select 
            :value="filters.faqs.category" 
            @change="$emit('update:filters', { ...filters, faqs: { ...filters.faqs, category: ($event.target as HTMLSelectElement).value } })"
            class="w-full px-4 py-2 border rounded-lg">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filtres pour les Tutoriels Vidéo -->
      <div class="space-y-6 mb-8">
        <h3 class="text-lg font-bold mb-3">Filtres Tutoriels Vidéo</h3>
        <div>
          <input 
            :value="filters.tutorials.search" 
            @input="$emit('update:filters', { ...filters, tutorials: { ...filters.tutorials, search: ($event.target as HTMLInputElement).value } })"
            type="search" 
            placeholder="Rechercher un tutoriel..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
        </div>
        <div>
          <select 
            :value="filters.tutorials.category" 
            @change="$emit('update:filters', { ...filters, tutorials: { ...filters.tutorials, category: ($event.target as HTMLSelectElement).value } })"
            class="w-full px-4 py-2 border rounded-lg">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Bouton de réinitialisation -->
      <button @click="$emit('reset')"
        class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
        Réinitialiser les filtres
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue';

defineProps<{
  modelValue: boolean;
  stats: {
    totalSolutions: number;
    totalDocs: number;
    totalFaqs: number;
    totalTutorials: number;
  };
  filters: {
    docs: { search: string; category: string };
    faqs: { search: string; category: string };
    tutorials: { search: string; category: string };
  };
  categories: string[];
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
  'update:filters': [filters: any];
  'reset': [];
}>();
</script>
