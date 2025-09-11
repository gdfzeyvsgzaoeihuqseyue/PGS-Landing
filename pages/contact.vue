<template>
  <main>
    <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">Contactez</span>-nous
      </h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Contactez-nous pour plus d'assistance.
      </p>
    </header>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Formulaire de contact -->
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
          <form @submit.prevent="submitForm" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nom complet</label>
              <input type="text" id="name" v-model="form.fullname"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="form.emailAddress"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required />
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700">Sujet</label>
              <select id="subject" v-model="form.object"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required>
                <option value="">Sélectionnez un sujet</option>
                <option value="demo">Demande de démonstration</option>
                <option value="devis">Demande de devis</option>
                <option value="support">Support technique</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" v-model="form.message" rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required></textarea>
            </div>

            <button type="submit"
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:cursor-not-allowed"
              :disabled="isSubmitting">
              <div class="flex items-center justify-center gap-2">
                <template v-if="!isSubmitting">
                  Envoyer
                  <IconSend class="w-5 h-5" />
                </template>
                <template v-else>
                  Envoie en cours...
                  <IconLoader class="w-5 h-5 animate-spin" />
                </template>
              </div>
            </button>
          </form>

          <p v-if="message"
            :class="['fixed bottom-4 right-4 z-50 p-3 text-sm rounded-lg shadow-lg transition-opacity', messageClass]">
            {{ message }}
          </p>
        </div>

        <!-- Informations de contact -->
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-6">Nos coordonnées</h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <IconMail class="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 class="font-semibold mb-1">Email</h3>
                  <a href="mailto:contact@progestionsoft.com" class="text-primary hover:text-secondary">
                    contact@progestionsoft.com
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <IconPhone class="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 class="font-semibold mb-1">Téléphone</h3>
                  <a href="tel:+2290152535380" class="text-primary hover:text-secondary">
                    +229 01 52535380
                  </a>
                </div>
              </div>

              <div class="flex items-start">
                <IconMapPin class="h-6 w-6 text-primary mr-3 mt-1" />
                <div>
                  <h3 class="font-semibold mb-1">Adresse</h3>
                  <p class="text-primary">Tanmè, Adjarra<br />République du Bénin</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white p-8 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-6">Horaires d'ouverture</h2>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h00 - 18h00</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Samedi - Dimanche</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Google Maps -->
    <section class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <div class="bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6">Où nous trouver</h2>
        <div class="aspect-w-16 aspect-h-9">
          <iframe
            src="https://maps.google.com/maps?q=PRO%20GESTION%20SOFT%2C%20Tanm%C3%A8%2C%20Adjarra%2C%20B%C3%A9nin&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <p class="text-sm text-gray-500 mt-4 text-center">
          La carte ci-dessus indique notre emplacement général. Pour un itinéraire précis, veuillez utiliser
          l'application
          Google Maps.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { IconMapPin, IconMail, IconPhone, IconSend, IconLoader } from '@tabler/icons-vue';

const form = ref({
  fullname: '',
  emailAddress: '',
  object: '',
  message: ''
})

const isSubmitting = ref(false)
const message = ref('')
const messageClass = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  message.value = ''

  try {
    const response = await sendMessage(
      form.value.fullname,
      form.value.emailAddress,
      form.value.object,
      form.value.message
    )

    message.value = "Message envoyé avec succès";
    messageClass.value = 'bg-green-100 text-green-700'

    // Réinitialisation du formulaire
    form.value = {
      fullname: '',
      emailAddress: '',
      object: '',
      message: ''
    }

  } catch (error) {
    console.error('Erreur d\'envoi:', error)
    message.value = "Message non envoyé";
    messageClass.value = 'bg-red-100 text-red-700'
  } finally {
    isSubmitting.value = false
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}

useHead({
  title: "Contact"
})
</script>
