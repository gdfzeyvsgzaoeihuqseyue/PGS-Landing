<template>
  <!-- Modal de consentement avec référence -->
  <ConsentModal ref="consentModalRef" />

  <!-- Modale du Chatbot -->
  <Transition name="modal-fade">
    <div v-if="chatbotStore.isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="chatbotStore.toggleChatbot">

      <Transition name="modal-scale">
        <div v-if="chatbotStore.isOpen"
          class="w-full max-w-2xl h-[700px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

          <!-- Header -->
          <div class="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <img :src="sharedFiles.paths.logo.noah" alt="NOAH AI" class="w-6 h-6" />
              </div>
              <div>
                <h3 class="font-bold">NOAH AI</h3>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-primary border border-primary/20 animate-pulse">
                  Assistant PGS
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Bouton Settings -->
              <button @click="showSettingsPanel = true" class="hover:bg-white/20 p-2 rounded-lg transition"
                title="Paramètres">
                <IconSettings class="w-5 h-5" />
              </button>
              <!-- Bouton Close -->
              <button @click="chatbotStore.toggleChatbot" class="hover:bg-white/20 p-2 rounded-lg transition">
                <IconX class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Agent Selector -->
          <div class="bg-gray-50 px-4 py-2 border-b flex items-center justify-between text-sm">
            <span class="text-gray-600">Agent:</span>
            <select v-model="chatbotStore.config.agent"
              :disabled="!chatbotStore.termsAccepted"
              class="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              <option value="auto">Auto</option>
              <option value="mistral">Mimic</option>
              <option value="gemini">Genius</option>
            </select>
          </div>

          <!-- Agent Description -->
          <div class="bg-blue-50 px-4 py-2 border-b text-xs text-gray-700">
            <span v-if="chatbotStore.config.agent === 'gemini'">
              <strong>Genius:</strong> Assistance contextuelle, compréhension approfondie, recommandations polyvalentes.
            </span>
            <span v-else-if="chatbotStore.config.agent === 'mistral'">
              <strong>Mimic:</strong> Rapidité, efficacité, solutions concrètes et actionnables.
            </span>
            <span v-else>
              <strong>Auto:</strong> Intelligence adaptative qui sélectionne automatiquement le meilleur agent selon
              votre besoin.
            </span>
          </div>

          <!-- Messages Container avec scroll infini -->
          <div ref="messagesContainer" @scroll="handleScroll" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

            <!-- Indicateur de chargement de plus de messages -->
            <div v-if="chatbotStore.isLoadingMore" class="text-center py-2">
              <div class="inline-flex items-center space-x-2 text-sm text-gray-500">
                <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Chargement de messages...</span>
              </div>
            </div>

            <!-- Indicateur: Plus de messages disponibles -->
            <div v-if="chatbotStore.hasMoreMessages && !chatbotStore.isLoadingMore" class="text-center py-2">
              <button @click="chatbotStore.loadMoreMessages()" class="text-sm text-primary hover:underline">
                Charger plus de messages
              </button>
            </div>

            <!-- Welcome Message -->
            <div v-if="chatbotStore.messages.length === 0" class="text-center text-gray-500 mt-20">
              <IconSparkles class="w-12 h-12 mx-auto mb-4 text-primary" />
              <p class="font-semibold mb-2">Bonjour! Comment puis-je vous aider?</p>
              <p class="text-sm">Posez-moi des questions sur PRO GESTION SOFT</p>

              <!-- Suggestions dynamiques (uniquement si termes acceptés) -->
              <div v-if="chatbotStore.termsAccepted" class="mt-6 space-y-2">
                <button v-for="(suggestion, index) in currentSuggestions" :key="index"
                  @click="sendQuickMessage(suggestion)"
                  class="w-full text-left px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition text-sm">
                  {{ suggestion }}
                </button>
              </div>
            </div>

            <!-- Messages -->
            <ChatMessage v-for="(message, index) in chatbotStore.messages" :key="message.id" :message="message"
              :is-last-user-message="isLastUserMessage(index)"
              :is-last-assistant-message="isLastAssistantMessage(index)" @regenerate="handleRegenerate"
              @edit="handleEdit" />

            <!-- Loading Indicator -->
            <div v-if="chatbotStore.isLoading" class="flex items-start space-x-2">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <img :src="sharedFiles.paths.logo.noah" alt="NOAH AI" class="w-5 h-5" />
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

          <!-- Input Area - Version AVEC conditions acceptées -->
          <div v-if="chatbotStore.termsAccepted" class="p-4 bg-white border-t">
            <form @submit.prevent="handleSendMessage" class="flex items-end space-x-2">
              <textarea v-model="messageInput" ref="textareaRef" placeholder="Demander à NOAH..."
                class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none leading-relaxed max-h-[150px] overflow-y-auto"
                :disabled="chatbotStore.isLoading" rows="1" @keydown="handleKeyDown"
                @input="autoResize"></textarea>

              <button type="submit"
                :disabled="!messageInput.trim() || chatbotStore.isLoading"
                class="bg-primary text-white px-4 h-[42px] rounded-lg hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <IconSend class="w-5 h-5" />
              </button>
            </form>
            <div class="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span v-html="getInputHint()"></span>
              <button @click="showResetConfirmation = true" class="hover:text-primary transition">
                <IconRestore class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Input Area - Version SANS conditions acceptées (AVERTISSEMENT) -->
          <div v-else class="p-4 bg-orange-50 border-t border-orange-200">
            <div class="flex items-start space-x-3">
              <IconAlertCircle class="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div class="flex-1">
                <p class="text-sm text-orange-800 font-medium mb-2">
                  Conditions d'utilisation requises
                </p>
                <p class="text-xs text-orange-700 mb-3">
                  Vous devez accepter les conditions d'utilisation pour utiliser NOAH AI et commencer à discuter.
                </p>
                <button 
                  @click="openConsentModal"
                  class="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition shadow-sm flex items-center space-x-2">
                  <IconShieldCheck class="w-4 h-4" />
                  <span>Voir et accepter les conditions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Settings Panel -->
  <BotSettingsPanel :is-open="showSettingsPanel" @close="showSettingsPanel = false" @show-toast="showToast" />

  <!-- Notification Toast -->
  <Transition name="toast-fade">
    <div v-if="showNotification"
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[60] flex items-center space-x-2">
      <IconCheck class="w-5 h-5" />
      <span>{{ notificationMessage }}</span>
    </div>
  </Transition>

  <!-- Confirmation Modal -->
  <Transition name="modal-fade">
    <div v-if="showResetConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertTriangle class="w-6 h-6 text-yellow-600" />
          </div>
          <h3 class="font-bold text-lg mb-2">Réinitialiser la conversation</h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir réinitialiser la conversation ?
          </p>
          <div class="flex space-x-3">
            <button @click="showResetConfirmation = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button @click="confirmReset"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue';
