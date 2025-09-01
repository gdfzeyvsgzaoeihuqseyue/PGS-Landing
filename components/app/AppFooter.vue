<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <!-- Grille principale -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <!-- Logo et description -->
        <div class="col-span-2">
          <h3 class="text-sm font-semibold uppercase tracking-wider">
            PRO GESTION SOFT SARL
          </h3>
          <p class="mt-6 text-gray-400 hover:text-white leading-6">
            Des solutions innovantes pour votre entreprise
          </p>
        </div>

        <!-- Boucle sur les sections -->
        <div v-for="section in navSections" :key="section.title">
          <h3 class="text-sm font-semibold uppercase tracking-wider">{{ section.title }}</h3>
          <ul class="mt-4 space-y-4">
            <li v-for="link in section.links" :key="link.name">
              <component
                :is="link.disabled ? 'span' : NuxtLink"
                :to="!link.disabled ? link.to : undefined"
                :class="[ link.disabled ? 'not-link' : 'hover:text-primary-600', 'py-1 block']"
                :title="link.disabled ? `${link.name} est temporairement indisponible` : undefined"
              >
                {{ link.name }}
              </component>
            </li>
          </ul>
        </div>
      </div>

      <!-- Séparateur -->
      <div class="mt-12 border-t border-gray-800 pt-8">
        <div class="md:flex md:items-center md:justify-between">
          <!-- Réseaux sociaux -->
          <div class="flex space-x-6 md:order-2">
            <ul role="list" class="flex justify-center sm:justify-start space-x-4">
              <SocialLink />
            </ul>
          </div>

          <!-- Copyright -->
          <p class="mt-8 text-xs leading-5 md:order-1 md:mt-0">
            &copy; {{ new Date().getFullYear() }} PRO GESTION SOFT SARL. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

// Sections de navigation avec activation/désactivation
const navSections = [
  {
    title: "Liens rapides",
    links: [
      { name: "Solutions", to: "/solutions", disabled: true },
      { name: "Evénements", to: "/events", disabled: true },
      { name: "Répertoire de Liens", to: "/usefullinks" }
    ]
  },
  {
    title: "Légal",
    links: [
      { name: "Mentions légales", to: "/legal" },
      { name: "Politique de confidentialité", to: "/privacy" },
      { name: "CGU", to: "/terms", disabled: true }
    ]
  }
]
</script>

<style scoped>
.footer-link {
  @apply text-gray-400 hover:text-white transition-colors;
}

.not-link {
  @apply text-gray-500/40 cursor-not-allowed opacity-50;
}
</style>
