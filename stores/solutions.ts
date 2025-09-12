import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Solution, PlateformDoc, PlateformFaq, PlateformTutorial, PlateformWiki } from '@/types';
import { useRuntimeConfig } from '#app';

export const useSolutionStore = defineStore('solutions', () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.pgsBaseAPI;

  const solutions = ref<Solution[]>([]);
  const currentSolution = ref<Solution | null>(null);
  const allDocs = ref<PlateformDoc[]>([]);
  const allFaqs = ref<PlateformFaq[]>([]);
  const allTutorials = ref<PlateformTutorial[]>([]);
  const allWikis = ref<PlateformWiki[]>([]);

  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalSolutions: 0,
    limit: 10,
  });

  // Fonction helper pour enrichir les plateformes avec les logos
  function enrichPlatformWithLogos<T extends { platform: any }>(items: T[]): T[] {
    return items.map(item => {
      const fullPlatform = solutions.value.find(s => s.id === item.platform.id);
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

  async function fetchSolutions(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (all) {
        let allFetchedSolutions: Solution[] = [];
        let currentPage = 1;
        let totalPages = 1;
        const initialLimit = 100;

        do {
          const response = await $fetch<{
            success: boolean;
            message: string;
            nb: number;
            nbOnPage: number;
            currentPage: number;
            totalPages: number;
            data: Solution[];
          }>(`${API_BASE_URL}/plateform/solution`, {
            params: { page: currentPage, limit: initialLimit }
          });

          allFetchedSolutions = allFetchedSolutions.concat(response.data);
          totalPages = response.totalPages;
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
        const response = await $fetch<{
          success: boolean;
          message: string;
          nb: number;
          nbOnPage: number;
          currentPage: number;
          totalPages: number;
          data: Solution[];
        }>(`${API_BASE_URL}/plateform/solution`, {
          params: { page, limit }
        });

        solutions.value = response.data;
        pagination.value = {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalSolutions: response.nb,
          limit: limit,
        };
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des solutions: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchSolutionByIdentifier(identifier: string) {
    loading.value = true;
    error.value = null;
    currentSolution.value = null;
    try {
      const response = await $fetch<{
        success: boolean;
        message: string;
        data: Solution;
      }>(`${API_BASE_URL}/plateform/solution/${identifier}`);

      currentSolution.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement de la solution: ' + (err.data?.message || err.message);
      console.error(error.value, err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPlateformDocs(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const response = await $fetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformDoc[];
      }>(`${API_BASE_URL}/plateform/doc`, {
        params: { page, limit: all ? 100 : limit }
      });

      // Enrichir avec les logos
      allDocs.value = enrichPlatformWithLogos(response.data);
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des documents: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchPlateformFaqs(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const response = await $fetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformFaq[];
      }>(`${API_BASE_URL}/plateform/faq`, {
        params: { page, limit: all ? 100 : limit }
      });

      // Enrichir avec les logos
      allFaqs.value = enrichPlatformWithLogos(response.data);
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des FAQs: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchPlateformTutorials(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      // S'assurer que les solutions sont chargées
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const response = await $fetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformTutorial[];
      }>(`${API_BASE_URL}/plateform/tutorial`, {
        params: { page, limit: all ? 100 : limit }
      });

      allTutorials.value = enrichPlatformWithLogos(response.data);
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des tutoriels: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchPlateformWikis(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (solutions.value.length === 0) {
        await fetchSolutions(undefined, undefined, true);
      }

      const response = await $fetch<{
        success: boolean;
        message: string;
        nb: number;
        nbOnPage: number;
        currentPage: number;
        totalPages: number;
        data: PlateformWiki[];
      }>(`${API_BASE_URL}/plateform/wiki`, {
        params: { page, limit: all ? 100 : limit }
      });

      allWikis.value = enrichPlatformWithLogos(response.data);

    } catch (err: any) {
      error.value = 'Erreur lors du chargement des wikis: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
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
    error,
    pagination,
    fetchSolutions,
    fetchSolutionByIdentifier,
    fetchPlateformDocs,
    fetchPlateformFaqs,
    fetchPlateformTutorials,
    fetchPlateformWikis,
  };
});
