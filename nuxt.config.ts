// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-PZGPXME136',
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  runtimeConfig: {
    public: {
      pgsBaseAPI: process.env.PGS_API_URL,
      pgsSharedFiles: process.env.PGS_SHARED_FILES,
      siteIdentifier: process.env.NUXT_PUBLIC_SITE_IDENTIFIER || 'pgs',
      betaMode: process.env.NUXT_BETA_MODE === 'true',
    }
  },

  googleFonts: {
    display: 'swap',
    families: {
      'Inter': [400, 500, 600, 700],
      'Poppins': [600, 700],
      'Delius': [400],
    }
  },
  app: {
    head: {
      title: 'Pro Gestion Soft - Solutions numériques pour les PME africaines',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Pro Gestion Soft développe des solutions numériques innovantes pour accompagner les PME africaines dans leur transformation digitale.'
        },
        { name: 'author', content: 'Pro Gestion Soft' },
        { name: 'keywords', content: 'Pro Gestion Soft, numérique, PME, Afrique, Bénin, SaaS, digitalisation, technologie, PGS, SuitOps' },

        // Open Graph (Facebook, LinkedIn)
        { property: 'og:title', content: 'Pro Gestion Soft - Solutions numériques pour les PME africaines' },
        { property: 'og:description', content: 'Découvrez l’écosystème PGS : des outils innovants pour digitaliser votre entreprise.' },
        { property: 'og:image', content: 'https://raw.githubusercontent.com/ProGestionSoft/Files/main/PGS_Landing/Hero/pgs-banner.png' },
        { property: 'og:url', content: 'https://progestionsoft.com' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Pro Gestion Soft - Solutions numériques pour les PME africaines' },
        { name: 'twitter:description', content: 'Découvrez l’écosystème PGS : des outils innovants pour digitaliser votre entreprise.' },
        { name: 'twitter:image', content: 'https://raw.githubusercontent.com/ProGestionSoft/Files/main/PGS_Landing/Hero/pgs-banner.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://progestionsoft.com' }
      ]
    }
  }
})
