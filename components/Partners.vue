<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
      <p class="text-base text-gray-600 md:text-lg">
        Des entreprises leaders qui transforment l'Afrique avec nos solutions
      </p>
    </div>

    <!-- Partenaires -->
    <div class="flex flex-wrap justify-center gap-8 mb-16">
      <div
        v-for="partner in partners"
        :key="partner.id"
        :title="partner.name"
        class="flex-none p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow filter grayscale hover:grayscale-0"
      >
        <img
          :src="partner.logo"
          :alt="partner.name"
          class="h-12 w-auto transition duration-500 ease-in-out"
        />
      </div>
    </div>

    <!-- Témoignages -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div
        v-for="testimonial in testimonials"
        :key="testimonial.author"
        class="bg-white p-8 rounded-xl shadow-lg"
      >
        <div class="flex items-start mb-4">
          <IconQuote class="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
          <p class="text-base text-gray-700 italic md:text-lg">{{ testimonial.quote }}</p>
        </div>
        <div class="flex items-center mt-6">
          <div class="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <img :src="testimonial.image" :alt="testimonial.author" class="w-full h-full object-cover" />
          </div>
          <div>
            <div class="font-bold text-gray-900">{{ testimonial.author }}</div>
            <div class="text-gray-600 text-sm">{{ testimonial.role }}</div>
            <div class="text-blue-600 text-sm">{{ testimonial.company }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconQuote } from '@tabler/icons-vue'

const partners = [
  {
    id: 1,
    name: 'Cabinet HODD',
    logo: 'https://lh3.googleusercontent.com/a-/ALV-UjXzZxkRKtHxPSuGbCFhTykXq_X290TXbkrEDAjpRFFDwUZZIKI=s265-w265-h265'
  },
  {
    id: 2,
    name: 'STAF PRINT CENTER',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtDgYOXv2wJ4yuEw-xjGxv6zUW73N49xAlZw'
  }
]

const testimonials = [
  {
    quote: "PGS nous a aidés à optimiser notre suivi des ventes et des achats. Grâce aux rapports automatiques et à la facturation centralisée, nous avons augmenté nos revenus de 15 % en seulement six mois.",
    author: "Archimède Codjovi",
    role: "Responsable des Ventes",
    company: "Univers Plus",
    image: "https://api.pgs.ctrlengine.com/api/v1/superadmin/document/SBaxuhjp8LK"
  },
  {
    quote: "La fonctionnalité de recrutement de PGS a complètement transformé notre processus. Publier des offres, organiser des tests en ligne et suivre les candidatures n’a jamais été aussi simple. Nous attirons maintenant des talents plus rapidement.",
    author: "Raymondo Pironio",
    role: "Fondateur",
    company: "Wood Picture",
    image: "https://api.pgs.ctrlengine.com/api/v1/superadmin/document/gwCDpeZr8cy"
  }
]
</script>