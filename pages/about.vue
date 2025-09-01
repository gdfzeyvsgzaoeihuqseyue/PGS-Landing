<template>
  <main>
    <!-- Hero Section -->
    <header class="text-center mb-12 py-6 mt-8">
      <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">À propos</span> de PGS SARL
      </h1>
      <p class="mt-4 text-xl max-w-2xl mx-auto">
        Votre partenaire de confiance dans la transformation numérique des entreprises africaines
      </p>
    </header>

    <!-- Notre histoire -->
    <section id="about" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="leading-relaxed">
          <h2 class="text-3xl font-bold mb-6">Notre histoire</h2>

          <p class="mb-6 leading-relaxed">
            Nous sommes une entreprise technologique africaine qui développe des solutions numériques 
            innovantes pour accompagner la transformation digitale des PME sur le continent.
          </p>
          
          <p class="mb-8 leading-relaxed">
            Notre mission est de démocratiser l'accès aux outils de gestion professionnels en proposant 
            des solutions adaptées aux réalités économiques et culturelles de l'Afrique. Nous croyons 
            en un écosystème numérique inclusif qui permet à chaque entrepreneur de réussir.
          </p>

          <div class="flex flex-wrap gap-4">
            <div class="flex items-center">
              <IconCheck class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-gray-700">Solutions adaptées au marché africain</span>
            </div>
            <div class="flex items-center">
              <IconCheck class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-gray-700">Support en langues locales</span>
            </div>
            <div class="flex items-center">
              <IconCheck class="w-5 h-5 text-green-500 mr-2" />
              <span class="text-gray-700">Paiements mobiles intégrés</span>
            </div>
          </div>
        </div>

        <div class="relative">
          <img 
            :src="sharedFiles.paths.page.aboutPicture" 
            alt="Équipe PRO GESTION SOFT" 
            class="rounded-2xl shadow-2xl w-full h-96 object-cover"
          />
          <div class="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-lg">
            <div class="text-2xl font-bold">2021</div>
            <div class="text-sm opacity-90">Année de création</div>
          </div>
        </div>
      </div>
    </div>
  </section>

    <!-- Nos valeurs -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Nos Valeurs</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(value, index) in values" :key="index" class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <component :is="value.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Notre équipe -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Des experts passionnés qui travaillent chaque jour pour créer les meilleures solutions pour nos clients.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(member, index) in team" :key="index" class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
              <img :src="member.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.name"
                :alt="member.name" class="w-full h-full object-cover" @error="handleImageError">
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ member.name }}</h3>
            <p class="text-primary mb-2">{{ member.role }}</p>
            <p class="text-gray-600">{{ member.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Contactez-nous</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Vous souhaitez en savoir plus sur nos solutions ? Notre équipe est là pour vous accompagner.
        </p>
        <NuxtLink to="/contact"
          class="bg-primary text-white px-8 py-4 rounded-lg hover:bg-secondary transition-colors inline-flex items-center space-x-2"
        >
          <span>Nous contacter</span>
          <IconBrandLine class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
  </main>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { IconCheck, IconBolt, IconMessages, IconShieldStar, IconWorldStar, IconBrandLine } from '@tabler/icons-vue'
import { useSharedFiles } from '~/stores/sharedFiles';

const sharedFiles = useSharedFiles();

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  const name = target.alt || 'Photo'
  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
}

const values = [
  { 
    title: 'Innovation',
    description: 'Nous repoussons constamment les limites pour créer des solutions innovantes.',
    icon: IconBolt 
  },
  { 
    title: 'Engagement',
    description: 'Un accompagnement personnalisé pour la réussite de nos clients.',
    icon: IconMessages 
  },
  { 
    title: 'Intégrité',
    description: 'Transparence et éthique dans toutes nos actions.',
    icon: IconShieldStar 
  },
  { 
    title: 'Impact',
    description: 'Contribuer au développement numérique de l\'Afrique.',
    icon: IconWorldStar 
  }
]

const team = [
  { 
    name: 'Steve Aster Afovo',
    role: 'RR&D & CEO',
    description: 'Financier comptable, Développeur front end et designer graphique.',
    image:  sharedFiles.paths.team.SteveAster,
  },
  { 
    name: 'Ulrich Marcias Lalèyè',
    role: 'Dir. Ventes/Marketing',
    description: 'Technicien commercial, spécialiste marketing et communication.',
    image: sharedFiles.paths.team.Marcias,
  },
  { 
    name: 'Delluc Dotou Hounmenou',
    role: 'Dir. Financier',
    description: 'Comptable, consultant et gestionnaire de projet.',
    image: sharedFiles.paths.team.Delluc,
  },
  { 
    name: 'Charmaine Aurette YEDABO',
    role: 'Ingénieur Système',
    description: 'Développeur logiciel, architecture système et technologies web.',
    image: sharedFiles.paths.team.Charmaine,
  }
]
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
