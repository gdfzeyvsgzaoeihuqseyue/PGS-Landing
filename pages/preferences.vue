<template>
  <main class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <header class="text-center mb-8 relative">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Gestion des <span class="text-primary">Préférences</span>
        </h1>
        <p class="text-lg text-gray-600">
          Mettez à jour vos informations d'inscription à la bêta SuitOps
        </p>
      </header>

      <div class="bg-white rounded-xl shadow-lg p-8 relative">
        <div v-if="preferencesStore.currentStep === 'initial'" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p class="text-gray-600">Vérification en cours...</p>
        </div>

        <div v-else-if="preferencesStore.currentStep === 'email_input'">
          <div class="text-center mb-8">
            <IconMail class="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Accès aux préférences</h2>
            <p class="text-gray-600">
              Veuillez saisir votre adresse e-mail pour recevoir un code de vérification.
            </p>
          </div>

          <form @submit.prevent="handleEmailSubmit" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input id="email" v-model="preferencesStore.email" type="email" required
                :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                placeholder="votre@email.com" />
            </div>

            <button type="submit" :disabled="preferencesStore.isLoading || !preferencesStore.email"
              class="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
              <IconLoader v-if="preferencesStore.isLoading" class="w-5 h-5 mr-2 animate-spin" />
              <IconSend v-else class="w-5 h-5 mr-2" />
              {{ preferencesStore.isLoading ? 'Envoi en cours...' : 'Envoyer le code' }}
            </button>
          </form>
        </div>

        <div v-else-if="preferencesStore.currentStep === 'totp_input'">
          <div class="flex justify-center items-center mb-4">
            <IconShieldCheck class="w-16 h-16 text-primary mx-auto" />
            <button @click="openInfoModal('totp')" title="Pourquoi cette vérification ?" type="button"
              class="ml-4 text-primary hover:text-secondary p-2 rounded-full border border-primary hover:border-secondary transition">
              <IconInfoCircle class="w-6 h-6" />
            </button>
          </div>
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Code de vérification</h2>
            <p class="text-gray-600 mb-2">
              Un code de vérification a été envoyé à :
            </p>
            <p class="font-medium text-gray-900">{{ preferencesStore.maskedEmail }}</p>
          </div>

          <form @submit.prevent="handleTotpSubmit" class="space-y-6 mt-8">
            <div>
              <label for="totpCode" class="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification (6 chiffres)
              </label>
              <input id="totpCode" v-model="preferencesStore.totpCode" type="text" maxlength="6" pattern="[0-9]{6}"
                required :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 text-center text-2xl font-mono tracking-widest"
                placeholder="000000" />
            </div>

            <div class="flex gap-4">
              <button type="button" @click="handleBackToEmail"
                class="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center">
                <IconArrowLeft class="w-5 h-5 mr-2" />
                Retour
              </button>

              <button type="submit" :disabled="preferencesStore.isLoading || preferencesStore.totpCode.length !== 6"
                class="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                <IconLoader v-if="preferencesStore.isLoading" class="w-5 h-5 mr-2 animate-spin" />
                <IconCheck v-else class="w-5 h-5 mr-2" />
                {{ preferencesStore.isLoading ? 'Vérification...' : 'Vérifier' }}
              </button>
            </div>

            <div class="text-center">
              <button type="button" @click="handleResendCode" :disabled="preferencesStore.isLoading"
                class="text-primary hover:text-secondary text-sm font-medium disabled:text-gray-400">
                Renvoyer le code
              </button>
            </div>
          </form>
        </div>

        <div v-else-if="preferencesStore.currentStep === 'preferences_form'">
          <div class="flex justify-center items-center mb-4">
            <IconSettings class="w-16 h-16 text-primary mx-auto" />
            <button @click="openInfoModal('preferences')" title="À quoi servent ces préférences ?" type="button"
              class="ml-4 text-primary hover:text-secondary p-2 rounded-full border border-primary hover:border-secondary transition">
              <IconInfoCircle class="w-6 h-6" />
            </button>
          </div>
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Vos préférences</h2>
            <p class="text-gray-600 mb-2">
              Compte associé à :
              <span class="font-medium text-gray-900">{{ preferencesStore.maskedEmail }}</span>
            </p>
          </div>

          <form @submit.prevent="handlePreferencesSubmit" class="space-y-6 mt-8">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input id="firstName" v-model="preferencesStore.firstName" type="text"
                :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                placeholder="Votre prénom" />
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                Nom de famille
              </label>
              <input id="lastName" v-model="preferencesStore.lastName" type="text"
                :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                placeholder="Votre nom" />
            </div>

            <div>
              <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                Entreprise (optionnel)
              </label>
              <input id="company" v-model="preferencesStore.company" type="text" :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                placeholder="Votre entreprise" />
            </div>

            <div>
              <label for="source" class="block text-sm font-medium text-gray-700 mb-2">
                Comment avez-vous découvert SuitOps ?
              </label>
              <select id="source" v-model="preferencesStore.source" :disabled="preferencesStore.isLoading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100">
                <option value="">Sélectionnez une option</option>
                <option value="social">Réseaux sociaux</option>
                <option value="search">Moteur de recherche</option>
                <option value="friend">Recommandation d'un ami</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div class="flex items-center">
              <input id="newsletter" v-model="preferencesStore.newsletter" type="checkbox"
                :disabled="preferencesStore.isLoading"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:bg-gray-100" />
              <label for="newsletter" class="ml-3 block text-sm text-gray-700">
                Je souhaite recevoir la newsletter et les informations sur SuitOps
              </label>
            </div>

            <button type="submit" :disabled="preferencesStore.isLoading"
              class="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
              <IconLoader v-if="preferencesStore.isLoading" class="w-5 h-5 mr-2 animate-spin" />
              <IconDeviceFloppy v-else class="w-5 h-5 mr-2" />
              {{ preferencesStore.isLoading ? 'Mise à jour...' : 'Mettre à jour mes préférences' }}
            </button>
          </form>
        </div>
      </div>

      <div class="text-center mt-8">
        <NuxtLink to="/" class="text-primary hover:text-secondary font-medium flex items-center justify-center">
          <IconHome class="w-5 h-5 mr-2" />
          Retour à l'accueil
        </NuxtLink>
      </div>
    </div>
  </main>

  <transition name="toast-slide">
    <div v-if="preferencesStore.message" :class="[
      'fixed bottom-6 right-6 p-4 rounded-lg shadow-xl border w-full max-w-sm z-50',
      preferencesStore.messageType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
      preferencesStore.messageType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
      'bg-blue-50 border-blue-200 text-blue-800'
    ]">
      <div class="flex items-center">
        <IconCheck v-if="preferencesStore.messageType === 'success'" class="w-5 h-5 mr-2" />
        <IconAlertCircle v-else-if="preferencesStore.messageType === 'error'" class="w-5 h-5 mr-2" />
        <IconInfoCircle v-else class="w-5 h-5 mr-2" />
        <span>{{ preferencesStore.message }}</span>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div v-if="showInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
        <button @click="showInfoModal = false" class="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          <IconX class="h-6 w-6" />
        </button>

        <h3 class="text-xl font-bold mb-4">
          Informations importantes
        </h3>

        <div v-if="currentModalContent === 'totp'">
          <p class="mb-3">
            Pour garantir la sécurité de vos données et vérifier que vous êtes bien le propriétaire de cette adresse e-mail, nous vous demandons de saisir un code de vérification envoyé par e-mail (TOTP).
          </p>
          <p>
            Cela évite que quelqu’un d’autre modifie vos préférences sans votre consentement.
          </p>
        </div>

        <div v-else-if="currentModalContent === 'preferences'">
          <p class="mb-3">
            Vous pouvez ici mettre à jour vos informations personnelles liées à votre inscription à la bêta SuitOps.
          </p>
          <ul class="list-disc pl-5 space-y-1">
            <li><strong>Prénom / Nom :</strong> pour personnaliser nos communications.</li>
            <li><strong>Entreprise :</strong> pour mieux connaître nos utilisateurs professionnels.</li>
            <li><strong>Source :</strong> savoir comment vous avez découvert SuitOps.</li>
            <li><strong>Newsletter :</strong> cochez cette case pour recevoir nos actualités et offres.</li>
          </ul>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePreferencesStore } from '@/stores/preferences'
