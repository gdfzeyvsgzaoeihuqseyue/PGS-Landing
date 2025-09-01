<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
      <p class="text-lg text-gray-600">
        Des entreprises leaders qui transforment l'Afrique avec nos solutions
      </p>
    </div>

    <!-- Logos des partenaires -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
      <div
        v-for="partner in partners"
        :key="partner.id"
        :title="partner.name"
        class="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <img
          :src="partner.logo"
          :alt="partner.name"
          class="h-12 filter grayscale hover:grayscale-0 transition duration-500 ease-in-out"
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
          <p class="text-gray-700 italic text-lg">{{ testimonial.quote }}</p>
        </div>
        <div class="flex items-center mt-6">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <IconUser class="h-6 w-6 text-blue-600" />
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
import { IconQuote, IconUser } from '@tabler/icons-vue'

const partners = [
  {
    id: 1,
    name: 'MTN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.jpg/640px-New-mtn-logo.jpg'
  },
  {
    id: 2,
    name: 'Celtiis',
    logo: 'https://pbs.twimg.com/profile_images/1583478753627365376/-Su4Yn3M_400x400.jpg'
  },
  {
    id: 3,
    name: 'Moov',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbolKY35j83WM75fplZkiT69ll7P6_YWLQTQ&s'
  },
  {
    id: 4,
    name: 'Ministère',
    logo: 'https://www.gouv.bj/images/armoiries.jpg'
  }
]

const testimonials = [
  {
    quote: "SuitOps a révolutionné notre gestion quotidienne. Nous avons gagné 40% de temps sur nos processus administratifs et nos équipes sont plus productives que jamais.",
    author: "Marie Kouassi",
    role: "Directrice Générale",
    company: "EcoTrade Côte d'Ivoire"
  },
  {
    quote: "Grâce à Store, nous avons lancé notre boutique en ligne en moins d'une semaine. Nos ventes ont augmenté de 200% en 3 mois. Un investissement qui change tout !",
    author: "Amadou Diallo",
    role: "Fondateur",
    company: "Artisanat Sahel"
  }
]
</script>