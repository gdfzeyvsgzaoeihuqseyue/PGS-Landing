import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Solution, PlateformDoc, PlateformFaq, PlateformTutorial, PlateformWiki, Partner, Testimony } from '@/types';

export const useSolutionStore = defineStore('solutions', () => {
  const solutions = ref<Solution[]>([]);
  const currentSolution = ref<Solution | null>(null);
  const allDocs = ref<PlateformDoc[]>([]);
  const allFaqs = ref<PlateformFaq[]>([]);
  const allTutorials = ref<PlateformTutorial[]>([]);
  const allWikis = ref<PlateformWiki[]>([]);

  // États de chargement
  const loadingStates = ref({
    solutions: false,
    docs: false,
    faqs: false,
    tutorials: false,
    wikis: false,
    currentSolution: false,
  });

  const initializedStates = ref({
    solutions: false,
    currentSolution: false,
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalSolutions: 0,
    limit: 10,
  });

  const counts = ref({
    byLetter: {} as Record<string, number>,
    byPlatform: {} as Record<string, { id: string | null; count: number }>,
  });

  // Fonction helper pour enrichir les plateformes avec les logos
  function enrichPlatformWithLogos<T extends { platform: any }>(items: T[]): T[] {
    return items.map(item => {
      const fullPlatform = solutions.value.find(s => s.id === item.platform?.id);
      if (fullPlatform) {
        return {
          ...item,
          platform: {
            ...item.platform,
            logo: fullPlatform.logo,
            logoDesk: fullPlatform.logoDesk,
            category: fullPlatform.category,
          }
        };
      }
      return item;
    });
  }

  async function fetchCounts() {
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        countsByLetter: Record<string, number>;
        countsByPlatform: Record<string, { id: string | null; count: number }>;
      }>(`/solution/wiki/counts`, {});

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        counts.value.byLetter = response.value.countsByLetter;
        counts.value.byPlatform = response.value.countsByPlatform;
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des décomptes:', err);
      error.value = 'Erreur lors du chargement des décomptes: ' + (err.data?.message || err.message);
    }
  }

  async function fetchSolutions(page: number = 1, limit: number = 10, all: boolean = false) {
    loadingStates.value.solutions = true;
    loading.value = true;
    error.value = null;
    try {
      if (all) {
        let allFetchedSolutions: Solution[] = [];
        let currentPage = 1;
        let totalPages = 1;
        const initialLimit = 100;

        do {
          const { apiFetch } = useApi();
          const { data: response, error: fetchError } = await apiFetch<{
            success: boolean;
            message: string;
            nb: number;
            nbOnPage: number;
            currentPage: number;
            totalPages: number;
            data: Solution[];
          }>(`/solution/platform`, {
            params: { page: currentPage, limit: initialLimit }
          });

          if (fetchError.value) {
            throw new Error(fetchError.value.message || 'Erreur lors du chargement');
          }

          if (response.value) {
            allFetchedSolutions = allFetchedSolutions.concat(response.value.data);
            totalPages = response.value.totalPages;
          }
          currentPage++;
        } while (currentPage <= totalPages);

        solutions.value = allFetchedSolutions;
        pagination.value = {
          currentPage: 1,
          totalPages: 1,
          totalSolutions: allFetchedSolutions.length,
          limit: allFetchedSolutions.length,
        };

      } else {
        const { apiFetch } = useApi();
        const { data: response, error: fetchError } = await apiFetch<{
          success: boolean;
          message: string;
          nb: number;
          nbOnPage: number;
          currentPage: number;
          totalPages: number;
          data: Solution[];
        }>(`/solution/platform`, {
          params: { page, limit }
        });

        if (fetchError.value) {
          throw new Error(fetchError.value.message || 'Erreur lors du chargement');
        }

        if (response.value) {
          solutions.value = response.value.data;
          pagination.value = {
            currentPage: response.value.currentPage,
            totalPages: response.value.totalPages,
            totalSolutions: response.value.nb,
            limit: limit,
          };
        }
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des solutions: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      initializedStates.value.solutions = true;
      loadingStates.value.solutions = false;
      loading.value = false;
    }
  }

  async function fetchSolutionByIdentifier(identifier: string) {
    loadingStates.value.currentSolution = true;
    loading.value = true;
    error.value = null;
    currentSolution.value = null;
    try {
      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        success: boolean;
        message: string;
        data: Solution;
      }>(`/solution/platform/${identifier}`, {
        params: {
          populate: 'partners,testimonies,docs,faq,tutorials,wiki'
        }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        currentSolution.value = response.value.data;
        return response.value.data;
      }
      return null;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement de la solution: ' + (err.data?.message || err.message);
      console.error(error.value, err);
      return null;
    } finally {
      initializedStates.value.currentSolution = true;
      loadingStates.value.currentSolution = false;
      loading.value = false;
    }
  }

  async function fetchPlateformDocs(page: number = 1, limit: number = 10, all: boolean = false) {
    loadingStates.value.docs = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformDoc[];
      }>(`/solution/doc`, {
        params: { page, limit: all ? 100 : limit }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      // Enrichir avec les logos
      if (response.value) {
        allDocs.value = enrichPlatformWithLogos(response.value.data);
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des documents: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loadingStates.value.docs = false;
    }
  }

  async function fetchPlateformFaqs(page: number = 1, limit: number = 10, all: boolean = false) {
    loadingStates.value.faqs = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformFaq[];
      }>(`/solution/faq`, {
        params: { page, limit: all ? 100 : limit }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      // Enrichir avec les logos
      if (response.value) {
        allFaqs.value = enrichPlatformWithLogos(response.value.data);
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des FAQs: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loadingStates.value.faqs = false;
    }
  }

  async function fetchPlateformTutorials(page: number = 1, limit: number = 10, all: boolean = false) {
    loadingStates.value.tutorials = true;
    error.value = null;
    try {
      // S'assurer que les solutions sont chargées
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformTutorial[];
      }>(`/solution/tutorial`, {
        params: { page, limit: all ? 100 : limit }
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        allTutorials.value = enrichPlatformWithLogos(response.value.data);
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des tutoriels: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loadingStates.value.tutorials = false;
    }
  }

  async function fetchPlateformWikis(page: number = 1, limit: number = 10, all: boolean = false, startLetter: string | null = null, platformId: string | null = null, loadMore: boolean = false) {
    loadingStates.value.wikis = true;
    loading.value = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const params: { [key: string]: any } = { page, limit: all ? 100 : limit };
      if (startLetter) {
        params.startLetter = startLetter;
      }
      if (platformId) {
        params.platformId = platformId;
      }

      const { apiFetch } = useApi();
      const { data: response, error: fetchError } = await apiFetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformWiki[];
      }>(`/solution/wiki`, {
        params: params
      });

      if (fetchError.value) {
        throw new Error(fetchError.value.message || 'Erreur lors du chargement');
      }

      if (response.value) {
        const enrichedData = enrichPlatformWithLogos(response.value.data);

        if (loadMore) {
          allWikis.value = [...allWikis.value, ...enrichedData];
        } else {
          allWikis.value = enrichedData;
        }

        pagination.value = {
          currentPage: response.value.currentPage,
          totalPages: response.value.totalPages,
          totalSolutions: response.value.nb,
          limit: limit,
        };
      }

    } catch (err: any) {
      error.value = 'Erreur lors du chargement des wikis: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loadingStates.value.wikis = false;
      loading.value = false;
    }
  }

  return {
    solutions,
    currentSolution,
    allDocs,
    allFaqs,
    allTutorials,
    allWikis,
    loading,
    loadingStates,
    initializedStates,
    error,
    pagination,
    counts,
    fetchSolutions,
    fetchSolutionByIdentifier,
    fetchPlateformDocs,
    fetchPlateformFaqs,
    fetchPlateformTutorials,
    fetchPlateformWikis,
    fetchCounts,
  };
});
