<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
       <header class="text-center mb-12 py-6 mt-8">
        <h1 class="text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Mentions</span> Légales
        </h1>
        <p class="mt-4 text-xl max-w-2xl mx-auto">
          Transparence et conformité : retrouvez ici toutes les informations légales concernant PRO GESTION SOFT (PGS)
        </p>
      </header>

      <section class="bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16 animate-fade-in-delay">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <div class="flex items-center text-primary mb-4">
              <IconBuildingSkyscraper class="w-8 h-8 mr-3" />
              <h2 class="text-3xl font-bold">Qui sommes-nous ?</h2>
            </div>
            <p class="text-gray-700 leading-relaxed text-lg">
              PRO GESTION SOFT est une entreprise technologique béninoise, spécialisée dans le développement de solutions numériques innovantes pour accompagner les Petites et Moyennes Entreprises (PME) africaines dans leur transformation digitale.
            </p>
          </div>

          <div>
            <div class="flex items-center text-primary mb-4">
              <IconInfoCircle class="w-8 h-8 mr-3" />
              <h2 class="text-3xl font-bold">Informations Générales</h2>
            </div>
            <ul class="space-y-4 text-lg">
              <li>
                <span class="font-semibold">Dénomination sociale :</span> PRO GESTION SOFT (PGS)
              </li>
              <li>
                <span class="font-semibold">Forme juridique :</span> Société A Responsabilité Limitée (SARL)
              </li>
              <li>
                <span class="font-semibold">Siège social :</span> Bénin
              </li>
              <li>
                <span class="font-semibold">RCCM :</span> xxxx
              </li>
              <li>
                <span class="font-semibold">IFU :</span> xxxx
              </li>
              <li>
                <span class="font-semibold">E-mail :</span> <a href="mailto:progestionsoft@gmail.com" class="text-primary hover:underline">progestionsoft@gmail.com</a>
              </li>
              <li>
                <span class="font-semibold text-gray-800">Téléphone :</span> <a href="tel:2290152535380" class="text-primary hover:underline">229 0152535380</a>
              </li>
              <li>
                <span class="font-semibold">Directeur de la publication :</span> Responsable Recherche et Developpement
              </li>
            </ul>
          </div>

          <div>
            <div class="flex items-center text-primary mb-4">
              <IconServer class="w-8 h-8 mr-3" />
              <h2 class="text-3xl font-bold">Hébergement</h2>
            </div>
            <ul class="space-y-4 text-lg">
              <li>
                <span class="font-semibold">Nom de l'hébergeur :</span> [Veuillez insérer le nom de l'hébergeur]
              </li>
              <li>
                <span class="font-semibold">Adresse de l'hébergeur :</span> [Veuillez insérer l'adresse de l'hébergeur]
              </li>
              <li>
                <span class="font-semibold">Contact hébergeur :</span> [Veuillez insérer le contact de l'hébergeur (téléphone, e-mail)]
              </li>
            </ul>
          </div>

          <div>
            <div class="flex items-center text-primary mb-4">
              <IconCopyright class="w-8 h-8 mr-3" />
              <h2 class="text-3xl font-bold">Propriété Intellectuelle</h2>
            </div>
            <p class="leading-relaxed text-lg">
              L'ensemble des éléments présents sur ce site (textes, images, logos, icônes, sons, logiciels, structures de données, etc.) sont la
              propriété exclusive de PRO GESTION SOFT (PGS), sauf mention contraire.
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le
              moyen ou le procédé utilisé, est strictement interdite, sauf autorisation écrite préalable de PGS.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  IconBuildingSkyscraper,
  IconInfoCircle,
  IconServer,
  IconCopyright
} from '@tabler/icons-vue';

useHead({
  title: 'Mentions Légales - PRO GESTION SOFT',
  meta: [
    { name: 'description', content: 'Mentions légales de PRO GESTION SOFT (PGS), entreprise tech béninoise spécialisée dans les solutions numériques pour PME africaines.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://votredomaine.com/mentions-legales' } // Remplacez par votre URL canonique
  ]
});
</script>

<style scoped>
/* Animations basiques pour un peu de dynamisme */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.4s;
}
</style>