import { useChatbotStore } from '@/stores/NoahBot';
import { getRandomSuggestions } from '@/utils/chatSuggestions';
import { ChatMessage } from '@/components/noahBot'
import { IconX, IconSparkles, IconSend, IconRestore, IconCheck, IconAlertTriangle, IconSettings, IconAlertCircle, IconShieldCheck } from '@tabler/icons-vue';
import ConsentModal from './ConsentModal.vue';
import BotSettingsPanel from './BotSettingsPanel.vue';
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();
const chatbotStore = useChatbotStore();
const messageInput = ref<string>('');
const messagesContainer = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const currentSuggestions = ref<string[]>([]);
const isMobile = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');
const showResetConfirmation = ref(false);
const showSettingsPanel = ref(false);
const scrollContainer = ref<HTMLElement | null>(null);
const consentModalRef = ref<InstanceType<typeof ConsentModal> | null>(null);

const isLastUserMessage = (index: number) => {
  const messages = chatbotStore.messages;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return i === index;
    }
  }
  return false;
};

const isLastAssistantMessage = (index: number) => {
  const messages = chatbotStore.messages;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      return i === index;
    }
  }
  return false;
};

// Fonction pour ouvrir le modal de consentement
const openConsentModal = () => {
  if (consentModalRef.value) {
    consentModalRef.value.open();
  }
};

// Détecter le scroll vers le haut pour charger plus de messages
const handleScroll = async () => {
  if (!messagesContainer.value) return;

  const { scrollTop } = messagesContainer.value;

  // Si on scroll vers le haut et qu'on est proche du début
  if (scrollTop < 100 && chatbotStore.hasMoreMessages && !chatbotStore.isLoadingMore) {
    const previousScrollHeight = messagesContainer.value.scrollHeight;

    await chatbotStore.loadMoreMessages();

    // Maintenir la position de scroll après le chargement
    await nextTick();
    if (messagesContainer.value) {
      const newScrollHeight = messagesContainer.value.scrollHeight;
      messagesContainer.value.scrollTop = newScrollHeight - previousScrollHeight + scrollTop;
    }
  }
};

onMounted(() => {
  chatbotStore.initConversation(window.location.pathname);
  currentSuggestions.value = getRandomSuggestions(3);
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
});

watch(() => chatbotStore.messages.length, (newLength) => {
  if (newLength === 0) {
    currentSuggestions.value = getRandomSuggestions(3);
  }
  scrollToBottom();
});

const showToast = (message: string, duration: number = 3000) => {
  notificationMessage.value = message;
  showNotification.value = true;

  setTimeout(() => {
    showNotification.value = false;
  }, duration);
};

const getInputHint = () => {
  if (isMobile.value) {
    return 'NOAH Ai peut faire des erreurs';
  }
  return 'Entrer pour envoyer, Shift+Entrer pour nouvelle ligne. \n NOAH Ai peut faire des erreurs';
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (isMobile.value) {
      return;
    } else {
      if (event.shiftKey) {
        return;
      } else {
        event.preventDefault();
        handleSendMessage();
      }
    }
  }
};

const autoResize = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }
};

const handleSendMessage = async () => {
  if (!messageInput.value.trim() || chatbotStore.isLoading || !chatbotStore.termsAccepted) return;

  const message = messageInput.value;
  messageInput.value = '';

  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }

  try {
    await chatbotStore.sendMessage(message);
    await scrollToBottom();
  } catch (error) {
    console.error('Error sending message:', error);
    messageInput.value = message;
  }
};

const sendQuickMessage = async (message: string) => {
  if (!chatbotStore.termsAccepted) return;
  messageInput.value = message;
  await handleSendMessage();
};

const handleRegenerate = async (messageId: string) => {
  try {
    await chatbotStore.regenerateMessage(messageId);
    showToast('Message régénéré avec succès');
  } catch (error) {
    console.error('Error regenerating message:', error);
    showToast('Erreur lors de la régénération', 5000);
  }
};

const handleEdit = async (messageId: string, newContent: string) => {
  try {
    await chatbotStore.editMessage(messageId, newContent);
    showToast('Message modifié avec succès');
  } catch (error) {
    console.error('Error editing message:', error);
    showToast('Erreur lors de la modification', 5000);
  }
};

const handleReset = () => {
  showResetConfirmation.value = true;
};

const confirmReset = () => {
  showResetConfirmation.value = false;

  // Exécuter la réinitialisation
  chatbotStore.resetConversation();
  chatbotStore.initConversation(window.location.pathname);
  currentSuggestions.value = getRandomSuggestions(3);
  showToast('Conversation réinitialisée');
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.3s ease;
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
