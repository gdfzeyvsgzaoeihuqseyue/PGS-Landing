<template>
  <div v-if="totalPages > 1" class="mt-8 flex justify-center">
    <nav class="inline-flex flex-wrap rounded-md shadow">
      <button 
        @click="$emit('prev')" 
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        {{ prevLabel }}
      </button>
      
      <button 
        v-for="page in visiblePages" 
        :key="page" 
        @click="$emit('goto', page)"
        :class="[
          page === currentPage 
            ? 'bg-primary border-primary text-white' 
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
          'px-4 py-2 border-t border-b text-sm font-medium'
        ]"
      >
        {{ page }}
      </button>
      
      <button 
        @click="$emit('next')" 
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
      >
        {{ nextLabel }}
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  prevLabel?: string;
  nextLabel?: string;
}

withDefaults(defineProps<Props>(), {
  prevLabel: 'Précédent',
  nextLabel: 'Suivant'
});

defineEmits<{
  'prev': [];
  'next': [];
  'goto': [page: number];
}>();
</script>
