<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg max-w-md w-full p-6">
      <h2 class="text-2xl font-bold mb-4">Restez informé !</h2>
      <p class="text-gray-600 mb-6">Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités.</p>
      <form @submit.prevent="subscribe" class="space-y-4">
        <input 
          type="email" 
          v-model="email"
          placeholder="Votre adresse email"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
        <button 
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-colors"
        >
          S'inscrire
        </button>
      </form>
      <div class="mt-4 flex justify-between">
        <button 
          @click="remindLater"
          class="text-gray-600 hover:text-gray-800"
        >
          Me le rappeler plus tard
        </button>
        <button 
          @click="closeForever"
          class="text-gray-600 hover:text-gray-800"
        >
          Ne plus afficher
        </button>
      </div>
      <button 
        @click="closeForever"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <span class="sr-only">Fermer</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const showModal = ref(false)
const email = ref('')

const subscribe = () => {
  // TODO: Implémenter la logique d'inscription
  showModal.value = false
  email.value = ''
}

const remindLater = () => {
  showModal.value = false
  setTimeout(() => {
    showModal.value = true
  }, 24 * 60 * 60 * 1000) // Rappel dans 24h
}

const closeForever = () => {
  showModal.value = false
  localStorage.setItem('newsletter-closed', 'true')
}

onMounted(() => {
  const isClosed = localStorage.getItem('newsletter-closed')
  if (!isClosed) {
    setTimeout(() => {
      showModal.value = true
    }, 5000)
  }
})
</script>