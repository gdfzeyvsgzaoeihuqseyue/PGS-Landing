<template>
  <div class="min-h-screen mt-16 bg-gray-50 font-body">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <NewsletterModal />
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const sharedFilesUrl = runtimeConfig.public.pgsSharedFiles;

const heroImagePath = `${sharedFilesUrl}/PGS_Landing/Hero/pgs-banner.png`;
const baseUrl = "https://progestionsoft.netlify.app";

useHead({
  titleTemplate: '%s | PRO GESTION SOFT',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      key: 'description',
      name: 'description',
      content: 'Pro Gestion Soft développe des solutions numériques innovantes pour accompagner les PME africaines dans leur transformation digitale.'
    },
    { name: 'author', content: 'Pro Gestion Soft' },
    { name: 'keywords', content: 'Pro Gestion Soft, numérique, PME, Afrique, Bénin, SaaS, digitalisation, technologie, PGS, SuitOps' },
    
    // Open Graph (Facebook, LinkedIn)
    { property: 'og:title', content: 'Pro Gestion Soft - Solutions numériques pour les PME africaines' },
    { property: 'og:description', content: 'Découvrez l’écosystème PGS : des outils innovants pour digitaliser votre entreprise.' },
    { property: 'og:image', content: heroImagePath },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Pro Gestion Soft - Solutions numériques pour les PME africaines' },
    { name: 'twitter:description', content: 'Découvrez l’écosystème PGS : des outils innovants pour digitaliser votre entreprise.' },
    { name: 'twitter:image', content: heroImagePath },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
    { rel: 'canonical', href: baseUrl }
  ]
});
</script>
