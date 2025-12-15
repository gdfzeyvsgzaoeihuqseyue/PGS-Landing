import { defineStore } from 'pinia';
import type { Faq, FaqTopic, FaqVoteResponse, FaqFilters, FaqStats } from '@/types';

interface FaqState {
  topics: FaqTopic[];
  faqs: Faq[];
  loading: boolean;
  error: string | null;
  userVotes: Map<string, 'useful' | 'useless'>; // Track user votes locally
}

export const useFaqStore = defineStore('faq', {
  state: (): FaqState => ({
    topics: [],
    faqs: [],
    loading: false,
    error: null,
    userVotes: new Map(),
  }),

  getters: {
    /**
     * Récupère tous les topics actifs
     */
    activeTopics: (state): FaqTopic[] => {
      return state.topics.filter(topic => topic.status === 'active');
    },

    /**
     * Récupère toutes les FAQs actives
     */
    activeFaqs: (state): Faq[] => {
      return state.faqs.filter(faq => faq.status === 'active');
    },

    /**
     * Récupère les plateformes uniques
     */
    uniquePlatforms: (state): string[] => {
      const platforms = state.topics.map(topic => topic.platform?.name).filter(Boolean);
      return [...new Set(platforms)];
    },

    /**
     * Récupère les statistiques des FAQs
     */
    stats: (state): FaqStats => {
      const allFaqs = state.topics.flatMap(topic => topic.faqs || []);
      const usefulVotes = allFaqs.reduce((sum, faq) => sum + faq.isUseful, 0);
      const uselessVotes = allFaqs.reduce((sum, faq) => sum + faq.isUseless, 0);

      return {
        totalFaqs: allFaqs.length,
        totalTopics: state.topics.length,
        totalPlatforms: new Set(state.topics.map(t => t.platform?.name)).size,
        totalVotes: usefulVotes + uselessVotes,
        usefulVotes,
        uselessVotes,
      };
    },

    /**
     * Vérifie si l'utilisateur a déjà voté pour une FAQ
     */
    hasUserVoted: (state) => (faqId: string): boolean => {
      return state.userVotes.has(faqId);
    },

    /**
     * Récupère le type de vote de l'utilisateur pour une FAQ
     */
    getUserVote: (state) => (faqId: string): 'useful' | 'useless' | null => {
      return state.userVotes.get(faqId) || null;
    },
  },

  actions: {
    /**
     * Récupère tous les topics avec leurs FAQs
     */
    async fetchTopics(filters?: FaqFilters): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();
        const { useSolutionStore } = await import('@/stores/solutions');
        const solutionStore = useSolutionStore();

        // S'assurer que les solutions sont chargées pour avoir les logos
        if (!solutionStore.solutions.length) {
          await solutionStore.fetchSolutions(undefined, undefined, true);
        }

        const params: any = {
          includeFaqs: true,
          status: filters?.status || 'active',
          limit: 100,
        };

        if (filters?.platform) {
          params.platform = filters.platform;
        }

        const { data: response, error: fetchError } = await apiFetch<{
          success: boolean;
          message: string;
          nb: number;
          data: FaqTopic[];
        }>('/solution/faq-topic', { params });

        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Erreur lors du chargement');
        }

        if (response.value?.data) {
          // Enrichir les topics avec les logos des plateformes
          this.topics = response.value.data.map(topic => {
            const fullPlatform = solutionStore.solutions.find(s => s.id === topic.platform?.id);
            if (fullPlatform) {
              return {
                ...topic,
                platform: {
                  ...topic.platform,
                  logo: fullPlatform.logo,
                  logoDesk: fullPlatform.logoDesk,
                  category: fullPlatform.category,
                }
              };
            }
            return topic;
          });

          // Extraire toutes les FAQs dans un tableau à plat
          this.faqs = this.topics.flatMap(topic => topic.faqs || []);
        }
      } catch (err: any) {
        this.error = err.message || 'Erreur lors du chargement des FAQs';
        console.error('Erreur fetchTopics:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Vote pour une FAQ comme utile
     */
    async voteUseful(faqId: string): Promise<FaqVoteResponse> {
      // Vérifier si l'utilisateur a déjà voté
      if (this.hasUserVoted(faqId)) {
        const existingVote = this.getUserVote(faqId);
        if (existingVote === 'useful') {
          throw new Error('Vous avez déjà voté cette FAQ comme utile');
        }
      }

      try {
        const { apiFetch } = useApi();
        const { data: response, error: fetchError } = await apiFetch<FaqVoteResponse>(
          `/solution/vote-useful/${faqId}`,
          {
            method: 'PATCH',
          }
        );

        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Erreur lors du vote');
        }

        if (response.value) {
          // Mettre à jour localement la FAQ dans les topics
          this.updateFaqVotes(faqId, response.value.data);

          // Enregistrer le vote de l'utilisateur
          this.userVotes.set(faqId, 'useful');

          // Sauvegarder dans le localStorage
          this.saveUserVotesToStorage();

          return response.value;
        }

        throw new Error('Réponse invalide du serveur');
      } catch (err: any) {
        console.error('Erreur voteUseful:', err);
        throw err;
      }
    },

    /**
     * Vote pour une FAQ comme inutile
     */
    async voteUseless(faqId: string): Promise<FaqVoteResponse> {
      // Vérifier si l'utilisateur a déjà voté
      if (this.hasUserVoted(faqId)) {
        const existingVote = this.getUserVote(faqId);
        if (existingVote === 'useless') {
          throw new Error('Vous avez déjà voté cette FAQ comme inutile');
        }
      }

      try {
        const { apiFetch } = useApi();
        const { data: response, error: fetchError } = await apiFetch<FaqVoteResponse>(
          `/solution/vote-useless/${faqId}`,
          {
            method: 'PATCH',
          }
        );

        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Erreur lors du vote');
        }

        if (response.value) {
          // Mettre à jour localement la FAQ dans les topics
          this.updateFaqVotes(faqId, response.value.data);

          // Enregistrer le vote de l'utilisateur
          this.userVotes.set(faqId, 'useless');

          // Sauvegarder dans le localStorage
          this.saveUserVotesToStorage();

          return response.value;
        }

        throw new Error('Réponse invalide du serveur');
      } catch (err: any) {
        console.error('Erreur voteUseless:', err);
        throw err;
      }
    },

    /**
     * Met à jour les votes d'une FAQ localement
     */
    updateFaqVotes(faqId: string, voteData: { isUseful: number; isUseless: number }): void {
      // Mise à jour dans les topics
      this.topics = this.topics.map(topic => ({
        ...topic,
        faqs: topic.faqs?.map(faq =>
          faq.id === faqId
            ? { ...faq, isUseful: voteData.isUseful, isUseless: voteData.isUseless }
            : faq
        ),
      }));

      // Mise à jour dans le tableau de FAQs
      this.faqs = this.faqs.map(faq =>
        faq.id === faqId
          ? { ...faq, isUseful: voteData.isUseful, isUseless: voteData.isUseless }
          : faq
      );
    },

    /**
     * Filtre les topics selon les critères donnés
     */
    filterTopics(filters: FaqFilters): FaqTopic[] {
      let filtered = [...this.topics];

      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(topic =>
          topic.name.toLowerCase().includes(query) ||
          topic.description?.toLowerCase().includes(query) ||
          topic.faqs?.some(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
          )
        );
      }

      if (filters.platform) {
        filtered = filtered.filter(topic => topic.platform?.name === filters.platform);
      }

      if (filters.topic) {
        filtered = filtered.filter(topic => topic.id === filters.topic);
      }

      if (filters.status) {
        filtered = filtered.filter(topic => topic.status === filters.status);
      }

      return filtered;
    },

    /**
     * Récupère un topic aléatoire avec ses FAQs
     */
    getRandomTopic(): { topic: FaqTopic; faqs: Faq[] } | null {
      const activeTopicsWithFaqs = this.activeTopics.filter(
        topic => topic.faqs && topic.faqs.length > 0
      );

      if (activeTopicsWithFaqs.length === 0) {
        return null;
      }

      // Sélectionner un topic aléatoire
      const randomTopic = activeTopicsWithFaqs[
        Math.floor(Math.random() * activeTopicsWithFaqs.length)
      ];

      // Sélectionner 4 FAQs aléatoires de ce topic
      const shuffledFaqs = [...(randomTopic.faqs || [])].sort(() => Math.random() - 0.5);
      const randomFaqs = shuffledFaqs.slice(0, 4);

      return {
        topic: randomTopic,
        faqs: randomFaqs,
      };
    },

    /**
     * Récupère un topic par son ID
     */
    getTopicById(topicId: string): FaqTopic | undefined {
      return this.topics.find(topic => topic.id === topicId);
    },

    /**
     * Récupère une FAQ par son ID
     */
    getFaqById(faqId: string): Faq | undefined {
      return this.faqs.find(faq => faq.id === faqId);
    },

    /**
     * Sauvegarde les votes de l'utilisateur dans le localStorage
     */
    saveUserVotesToStorage(): void {
      if (typeof window !== 'undefined') {
        const votesArray = Array.from(this.userVotes.entries());
        localStorage.setItem('faq_user_votes', JSON.stringify(votesArray));
      }
    },

    /**
     * Charge les votes de l'utilisateur depuis le localStorage
     */
    loadUserVotesFromStorage(): void {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('faq_user_votes');
        if (stored) {
          try {
            const votesArray = JSON.parse(stored) as [string, 'useful' | 'useless'][];
            this.userVotes = new Map(votesArray);
          } catch (err) {
            console.error('Erreur lors du chargement des votes:', err);
          }
        }
      }
    },

    /**
     * Réinitialise l'état du store
     */
    reset(): void {
      this.topics = [];
      this.faqs = [];
      this.loading = false;
      this.error = null;
      this.userVotes.clear();
    },
  },
});
