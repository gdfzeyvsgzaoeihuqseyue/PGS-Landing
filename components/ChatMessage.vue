<template>
  <div :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
    <div :class="['max-w-[80%] flex', message.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
      <!-- Avatar -->
      <div :class="['flex-shrink-0', message.role === 'user' ? 'ml-2' : 'mr-2']">
        <div :class="[
          'w-8 h-8 rounded-full flex items-center justify-center',
          message.role === 'user' ? 'bg-gray-300' : 'bg-primary'
        ]">
          <IconUser v-if="message.role === 'user'" class="w-5 h-5 text-gray-600" />
          <IconBrain v-else class="w-5 h-5 text-white"/>
        </div>
      </div>

      <!-- Message Content -->
      <div>
        <div :class="[
          'p-3 rounded-lg shadow-sm',
          message.role === 'user'
            ? 'bg-primary text-white'
            : 'bg-white text-gray-800'
        ]">
          <!-- Agent Badge -->
          <div v-if="message.role === 'assistant' && message.agent"
            class="text-xs text-gray-500 mb-1 flex items-center space-x-1">
            <span class="px-2 py-0.5 bg-gray-100 rounded-full">
              {{ message.agent === 'mistral' ? '⚡ Mistral' : '🌟 Gemini' }}
            </span>
          </div>

          <!-- Text Content -->
          <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>

          <!-- Images -->
          <div v-if="message.images && message.images.length > 0" class="mt-2 space-y-2">
            <img v-for="(image, index) in message.images" :key="index" :src="image"
              :alt="`Generated image ${index + 1}`"
              class="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition" @click="openImageModal(image)" />
          </div>

          <!-- Metadata -->
          <div v-if="message.metadata?.tools_used && message.metadata.tools_used.length > 0"
            class="mt-2 text-xs opacity-75">
            <span class="flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Outils: {{ message.metadata.tools_used.join(', ') }}</span>
            </span>
          </div>
        </div>

        <!-- Timestamp -->
        <div v-if="message.role === 'assistant'" class="mt-1 text-xs text-gray-500">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from '@/types/chatbot';
import { IconBrain, IconUser } from '@tabler/icons-vue';

interface Props {
  message: ChatMessage;
}

defineProps<Props>();

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const openImageModal = (imageUrl: string) => {
  window.open(imageUrl, '_blank');
};
</script>
