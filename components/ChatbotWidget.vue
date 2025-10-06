<template>
  <div class="fixed bottom-6 left-6 z-50">
    <!-- Fenêtre du chatbot -->
    <Transition name="slide-up">
      <div v-if="chatbotStore.isOpen"
        class="mb-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        <!-- Header -->
        <div class="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <IconBrain class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="font-bold">Assistant PGS</h3>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-primary border border-primary/20 animate-pulse">
                Bêta
              </span>
            </div>

          </div>
          <button @click="chatbotStore.toggleChatbot" class="hover:bg-white/20 p-2 rounded-lg transition">
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Agent Selector -->
        <div class="bg-gray-50 px-4 py-2 border-b flex items-center justify-between text-sm">
          <span class="text-gray-600">Agent:</span>
          <select v-model="chatbotStore.config.agent"
            class="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none">
            <option value="auto">Auto</option>
            <option value="mistral">Mimic</option>
            <option value="gemini">Genius</option>
          </select>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <!-- Welcome Message -->
          <div v-if="chatbotStore.messages.length === 0" class="text-center text-gray-500 mt-20">
            <IconSparkles class="w-12 h-12 mx-auto mb-4 text-primary" />
            <p class="font-semibold mb-2">Bonjour! Comment puis-je vous aider?</p>
            <p class="text-sm">Posez-moi des questions sur les PRO GESTION SOFT</p>

            <!-- Suggestions -->
            <div class="mt-6 space-y-2">
              <button @click="sendQuickMessage('Quelles sont vos solutions?')"
                class="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition text-sm">
                Quelles sont vos solutions?
              </button>
              <button @click="sendQuickMessage('Comment fonctionne SuitOps?')"
                class="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition text-sm">
                Comment fonctionne SuitOps?
              </button>
              <button @click="sendQuickMessage('Générer une image d\'illustration')"
                class="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition text-sm">
                Générer une image d'illustration
              </button>
            </div>
          </div>

          <!-- Messages -->
          <ChatMessage v-for="message in chatbotStore.messages" :key="message.id" :message="message" />

          <!-- Loading Indicator -->
          <div v-if="chatbotStore.isLoading" class="flex items-start space-x-2">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <IconBrain class="w-5 h-5 text-white" />
            </div>
            <div class="bg-white p-3 rounded-lg shadow-sm">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t">
          <form @submit.prevent="handleSendMessage" class="flex space-x-2">
            <input v-model="messageInput" type="text" placeholder="Écrivez votre message..."
              class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              :disabled="chatbotStore.isLoading" />
            <button type="submit" :disabled="!messageInput || chatbotStore.isLoading"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed">
              <IconSend class="w-5 h-5" />
            </button>
          </form>
          <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
            <span>Propulsé par {{ chatbotStore.config.agent === 'auto' ? 'IA Multi-Agent' : chatbotStore.config.agent
            }}</span>
            <button @click="handleReset" class="hover:text-primary transition">
              <IconRestore class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toggle Button -->
    <button @click="chatbotStore.toggleChatbot"
      class="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center">
      <IconLifebuoy v-if="!chatbotStore.isOpen" class="w-4 h-4" />
      <IconX v-else class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { useChatbotStore } from '@/stores/chatbot';
import { IconBrain, IconX, IconSparkles, IconSend, IconRestore, IconLifebuoy } from '@tabler/icons-vue';

const chatbotStore = useChatbotStore();
const messageInput = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  chatbotStore.initConversation(window.location.pathname);
});

const handleSendMessage = async () => {
  if (!messageInput.value || !messageInput.value.trim()) return;

  const message = messageInput.value;
  messageInput.value = '';

  try {
    await chatbotStore.sendMessage(message);
    await scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    // Restaurer le message en cas d'erreur
    messageInput.value = message;
  }
};

const sendQuickMessage = async (message: string) => {
  messageInput.value = message;
  await handleSendMessage();
};

const handleReset = () => {
  if (confirm('Voulez-vous vraiment réinitialiser la conversation?')) {
    chatbotStore.resetConversation();
    chatbotStore.initConversation(window.location.pathname);
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
