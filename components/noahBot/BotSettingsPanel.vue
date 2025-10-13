<template>
  <Transition name="slide-fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
      @click.self="close">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Paramètres NOAH AI</h2>
          <button @click="close" class="p-2 hover:bg-gray-100 rounded-lg transition">
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Section: Modèle par défaut -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <IconRobot class="w-4 h-4 mr-2" />
              Modèle par défaut
            </h3>
            <div class="space-y-2">
              <label class="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                :class="{ 'border-primary bg-primary/5': selectedAgent === 'auto' }">
                <input type="radio" v-model="selectedAgent" value="auto" class="mt-1" />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">Auto</div>
                  <div class="text-xs text-gray-500">
                    Sélectionne automatiquement le meilleur agent selon votre besoin
                  </div>
                </div>
              </label>

              <label class="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                :class="{ 'border-primary bg-primary/5': selectedAgent === 'mistral' }">
                <input type="radio" v-model="selectedAgent" value="mistral" class="mt-1" />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">Mimic</div>
                  <div class="text-xs text-gray-500">
                    Rapide et efficace, solutions concrètes et actionnables
                  </div>
                </div>
              </label>

              <label class="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                :class="{ 'border-primary bg-primary/5': selectedAgent === 'gemini' }">
                <input type="radio" v-model="selectedAgent" value="gemini" class="mt-1" />
                <div class="flex-1">
                  <div class="font-medium text-gray-900">Genius</div>
                  <div class="text-xs text-gray-500">
                    Compréhension approfondie, recommandations polyvalentes
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Section: Conditions d'utilisation -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <IconShieldCheck class="w-4 h-4 mr-2" />
              Conditions d'utilisation
            </h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-600 mb-3">
                Vous avez accepté les conditions d'utilisation de NOAH AI.
              </p>
              <button @click="showResetTermsModal = true" class="w-full px-4 py-2 border border-orange-300 text-orange-700 rounded-lg 
                       hover:bg-orange-50 transition text-sm font-medium">
                Réinitialiser les conditions
              </button>
            </div>
          </div>

          <!-- Section: Gestion des données -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <IconDatabase class="w-4 h-4 mr-2" />
              Gestion des données
            </h3>
            <div class="bg-red-50 rounded-lg p-4 border border-red-100">
              <p class="text-sm text-red-700 mb-3 flex items-start">
                <IconAlertTriangle class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Cette action supprimera définitivement toutes vos conversations.</span>
              </p>
              <button @click="showDeleteModal = true" class="w-full px-4 py-2 bg-red-500 text-white rounded-lg 
                       hover:bg-red-600 transition text-sm font-medium">
                Effacer toutes les conversations
              </button>
            </div>
          </div>

          <!-- Section: À propos -->
          <div>
            <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <IconInfoCircle class="w-4 h-4 mr-2" />
              À propos
            </h3>
            <div class="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p><strong>Version:</strong> 1.0.0 (Bêta)</p>
              <p><strong>Agents disponibles:</strong> Mimic, Genius</p>
              <p><strong>Support:</strong> progestionsoft@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de confirmation: Réinitialisation des conditions -->
  <Transition name="modal-fade">
    <div v-if="showResetTermsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconAlertTriangle class="w-6 h-6 text-orange-600" />
          </div>
          <h3 class="font-bold text-lg mb-2">Réinitialiser les conditions</h3>
          <p class="text-gray-600 mb-6 text-sm">
            Vous devrez accepter à nouveau les conditions d'utilisation au prochain lancement du chatbot.
          </p>
          <div class="flex space-x-3">
            <button @click="showResetTermsModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button @click="confirmResetTerms"
              class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de confirmation: Suppression des conversations -->
  <Transition name="modal-fade">
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div class="text-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconTrash class="w-6 h-6 text-red-600" />
          </div>
          <h3 class="font-bold text-lg mb-2">Effacer toutes les conversations</h3>
          <p class="text-gray-600 mb-6 text-sm">
            Cette action est irréversible. Toutes vos conversations seront définitivement supprimées.
          </p>
          <div class="flex space-x-3">
            <button @click="showDeleteModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              Annuler
            </button>
            <button @click="confirmDeleteAll" :disabled="isDeleting" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition 
                     disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useChatbotStore } from '@/stores/NoahBot';
import { IconX, IconRobot, IconShieldCheck, IconDatabase, IconInfoCircle, IconAlertTriangle, IconTrash } from '@tabler/icons-vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  'show-toast': [message: string];
}>();

const chatbotStore = useChatbotStore();
const selectedAgent = ref(chatbotStore.config.agent);
const showResetTermsModal = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

// Sauvegarder automatiquement les changements de modèle
watch(selectedAgent, (newAgent) => {
  chatbotStore.config.agent = newAgent as 'auto' | 'mistral' | 'gemini';

  // Sauvegarder dans localStorage
  try {
    localStorage.setItem('noah_preferred_agent', newAgent);
  } catch (error) {
    console.error('Failed to save agent preference:', error);
  }
});

onMounted(() => {
  // Charger les préférences depuis localStorage
  try {
    const savedAgent = localStorage.getItem('noah_preferred_agent');
    if (savedAgent) {
      selectedAgent.value = savedAgent as 'auto' | 'mistral' | 'gemini';
    }
  } catch (error) {
    console.error('Failed to load agent preference:', error);
  }
});

const close = () => {
  emit('close');
};

const confirmResetTerms = async () => {
  try {
    await chatbotStore.resetTermsAcceptance();
    showResetTermsModal.value = false;
    emit('show-toast', 'Conditions réinitialisées avec succès');

    // Fermer le panneau et le chatbot
    close();
    chatbotStore.toggleChatbot();
  } catch (error) {
    console.error('Failed to reset terms:', error);
    emit('show-toast', 'Erreur lors de la réinitialisation');
  }
};

const confirmDeleteAll = async () => {
  isDeleting.value = true;

  try {
    await chatbotStore.deleteAllConversations();
    showDeleteModal.value = false;
    emit('show-toast', 'Toutes les conversations ont été supprimées');
    close();
  } catch (error) {
    console.error('Failed to delete conversations:', error);
    emit('show-toast', 'Erreur lors de la suppression');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
