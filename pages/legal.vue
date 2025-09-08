<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4 md:px-8 lg:px-12">
      <header class="text-center mb-12 py-6">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          <span class="text-primary">Mentions</span> Légales
        </h1>
        <p class="mt-4 text-lg sm:text-xl max-w-2xl mx-auto">
          Transparence et conformité : retrouvez ici toutes les informations légales concernant PRO GESTION SOFT (PGS)
        </p>
        <p class="mt-2 text-sm text-gray-500">Dernière mise à jour : {{ lastUpdatedDate }}</p>
      </header>

      <div class="lg:hidden mb-6">
        <button @click="showMobileToc = !showMobileToc"
          class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
          <IconList class="h-5 w-5 mr-2" />
          Table des matières
        </button>
        <div v-if="showMobileToc" class="mt-4 bg-white rounded-lg shadow-md p-4">
          <nav>
            <ul class="space-y-2">
              <li v-for="item in tableOfContents" :key="item.id">
                <a :href="`#${item.id}`" @click="scrollToSection(item.id); showMobileToc = false"
                  :class="['block text-gray-700 hover:text-primary transition-colors', { 'font-bold text-primary': activeSectionId === item.id }]">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside class="hidden lg:block lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <h2 class="text-xl font-bold mb-4">Table des matières</h2>
            <nav>
              <ul class="space-y-2">
                <li v-for="item in tableOfContents" :key="item.id">
                  <a :href="`#${item.id}`" @click="scrollToSection(item.id)"
                    :class="['block text-gray-700 hover:text-primary transition-colors', { 'font-bold text-primary': activeSectionId === item.id }]">
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        <section id="legal-content"
          class="lg:col-span-3 bg-white rounded-xl shadow-lg p-8 md:p-12 lg:p-16 animate-fade-in-delay">

          <div class="space-y-10">
            <div>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Le site PRO GESTION SOFT est assuré par PRO GESTION SOFT SARL, Société A Responsabilité Limitée,
                immatriculée au Registre de Commerce et de Crédit Mobilier sous le numéro RB/PNO/21 B 3584 et sous le
                numéro d’Identification Fiscal Unique 3202113666653 et dont le siège social est fixé à Adjarra,
                Malanhoui,
                Tanmè (République du Bénin).
              </p>
            </div>

            <div>
              <div class="flex items-center text-primary mb-4">
                <IconFileText class="w-8 h-8 mr-3" />
                <h2 id="declaration-apdp" class="text-2xl sm:text-3xl font-bold">Déclaration à l'APDP</h2>
              </div>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Conformément à la loi 2017-20 portant code du numérique en République du Bénin (Livre 5ième relatif à la
                protection des données personnelles et de la vie privée), le site a fait l'objet d'une déclaration
                auprès
                de l’Autorité de Protection des Données Personnelles (A.D.P.D) (<a href="https://www.apdp.bj"
                  target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">www.apdp.bj</a>) sous
                le
                numéro (le numéro du récépissé).
              </p>
              <p class="text-base sm:text-lg leading-relaxed">
                En tout état de cause PRO GESTION SOFT ne collecte des informations personnelles relatives à
                l’utilisateur
                que pour le besoin de certains services proposés par le site <a href="https://progestionsoft.com"
                  target="_blank" rel="noopener noreferrer"
                  class="text-primary hover:underline">https://progestionsoft.com</a>. L’utilisateur fournit ces
                informations en toute connaissance de cause, notamment lorsqu’il procède par lui-même à leur saisie.
              </p>
            </div>

            <div>
              <div class="flex items-center text-primary mb-4">
                <IconUserCheck class="w-8 h-8 mr-3" />
                <h2 id="droit-acces" class="text-2xl sm:text-3xl font-bold">Droit d'accès</h2>
              </div>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Conformément aux dispositions de la loi 2017-20 portant code du numérique en République du Bénin, tout
                utilisateur dispose d’un droit d’accès, de rectification et d’opposition aux données personnelles le
                concernant, en effectuant sa demande écrite et signée, accompagnée d’une copie du titre d’identité avec
                signature du titulaire de la pièce, en précisant l’adresse à laquelle la réponse doit être envoyée.
              </p>
              <p class="text-base sm:text-lg leading-relaxed">
                Ce droit peut être exercé par voie postale auprès de <a href="https://progestionsoft.com"
                  target="_blank" rel="noopener noreferrer"
                  class="text-primary hover:underline">https://progestionsoft.com</a> ou par
                voie électronique à l’adresse email suivante : <a href="mailto:legal@progestionsoft.com"
                  class="text-primary hover:underline">legal@progestionsoft.com</a>.
              </p>
              <p class="text-base sm:text-lg leading-relaxed">
                Aucune information personnelle de l’utilisateur du site <a href="https://progestionsoft.com"
                  target="_blank" rel="noopener noreferrer"
                  class="text-primary hover:underline">https://progestionsoft.com</a> n’est publiée à l’insu de
                l’utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers.
              </p>
            </div>

            <div>
              <div class="flex items-center text-primary mb-4">
                <IconShieldLock class="w-8 h-8 mr-3" />
                <h2 id="confidentialite" class="text-2xl sm:text-3xl font-bold">Confidentialité</h2>
              </div>
              <p class="text-base sm:text-lg leading-relaxed">
                Vos données personnelles sont confidentielles et ne seront en aucun cas communiquées à des tiers
                conformément à notre <NuxtLink to="/privacy" class="text-primary hover:underline">Politique de
                  Confidentialité</NuxtLink>.
              </p>
            </div>

            <div>
              <div class="flex items-center text-primary mb-4">
                <IconCopyright class="w-8 h-8 mr-3" />
                <h2 id="propriete-intellectuelle" class="text-2xl sm:text-3xl font-bold">Propriété Intellectuelle</h2>
              </div>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                À l’exception des services tiers, les services sont la propriété unique et exclusive de PRO GESTION SOFT
                et non de l’utilisateur. Sans limiter la généralité de ce qui précède, tous les droits, titres et
                intérêts
                dans et sur les Services, y compris tous les logiciels, sites Web, serveurs, graphiques, images, audio,
                vidéo et autres médias, designs, animations, interfaces, documentation, l’apparence, algorithmes,
                données,
                caractéristiques, outils et méthodes de publicité et d’acquisition, inventions, secrets commerciaux,
                logos, marques commerciales, marques de service, noms commerciaux et autres identificateurs
                propriétaires,
                qu’ils soient ou non enregistrés et/ou susceptibles d’être enregistrés, et toutes leurs dérivations sont
                la propriété de et/ou sous licence de PRO GESTION SOFT.
              </p>
              <p class="text-base sm:text-lg leading-relaxed mb-4">
                Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même
                partielle,
                de ces différents éléments est strictement interdite sans l'accord exprès par écrit de PRO GESTION SOFT
                SARL.
              </p>
              <p class="text-base sm:text-lg leading-relaxed">
                Le responsable de publication est PRO GESTION SOFT SARL, représentée par son service de Recherche et
                Développement (RD), en qualité de chargé des recherches et co-fondateur de KAARÒ GROUP SARL.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import {
  IconCopyright,
  IconFileText,
  IconUserCheck,
  IconShieldLock,
  IconList
} from '@tabler/icons-vue';

const lastUpdatedDate = ref('25 septembre 2025'); 
const tableOfContents = ref<{ id: string; text: string }[]>([]);
const activeSectionId = ref('');
const showMobileToc = ref(false);

// Function to generate a slug from text
const slugify = (text: string) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Function to scroll to a section
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Scroll spy logic
const handleScroll = () => {
  const scrollY = window.scrollY;
  const sections = tableOfContents.value.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];

  let currentActiveId = '';
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.offsetTop <= scrollY + 100) {
      currentActiveId = section.id;
      break;
    }
  }
  activeSectionId.value = currentActiveId;
};

onMounted(() => {
  // Generate TOC
  nextTick(() => {
    const contentContainer = document.getElementById('legal-content');
    if (contentContainer) {
      const headings = contentContainer.querySelectorAll('h2');
      headings.forEach((heading) => {
        const text = heading.textContent || '';
        const id = slugify(text);
        heading.id = id; 
        tableOfContents.value.push({ id, text });
      });
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

useHead({
  title: 'Mentions Légales - PRO GESTION SOFT',
  meta: [
    { name: 'description', content: 'Mentions légales de PRO GESTION SOFT (PGS), entreprise tech béninoise spécialisée dans les solutions numériques pour PME africaines.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://votredomaine.com/mentions-legales' }
  ]
});
</script>

<style scoped>
/* Animations basiques pour un peu de dynamisme */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
