import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Solution } from '@/types';
import { useRuntimeConfig } from '#app';

export const useSolutionStore = defineStore('solutions', () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.pgsBaseAPI; // Assuming this points to your backend

  const solutions = ref<Solution[]>([]);
  const currentSolution = ref<Solution | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalSolutions: 0,
    limit: 10,
  });

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
          }>(`${API_BASE_URL}/plateform`, {
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
        }>(`${API_BASE_URL}/plateform`, {
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
      }>(`${API_BASE_URL}/plateform/${identifier}`);

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

  return {
    solutions,
    currentSolution,
    loading,
    error,
    pagination,
    fetchSolutions,
    fetchSolutionByIdentifier,
  };
});
