// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    ['nuxt-gtag', {
      id: process.env.GTAG_ID || 'G-47MYTCX97H',
      enabled: process.env.NODE_ENV === 'production'
    }],
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://progestionsoft.netlify.app',
    name: 'PRO GESTION SOFT',
  },

   sitemap: {
    xslColumns: [
      { label: 'URL', width: '50%' },
      { label: 'Last Modified', select: 'sitemap:lastmod', width: '25%' },
      { label: 'Priority', select: 'sitemap:priority', width: '12.5%' },
      { label: 'Change Frequency', select: 'sitemap:changefreq', width: '12.5%' },
      { label: 'Hreflangs', select: 'count(xhtml:link)', width: '25%' },
    ],
  },

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
      'Amaranth': [400, 700],
    }
  },
  app: {
    head: {
      title: 'Pro Gestion Soft - Solutions numériques pour les PME africaines',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'Pro Gestion Soft' },
        { name: 'keywords', content: 'Pro Gestion Soft, numérique, PME, Afrique, Bénin, SaaS, digitalisation, technologie, PGS, SuitOps' },
        { name: 'google-site-verification', content: 'OdKxHpVkBSxk0mj4vD4OTmZPdVi5pWzyCu4QPIMHy9A' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://progestionsoft.netlify.app' }
      ]
    }
  }
})
