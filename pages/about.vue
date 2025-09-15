<template>
  <main>
    <header class="text-center mb-8 sm:mb-12 py-6 mt-6 sm:mt-8">
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
        <span class="text-primary">À propos</span> de PGS SARL
      </h1>
      <p class="mt-2 sm:mt-4 text-base sm:text-xl max-w-2xl mx-auto">
        Votre partenaire de confiance dans la transformation numérique des entreprises africaines
      </p>
    </header>

    <section id="about" class="py-12 sm:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col-reverse lg:flex-row gap-8 sm:gap-12 items-center">
          <div class="leading-relaxed">
            <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Notre histoire</h2>

            <p class="mb-4 sm:mb-6 leading-relaxed text-base sm:text-lg">
              Nous sommes une entreprise technologique africaine qui développe des solutions numériques
              innovantes pour accompagner la transformation digitale des PME sur le continent.
            </p>

            <p class="mb-6 sm:mb-8 leading-relaxed text-base sm:text-lg">
              Notre mission est de démocratiser l'accès aux outils de gestion professionnels en proposant
              des solutions adaptées aux réalités économiques et culturelles de l'Afrique. Nous croyons
              en un écosystème numérique inclusif qui permet à chaque entrepreneur de réussir.
            </p>

            <div class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
              <div class="flex items-center">
                <IconCheck class="w-5 h-5 text-green-500 mr-2" />
                <span class="text-gray-700 text-sm sm:text-base">Solutions adaptées au marché africain</span>
              </div>
              <div class="flex items-center">
                <IconCheck class="w-5 h-5 text-green-500 mr-2" />
                <span class="text-gray-700 text-sm sm:text-base">Support en langues locales</span>
              </div>
              <div class="flex items-center">
                <IconCheck class="w-5 h-5 text-green-500 mr-2" />
                <span class="text-gray-700 text-sm sm:text-base">Paiements mobiles intégrés</span>
              </div>
            </div>
          </div>

          <div class="relative mt-4 sm:mt-0">
            <img
              :src="sharedFiles.paths.page.aboutPicture"
              alt="Équipe PRO GESTION SOFT"
              class="rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
            <div class="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-primary text-white p-4 sm:p-6 rounded-xl shadow-lg hidden sm:block">
              <div class="text-lg sm:text-2xl font-bold">2021</div>
              <div class="text-xs sm:text-sm opacity-90">Année de création</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">Nos Valeurs</h2>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div v-for="(value, index) in values" :key="index"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <component :is="value.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">{{ value.title }}</h3>
            <p class="text-gray-600 text-sm sm:text-base">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Notre Équipe</h2>
          <p class="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Des experts passionnés qui travaillent chaque jour pour créer les meilleures solutions pour nos clients.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div v-for="(member, index) in team" :key="index"
            class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
            <div class="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden">
              <img :src="member.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + member.name"
                :alt="member.name" class="w-full h-full object-cover" @error="handleImageError">
            </div>
            <h3 class="text-lg sm:text-xl font-semibold mb-2">{{ member.name }}</h3>
            <p class="text-primary text-sm sm:text-base mb-2">{{ member.role }}</p>
            <div class="mb-4 flex justify-center space-x-4">
              <a v-if="member.socials.linkedin" :href="member.socials.linkedin" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary transition-colors">
                <IconBrandLinkedin class="w-5 h-5" />
              </a>
              <a v-if="member.socials.twitter" :href="member.socials.twitter" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary transition-colors">
                <IconBrandTwitter class="w-5 h-5" />
              </a>
              <a v-if="member.socials.facebook" :href="member.socials.facebook" target="_blank" rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary transition-colors">
                <IconBrandFacebook class="w-5 h-5" />
              </a>
            </div>
            <p class="text-gray-600 text-sm sm:text-base">{{ member.description }}</p>            
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Contactez-nous</h2>
        <p class="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Vous souhaitez en savoir plus sur nos solutions ? Notre équipe est là pour vous accompagner.
        </p>
        <NuxtLink to="/contact"
          class="bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-secondary transition-colors inline-flex items-center space-x-2">
          <span>Nous contacter</span>
          <IconBrandLine class="w-5 h-5" />
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconCheck, IconBolt, IconMessages, IconShieldStar, IconWorldStar, IconBrandLine, IconBrandLinkedin, IconBrandTwitter, IconBrandFacebook } from '@tabler/icons-vue'
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
    image: sharedFiles.paths.team.SteveAster,
    socials: {
      linkedin: 'https://www.linkedin.com/in/SteveAsterAfovo',
      twitter: 'https://x.com/SteveAsterAfovo',
      facebook: 'https://www.facebook.com/SteveAsterAfovo.1'
    }
  },
  {
    name: 'Ulrich Marcias Lalèyè',
    role: 'Dir. Ventes/Marketing',
    description: 'Technicien commercial, spécialiste marketing et communication.',
    image: sharedFiles.paths.team.Marcias,
    socials: {
      linkedin: 'https://www.linkedin.com/in/a-ulrich-marcias-laleye-1a91191b3/',
      twitter: null,
      facebook: 'https://www.facebook.com/marcias.mclaleye'
    }
  },
  {
    name: 'Delluc Dotou Hounmenou',
    role: 'Dir. Financier',
    description: 'Comptable, consultant et gestionnaire de projet.',
    image: sharedFiles.paths.team.Delluc,
    socials: {
      linkedin: 'https://www.linkedin.com/in/delluc-dotou-hounmenou-a39795227/',
      twitter: null,
      facebook: 'https://www.facebook.com/profile.php?id=61577156683888'
    }
  },
  {
    name: 'Charmaine A. Yedabo',
    role: 'Ingénieur Système',
    description: 'Développeur logiciel, architecture système et technologies web.',
    image: sharedFiles.paths.team.Charmaine,
    socials: {
      linkedin: null,
      twitter: null,
      facebook: 'https://www.facebook.com/yeb.charme'
    }
  }
]

useHead({
  title: 'A propos',
})
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
