<template>
  <div class="flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <!-- Copier -->
    <button
      @click="handleCopy"
      class="p-1.5 rounded hover:bg-gray-100 transition-colors"
      title="Copier le message"
    >
      <IconCheck v-if="copied" class="w-4 h-4 text-green-600" />
      <IconCopy v-else class="w-4 h-4 text-gray-600" />
    </button>

    <!-- Régénérer -->
    <button
      v-if="role === 'assistant'"
      @click="$emit('regenerate')"
      class="p-1.5 rounded hover:bg-gray-100 transition-colors"
      title="Régénérer la réponse"
    >
      <IconRefresh class="w-4 h-4 text-gray-600" />
    </button>

    <!-- Modifier -->
    <button
      v-if="role === 'user'"
      @click="$emit('edit')"
      class="p-1.5 rounded hover:bg-gray-100 transition-colors"
      title="Modifier le message"
    >
      <IconEdit class="w-4 h-4 text-gray-600" />
    </button>

    <!-- Partager -->
    <button
      @click="$emit('share')"
      class="p-1.5 rounded hover:bg-gray-100 transition-colors"
      title="Partager"
    >
      <IconShare class="w-4 h-4 text-gray-600" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCopy, IconCheck, IconRefresh, IconEdit, IconShare } from '@tabler/icons-vue';

interface Props {
  content: string;
  role: 'user' | 'assistant';
}

const props = defineProps<Props>();
defineEmits<{
  regenerate: [];
  edit: [];
  share: [];
}>();

const copied = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
