<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">Communauté & Impact</h2>
      <p class="text-xl text-blue-100 max-w-3xl mx-auto">
        Ensemble, nous transformons le paysage entrepreneurial africain
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      <div v-for="stat in stats" :key="stat.label" class="text-center">
        <div class="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">{{ stat.value }}</div>
        <div class="text-blue-100">{{ stat.label }}</div>
      </div>
    </div>

    <div class="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <IconUsers class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold mb-2">Communauté Active</h3>
          <p class="text-blue-100">
            Rejoignez des milliers d'entrepreneurs qui partagent leurs expériences et s'entraident.
          </p>
        </div>

        <div class="text-center">
          <IconSchool class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold mb-2">Formation Continue</h3>
          <p class="text-blue-100">
            Accédez à des formations exclusives et webinaires pour développer vos compétences.
          </p>
        </div>

        <div class="text-center">
          <IconHeartHandshake class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold mb-2">Support Dédié</h3>
          <p class="text-blue-100">
            Bénéficiez d'un accompagnement personnalisé pour maximiser votre potentiel.
          </p>
        </div>
      </div>

      <div class="text-center mt-8">
        <button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 bg-accent-500 hover:bg-yellow-600 text-gray-900">
          <IconArrowRight class="mr-2 h-5 w-5" />
          Rejoindre la communauté
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconUsers, IconSchool, IconHeartHandshake, IconArrowRight } from '@tabler/icons-vue'

const stats = [
  { value: '2,500+', label: 'Utilisateurs actifs' },
  { value: '150+', label: 'Modules créés' },
  { value: '15', label: 'Pays actifs' },
  { value: '98%', label: 'Taux de réussite' }
]
</script>