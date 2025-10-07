<template>
  <div v-if="
    (randomPartners.length > 0 || randomTestimonies.length > 0) &&
    !partnerStore.loading &&
    !testimonyStore.loading
  " class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">Ils nous font confiance</h2>
      <p class="text-base text-gray-600 md:text-lg">
        Des entreprises leaders qui transforment l'Afrique avec nos solutions
      </p>
    </div>

    <!-- Indicateur de chargement -->
    <div v-if="partnerStore.loading || testimonyStore.loading" class="text-center py-10">
      <IconLoader class="animate-spin h-8 w-8 text-primary mx-auto" />
      <p class="mt-2 text-gray-600">Chargement des partenaires et témoignages...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="partnerStore.error || testimonyStore.error" class="text-center py-10 text-red-500">
      <p>Erreur lors du chargement : {{ partnerStore.error || testimonyStore.error }}</p>
    </div>

    <!-- Partenaires -->
    <div v-else-if="randomPartners.length > 0 || randomTestimonies.length > 0">
      <div v-if="randomPartners.length > 0" class="flex flex-wrap justify-center gap-8 mb-16">
        <div v-for="partner in randomPartners" :key="partner.id" :title="partner.name"
          class="flex-none p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow filter grayscale hover:grayscale-0">
          <img :src="partner.logo" :alt="partner.name" class="h-12 w-auto transition duration-500 ease-in-out"
            @error="handleImageError($event, partner.name)" />
        </div>
      </div>

       <!-- Témoignages -->
      <div v-if="randomTestimonies.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="testimonial in randomTestimonies" :key="testimonial.id" :class="[
          'p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out',
          testimonial.isFeatured
            ? 'bg-blue-50 border-2 border-blue-500 shadow-xl scale-[1.02]'
            : 'bg-white',
        ]">
          <div v-if="testimonial.platform" class="mb-2">
            <span class="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ testimonial.platform.name }}
            </span>
          </div>

          <div class="flex items-start mb-4">
            <IconQuote class="h-8 w-8 text-blue-600 mr-3 flex-shrink-0" />
            <p class="text-base text-gray-700 italic md:text-lg">{{ testimonial.content }}</p>
          </div>

          <div v-if="testimonial.note && testimonial.note >= 0 && testimonial.note <= 5" class="flex items-center mb-4">
            <template v-for="n in 5" :key="n">
              <IconStarFilled v-if="n <= Math.floor(testimonial.note)" class="h-5 w-5 text-yellow-400" />
              <IconStarHalfFilled v-else-if="n - 0.5 === testimonial.note" class="h-5 w-5 text-yellow-400" />
              <IconStar v-else class="h-5 w-5 text-gray-300" />
            </template>
          </div>

          <div class="flex items-center mt-6">
            <div class="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
              <img :src="testimonial.avatar ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                  testimonial.author,
                )}`
                " :alt="testimonial.author" class="w-full h-full object-cover" />
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
    <!-- Message d'absence -->
    <div v-else class="text-center py-10 text-gray-500">
      <p>Aucun partenaire ou témoignage à afficher pour le moment.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { IconQuote, IconStar, IconStarFilled, IconStarHalfFilled, IconLoader } from '@tabler/icons-vue'
import { usePartnerStore } from '@/stores/partners'
import { useTestimonyStore } from '@/stores/testimonies'
import type { Partner, Testimony } from '@/types'

const partnerStore = usePartnerStore()
const testimonyStore = useTestimonyStore()

// Fonction pour mélanger un tableau
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Liste de partenaires uniques
const uniquePartners = computed<Partner[]>(() => {
  const seenNames = new Set<string>()
  const unique: Partner[] = []
  for (const partner of partnerStore.partners) {
    const normalizedName = partner.name.trim().toLowerCase()
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName)
      unique.push(partner)
    }
  }
  return unique
})

// Sélectionne 6 partenaires aléatoires
const randomPartners = computed<Partner[]>(() => {
  if (uniquePartners.value.length === 0) {
    return []
  }
  return shuffleArray(uniquePartners.value).slice(0, 6)
})

// Erreurs de chargement d'image pour les partenaires
const handleImageError = (event: Event, partnerName: string) => {
  const target = event.target as HTMLImageElement
  target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    partnerName,
  )}`
  target.alt = `Logo de ${partnerName} non disponible`
}

// Logique révisée pour les témoignages
const randomTestimonies = computed<Testimony[]>(() => {
  const allPublishedTestimonies = testimonyStore.testimonies.filter(t => t.isPublished);
  if (allPublishedTestimonies.length === 0) {
    return [];
  }

  const featured = allPublishedTestimonies.filter(t => t.isFeatured);
  const nonFeatured = allPublishedTestimonies.filter(t => !t.isFeatured);

  const selected: Testimony[] = [];
  const countToSelect = 4;

  // 1. Ajouter tous les témoignages "featured" disponibles, jusqu'à la limite
  for (let i = 0; i < featured.length && selected.length < countToSelect; i++) {
    selected.push(featured[i]);
  }

  // 2. Si la limite n'est pas atteinte, ajouter des témoignages "non-featured" aléatoirement
  if (selected.length < countToSelect) {
    const remainingSlots = countToSelect - selected.length;
    const shuffledNonFeatured = shuffleArray(nonFeatured);

    for (let i = 0; i < remainingSlots && i < shuffledNonFeatured.length; i++) {
      selected.push(shuffledNonFeatured[i]);
    }
  }

  // 3. Mélanger le résultat final pour une présentation dynamique
  return shuffleArray(selected);
});

onMounted(async () => {
  await partnerStore.fetchPartners(1, 100, true, false)
  await testimonyStore.fetchTestimonies(1, 100, true, true, null, false)
})
</script>
