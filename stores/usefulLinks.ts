import { defineStore } from 'pinia'
import type { UsefulLink, UsefulLinksState, EnrichedLink } from '@/types'
import { getPlatformById } from '@/stores/platforms'

export const useUsefulLinksStore = defineStore('usefullinks', {
  state: (): UsefulLinksState => ({
    links: [],
    loading: false,
    error: null
  }),

  getters: {
    // Ajoute enrichissement + ordre dynamique
    enrichedLinks: (state): EnrichedLink[] => {
      return state.links.map((link, index) => {
        const platform = getPlatformById(link.platformId)
        return {
          ...link,
          order: index + 1,
          platform: platform?.name || 'Inconnue',
          platformLogo: platform?.logo || '',
          platformCategory: platform?.category
        }
      })
    },

    // Tri alphabétique avec ordre recalculé
    sortedAlphabetically(): EnrichedLink[] {
      return [...this.enrichedLinks]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((link, index) => ({ ...link, order: index + 1 }))
    },

    // Tri alphabétique inversé avec ordre recalculé
    sortedAlphabeticallyReverse(): EnrichedLink[] {
      return [...this.enrichedLinks]
        .sort((a, b) => b.name.localeCompare(a.name))
        .map((link, index) => ({ ...link, order: index + 1 }))
    },

    // Groupement par première lettre avec ordre
    groupedByLetter(): Record<string, EnrichedLink[]> {
      const grouped: Record<string, EnrichedLink[]> = {}
      this.sortedAlphabetically.forEach((link) => {
        const firstLetter = link.name.charAt(0).toUpperCase()
        if (!grouped[firstLetter]) {
          grouped[firstLetter] = []
        }
        grouped[firstLetter].push(link)
      })
      return grouped
    },

    // Groupement par plateforme
    groupedByPlatform(): Record<string, EnrichedLink[]> {
      const grouped: Record<string, EnrichedLink[]> = {}
      this.enrichedLinks.forEach((link) => {
        if (!grouped[link.platform]) {
          grouped[link.platform] = []
        }
        grouped[link.platform].push(link)
      })
      return grouped
    },

    // Liste des plateformes uniques
    platforms(): string[] {
      return Array.from(new Set(this.enrichedLinks.map(link => link.platform))).sort()
    },

    // Liste des lettres uniques
    letters(): string[] {
      return Array.from(new Set(this.enrichedLinks.map(link => link.name.charAt(0).toUpperCase()))).sort()
    },

    // Récupération par slug (enrichi)
    getLinkBySlug(): (slug: string) => EnrichedLink | undefined {
      return (slug: string) => {
        return this.enrichedLinks.find(link => link.slug === slug)
      }
    }
  },

  actions: {
    async fetchLinks() {
      this.loading = true
      this.error = null

      try {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simule API

        this.links = [
          {
            id: '1',
            name: 'Documentation LocaSpace',
            description: 'Guide complet pour utiliser la plateforme LocaSpace, incluant les fonctionnalités pour propriétaires et locataires.',
            platformId: 'locaspace',
            url: 'https://docs.locaspace.bj/guide-complet',
            slug: 'documentation-locaspace',
            additionalInfo: 'Cette documentation est mise à jour régulièrement avec les nouvelles fonctionnalités de la plateforme.'
          },
          {
            id: '2',
            name: 'API Reference Guide',
            description: 'Documentation technique complète de l\'API LocaSpace pour les développeurs souhaitant intégrer nos services.',
            platformId: 'locaspace',
            url: 'https://api.locaspace.bj/docs/reference',
            slug: 'api-reference-guide',
            additionalInfo: 'L\'API est disponible en version REST et GraphQL avec authentification OAuth 2.0.'
          },
          {
            id: '3',
            name: 'Mentions Légales Studio',
            description: 'Informations légales et conditions d\'utilisation pour Studio, notre plateforme de création de contenu.',
            platformId: 'pgs-studio',
            url: 'https://studio.example.com/legal/mentions-legales',
            slug: 'mentions-legales-studio',
            additionalInfo: 'Ces mentions légales sont conformes au RGPD et à la législation béninoise.'
          },
          {
            id: '4',
            name: 'Inscription Bêta Templix',
            description: 'Formulaire d\'inscription pour participer à la version bêta de Templix, notre nouvel outil de templates.',
            platformId: 'templix',
            url: 'https://beta.templix.com/signup?ref=locaspace',
            slug: 'inscription-beta-templix',
            additionalInfo: 'La bêta est limitée à 1000 utilisateurs. Accès prioritaire pour les partenaires LocaSpace.'
          },
          {
            id: '5',
            name: 'Base de Connaissances Support',
            description: 'Centre d\'aide avec articles, tutoriels et FAQ pour résoudre les problèmes courants.',
            platformId: 'docs',
            url: 'https://support.locaspace.bj/knowledge-base',
            slug: 'base-connaissances-support',
            additionalInfo: 'Plus de 200 articles disponibles en français avec recherche avancée.'
          },
          {
            id: '6',
            name: 'Calculateur de Rentabilité',
            description: 'Outil en ligne pour calculer la rentabilité de vos investissements immobiliers au Bénin.',
            platformId: 'locaspace',
            url: 'https://tools.locaspace.bj/calculateur-rentabilite',
            slug: 'calculateur-rentabilite',
            additionalInfo: 'Prend en compte les spécificités fiscales et économiques du marché béninois.'
          },
          {
            id: '7',
            name: 'Dashboard Analytics',
            description: 'Interface de visualisation des données et statistiques pour les propriétaires et gestionnaires.',
            platformId: 'pgs-studio',
            url: 'https://analytics.locaspace.bj/dashboard/overview',
            slug: 'dashboard-analytics',
            additionalInfo: 'Données en temps réel avec exports PDF et Excel disponibles.'
          },
          {
            id: '8',
            name: 'Formation en Ligne',
            description: 'Cours et certifications pour maîtriser la gestion locative moderne et les outils numériques.',
            platformId: 'skillup',
            url: 'https://formation.locaspace.bj/courses/gestion-locative-101',
            slug: 'formation-en-ligne',
            additionalInfo: 'Certification reconnue par l\'Association des Professionnels de l\'Immobilier du Bénin.'
          },
          {
            id: '9',
            name: 'Marketplace Extensions',
            description: 'Boutique d\'extensions et plugins développés par la communauté LocaSpace.',
            platformId: 'DropShop',
            url: 'https://marketplace.locaspace.bj/extensions/browse',
            slug: 'marketplace-extensions',
            additionalInfo: 'Plus de 50 extensions disponibles, gratuites et payantes.'
          },
          {
            id: '10',
            name: 'Plateforme Webinaires',
            description: 'Accès aux webinaires hebdomadaires sur les tendances du marché immobilier béninois.',
            platformId: 'next-summit',
            url: 'https://webinars.locaspace.bj/upcoming/register',
            slug: 'plateforme-webinaires',
            additionalInfo: 'Replays disponibles pour les abonnés premium avec certificats de participation.'
          }
        ]
      } catch (error) {
        this.error = 'Erreur lors du chargement des liens utiles'
        console.error('Error fetching useful links:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
