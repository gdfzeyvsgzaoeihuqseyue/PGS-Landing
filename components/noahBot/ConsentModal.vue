<template>
  <Transition name="modal-fade">
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconShieldCheck class="w-8 h-8 text-primary" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Conditions d'utilisation</h2>
          <p class="text-sm text-gray-500">Avant de commencer avec NOAH AI</p>
        </div>

        <div class="bg-gray-50 rounded-lg p-6 mb-6 max-h-60 overflow-y-auto">
          <div class="space-y-4 text-sm text-gray-700">
            <p class="font-semibold text-gray-900">
              En utilisant NOAH AI, vous acceptez les conditions suivantes:
            </p>

            <div class="flex items-start space-x-3">
              <IconInfoCircle class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                Vos conversations sont utilisées de façon <strong>anonymisée</strong> pour améliorer
                et entraîner notre modèle d'intelligence artificielle.
              </p>
            </div>

            <div class="flex items-start space-x-3">
              <IconDatabase class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                Une copie de vos conversations peut être conservée même après suppression
                pour des raisons d'amélioration continue du service.
              </p>
            </div>

            <div class="flex items-start space-x-3">
              <IconLock class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p>
                Vos données sont stockées de manière sécurisée et ne sont jamais partagées
                avec des tiers à des fins commerciales.
              </p>
            </div>

            <div class="flex items-start space-x-3">
              <IconAlertCircle class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <p class="text-orange-700">
                Ne partagez jamais d'informations sensibles, personnelles ou confidentielles
                dans vos conversations.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="handleRefuse" class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium 
                   hover:bg-gray-50 transition-colors">
            Refuser
          </button>
          <button @click="handleAccept" class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium 
                   hover:bg-secondary transition-colors shadow-md">
            Accepter et continuer
          </button>
        </div>

        <p class="text-xs text-gray-500 text-center mt-4">
          Vous pouvez réinitialiser votre acceptation à tout moment dans les paramètres du chatbot.
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useChatbotStore } from '@/stores/NoahBot';
import { IconShieldCheck, IconInfoCircle, IconDatabase, IconLock, IconAlertCircle } from '@tabler/icons-vue';

const chatbotStore = useChatbotStore();
const showModal = ref(false);

const emit = defineEmits<{
  accepted: [];
  refused: [];
}>();

// Observer l'ouverture du chatbot pour afficher le modal si nécessaire
watch(() => chatbotStore.isOpen, (isOpen) => {
  if (isOpen) {
    const termsAccepted = chatbotStore.checkTermsAcceptance();
    if (!termsAccepted) {
      showModal.value = true;
    }
  }
});

// Fonction pour ouvrir manuellement le modal (depuis les paramètres)
const open = () => {
  showModal.value = true;
};

const handleAccept = async () => {
  try {
    await chatbotStore.acceptTerms();
    showModal.value = false;
    emit('accepted');
  } catch (error) {
    console.error('Failed to accept terms:', error);
    alert('Erreur lors de l\'acceptation des conditions. Veuillez réessayer.');
  }
};

const handleRefuse = () => {
  showModal.value = false;
  chatbotStore.toggleChatbot();
  emit('refused');
};

// Exposer la méthode open pour l'appeler depuis le parent
defineExpose({
  open
});
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
</style>
