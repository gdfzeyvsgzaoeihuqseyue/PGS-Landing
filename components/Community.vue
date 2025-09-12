<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold mb-4">Communauté & Impact</h2>
      <p class="text-lg text-blue-100 max-w-3xl mx-auto md:text-xl">
        Ensemble, nous transformons le paysage entrepreneurial africain
      </p>
    </div>

    <div class="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <IconUsers class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-lg font-bold mb-2 md:text-xl">Communauté Active</h3>
          <p class="text-sm text-blue-100 md:text-base">
            Rejoignez des milliers d'entrepreneurs qui partagent leurs expériences et s'entraident.
          </p>
        </div>

        <div class="text-center">
          <IconSchool class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-lg font-bold mb-2 md:text-xl">Formation Continue</h3>
          <p class="text-sm text-blue-100 md:text-base">
            Accédez à des formations exclusives et webinaires pour développer vos compétences.
          </p>
        </div>

        <div class="text-center">
          <IconHeartHandshake class="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 class="text-lg font-bold mb-2 md:text-xl">Support Dédié</h3>
          <p class="text-sm text-blue-100 md:text-base">
            Bénéficiez d'un accompagnement personnalisé pour maximiser votre potentiel.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconUsers, IconSchool, IconHeartHandshake, IconArrowRight } from '@tabler/icons-vue'
</script>
