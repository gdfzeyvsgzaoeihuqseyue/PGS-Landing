<template>
  <aside class="lg:w-1/4" :class="{ 'hidden lg:block': !modelValue, 'block': modelValue }">
    <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
      <!-- En-tête mobile -->
      <div class="flex justify-between items-center mb-6 lg:hidden">
        <h3 class="text-lg font-bold">{{ title }}</h3>
        <button @click="$emit('update:modelValue', false)" class="text-gray-500">
          <IconX class="h-6 w-6" />
        </button>
      </div>

      <!-- Bloc statistiques -->
      <div v-if="stats && Object.keys(stats).length > 0" class="mb-8">
        <h3 class="text-base sm:text-lg font-bold mb-4">{{ statsTitle }}</h3>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div v-for="(value, key) in stats" :key="key">
            <p class="text-xl sm:text-2xl font-bold">{{ value }}</p>
            <p class="text-sm sm:text-base text-gray-600">{{ formatStatKey(key) }}</p>
          </div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="space-y-6">
        <!-- Barre de recherche -->
        <div v-if="showSearch">
          <h3 class="text-base sm:text-lg font-bold mb-3">{{ searchLabel }}</h3>
          <div class="relative">
            <input :value="filters.search" @input="handleSearchInput" type="text" :placeholder="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconSearch class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Filtre par catégorie -->
        <div v-if="categories && categories.length > 0">
          <h3 class="text-base sm:text-lg font-bold mb-3">{{ categoryLabel }}</h3>
          <select :value="filters.category" @change="handleCategoryChange" class="w-full px-4 py-2 border rounded-lg">
            <option value="">{{ categoryAllLabel }}</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Sélecteur de tri -->
        <div v-if="sortOptions && sortOptions.length > 0">
          <h3 class="text-base sm:text-lg font-bold mb-3">{{ sortLabel }}</h3>
          <select :value="filters.sortOrder" @change="handleSortChange" class="w-full px-4 py-2 border rounded-lg">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Slot pour filtres personnalisés -->
        <slot name="custom-filters" :filters="filters" />

        <!-- Bouton de réinitialisation -->
        <button @click="$emit('reset')"
          class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
          {{ resetLabel }}
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { IconX, IconSearch } from '@tabler/icons-vue';
import type { SidebarFilter } from '~/composables/useSidebar';

interface SortOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: boolean;
  filters: SidebarFilter;
  stats?: Record<string, number | string>;
  categories?: string[];
  sortOptions?: SortOption[];
  title?: string;
  statsTitle?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  categoryLabel?: string;
  categoryAllLabel?: string;
  sortLabel?: string;
  resetLabel?: string;
  showSearch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Filtres',
  statsTitle: 'Statistiques',
  searchLabel: 'Rechercher',
  searchPlaceholder: 'Rechercher...',
  categoryLabel: 'Filtrer par catégorie',
  categoryAllLabel: 'Toutes les catégories',
  sortLabel: 'Trier par',
  resetLabel: 'Réinitialiser les filtres',
  showSearch: true
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:filters': [filters: SidebarFilter];
  'reset': [];
}>();

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) {
    emit('update:filters', { ...props.filters, search: target.value });
  }
};

const handleCategoryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit('update:filters', { ...props.filters, category: target.value });
  }
};

const handleSortChange = (event: Event) => {
  const target = event.target as HTMLSelectElement | null;
  if (target) {
    emit('update:filters', { ...props.filters, sortOrder: target.value });
  }
};

const formatStatKey = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};
</script>
