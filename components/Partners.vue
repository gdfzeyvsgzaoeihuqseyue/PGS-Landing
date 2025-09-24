<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
      <p class="text-base text-gray-600 md:text-lg">
        Des entreprises leaders qui transforment l'Afrique avec nos solutions
      </p>
    </div>

    <!-- Chargement / Erreur -->
    <div v-if="partnerStore.loading" class="text-center py-10">
      <IconLoader class="animate-spin h-10 w-10 text-primary mx-auto" />
      <p class="mt-2 text-gray-600">Chargement des partenaires...</p>
    </div>
    <div v-else-if="partnerStore.error" class="text-center py-10 text-red-500">
      <p>Erreur: {{ partnerStore.error }}</p>
    </div>
    <div v-else-if="randomPartners.length > 0" class="flex flex-wrap justify-center gap-8 mb-16">
      <div
        v-for="partner in randomPartners"
        :key="partner.id"
        :title="partner.name"
        class="flex-none p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow filter grayscale hover:grayscale-0"
      >
        <img
          :src="partner.logo"
          :alt="partner.name"
          class="h-12 w-auto transition duration-500 ease-in-out"
          @error="handleImageError($event, partner.name)"
        />
      </div>
    </div>
    <div v-else class="text-center py-10 text-gray-500">
      <p>Aucun partenaire à afficher pour le moment.</p>
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

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { IconQuote, IconLoader } from '@tabler/icons-vue'
import { usePartnerStore } from '@/stores/partners';
import type { Partner } from '@/types';

const partnerStore = usePartnerStore();

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

// Fonction pour mélanger un tableau
const shuffleArray = (array: Partner[]): Partner[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Crée une liste de partenaires uniques basée sur leur nom
const uniquePartners = computed<Partner[]>(() => {
  const seenNames = new Set<string>();
  const unique: Partner[] = [];
  for (const partner of partnerStore.partners) {
    const normalizedName = partner.name.trim().toLowerCase();
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      unique.push(partner);
    }
  }
  return unique;
});

// Sélectionne 4 partenaires aléatoires parmi les uniques
const randomPartners = computed<Partner[]>(() => {
  if (uniquePartners.value.length === 0) {
    return [];
  }
  return shuffleArray(uniquePartners.value).slice(0, 6);
});

// Gère les erreurs de chargement d'image
const handleImageError = (event: Event, partnerName: string) => {
  const target = event.target as HTMLImageElement;
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(partnerName)}`;
  target.alt = `Logo de ${partnerName} non disponible`;
};

onMounted(() => {
  partnerStore.fetchPartners(1, 100, true); 
});
</script>