import {
  IconMail, IconShieldCheck, IconSettings, IconSend, IconCheck, IconArrowLeft, IconLoader, IconDeviceFloppy, IconHome, IconAlertCircle, IconInfoCircle, IconX
} from '@tabler/icons-vue'

const preferencesStore = usePreferencesStore()
const route = useRoute()

const showInfoModal = ref(false)
const currentModalContent = ref('')

// Fonctions pour gérer la modale
const openInfoModal = (type: string) => {
  currentModalContent.value = type
  showInfoModal.value = true
}

const handleEmailSubmit = async () => {
  await preferencesStore.requestTotp(preferencesStore.email)
}

const handleTotpSubmit = async () => {
  await preferencesStore.verifyTotpCode(preferencesStore.email, preferencesStore.totpCode)
}

const handlePreferencesSubmit = async () => {
  await preferencesStore.updatePreferences()
}

const handleBackToEmail = () => {
  preferencesStore.currentStep = 'email_input'
  preferencesStore.totpCode = ''
  preferencesStore.message = ''
}

const handleResendCode = async () => {
  await preferencesStore.requestTotp(preferencesStore.email)
}

onMounted(async () => {
  preferencesStore.resetState()

  const mailhash = route.query.mailhash as string

  if (mailhash) {
    await preferencesStore.verifyLink(mailhash)
  } else {
    preferencesStore.currentStep = 'email_input'
  }
})

// SEO
useHead({
  title: 'Gestion des Préférences',
})
</script>

<style scoped>
/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Transitions pour la modale */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transitions pour les notifications flottantes */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>