<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div class="mb-8">
      <IconMail class="h-16 w-16 text-blue-400 mx-auto mb-6" />
      <h2 class="text-4xl font-bold mb-4">Restez informé</h2>
      <p class="text-xl text-gray-300">
        Recevez les dernières actualités, conseils et mises à jour de nos produits directement dans votre boîte mail.
      </p>
    </div>

    <form @submit.prevent="submitNewsletter" class="max-w-md mx-auto">
      <div class="flex flex-col sm:flex-row gap-4">
        <input v-model="email" type="email" placeholder="Votre adresse email" required
          class="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <button type="submit" :disabled="isSubmitting"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 bg-blue-600 hover:bg-blue-700 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed">
          <IconSend class="mr-2 h-5 w-5" />
          {{ isSubmitting ? 'En cours...' : 'S\'abonner' }}
        </button>
      </div>
    </form>

    <p class="text-sm text-gray-400 mt-4">
      En vous abonnant, vous acceptez de recevoir nos communications marketing.
      Vous pouvez vous <NuxtLink to="/preferences" class="hover:underline text-warning">désabonner</NuxtLink> à tout moment.
    </p>

    <!-- Message de succès -->
    <div v-if="showSuccess" class="mt-6 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg">
      <div class="flex items-center justify-center">
        <IconCheck class="h-5 w-5 text-green-400 mr-2" />
        <span class="text-green-400">Merci ! Votre inscription a été confirmée.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconMail, IconSend, IconCheck } from '@tabler/icons-vue'

const email = ref('')
const isSubmitting = ref(false)
const showSuccess = ref(false)

const submitNewsletter = async () => {
  if (!email.value) return

  isSubmitting.value = true

  // Simulation d'un appel API
  setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
    email.value = ''

    // Masquer le message de succès après 5 secondes
    setTimeout(() => {
      showSuccess.value = false
    }, 5000)
  }, 1000)
}
</script>