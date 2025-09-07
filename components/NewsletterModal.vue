<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg w-full max-w-sm sm:max-w-md p-6 relative m-4 md:m-auto">
      <h2 class="text-2xl font-bold mb-4 text-center sm:text-left">Restez informé !</h2>
      <p class="text-gray-600 mb-6 text-center sm:text-left">Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités.</p>
      
      <form @submit.prevent="subscribe" class="space-y-4">
        <input
          type="text"
          v-model="firstName"
          placeholder="Votre prénom"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
        <input
          type="text"
          v-model="lastName"
          placeholder="Votre nom"
          class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          required
        />
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
      
      <div class="mt-4 flex flex-col sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0">
        <button
          @click="remindLater"
          class="text-gray-600 hover:text-gray-800 text-center sm:text-left"
        >
          Me le rappeler plus tard
        </button>
        <button
          @click="closeForever"
          class="text-gray-600 hover:text-gray-800 text-center sm:text-right"
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
import { ref, onMounted } from 'vue';

const showModal = ref(false)
const email = ref('')
const firstName = ref('')
const lastName = ref('')

const subscribe = () => {
  console.log('Subscribing with:', {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value
  });
  showModal.value = false
  email.value = ''
  firstName.value = ''
  lastName.value = ''
}

const remindLater = () => {
  showModal.value = false
  setTimeout(() => {
    showModal.value = true
  }, 24 * 60 * 60 * 1000)
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
