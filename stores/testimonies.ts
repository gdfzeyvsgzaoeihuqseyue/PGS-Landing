import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Testimony } from '@/types';
import { useRuntimeConfig } from '#app';

export const useTestimonyStore = defineStore('testimonies', () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.pgsBaseAPI;

  const testimonies = ref<Testimony[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const submissionLoading = ref(false);
  const submissionError = ref<string | null>(null);
  const submissionSuccess = ref(false);

  /**
   * Récupère une liste paginée ou tous les témoignages depuis l'API.
   * @param page Le numéro de la page à récupérer (ignoré si all est true).
   * @param limit Le nombre de témoignages par page (ignoré si all est true).
   * @param all Si true, tente de récupérer tous les témoignages.
   * @param isPublished Filtrer par les témoignages publiés.
   * @param isFeatured Filtrer par les témoignages mis en avant.
   */
  async function fetchTestimonies(page: number = 1, limit: number = 10, all: boolean = false, isPublished: boolean | null = null, isFeatured: boolean | null = null) {
    loading.value = true;
    error.value = null;
    try {
      const params: { [key: string]: any } = { page, limit: all ? 100 : limit };
      if (isPublished !== null) {
        params.isPublished = isPublished;
      }
      if (isFeatured !== null) {
        params.isFeatured = isFeatured;
      }

      if (all) {
        let allFetchedTestimonies: Testimony[] = [];
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
            data: Testimony[];
          }>(`${API_BASE_URL}/solution/testimony`, {
            params: { ...params, page: currentPage, limit: initialLimit }
          });

          allFetchedTestimonies = allFetchedTestimonies.concat(response.data);
          totalPages = response.totalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        testimonies.value = allFetchedTestimonies;

      } else {
        const response = await $fetch<{
          success: boolean;
          message: string;
          nb: number;
          nbOnPage: number;
          currentPage: number;
          totalPages: number;
          data: Testimony[];
        }>(`${API_BASE_URL}/solution/testimony`, {
          params: params
        });

        testimonies.value = response.data;
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des témoignages: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Soumet un nouveau témoignage à l'API.
   * @param testimonyData Les données du témoignage à soumettre.
   */
  async function submitTestimony(testimonyData: {
    author: string;
    company?: string;
    role?: string;
    content: string;
    note?: number;
    avatar?: string;
    platformId?: string | null;
  }) {
    submissionLoading.value = true;
    submissionError.value = null;
    submissionSuccess.value = false;
    try {
      const payload = {
        author: testimonyData.author,
        company: testimonyData.company,
        role: testimonyData.role,
        content: testimonyData.content,
        note: testimonyData.note,
        avatar: testimonyData.avatar,
        isPublished: false,
        isFeatured: false,
        platformId: testimonyData.platformId,
      };

      const response = await $fetch(`${API_BASE_URL}/solution/testimony`, {
        method: 'POST',
        body: payload,
      });

      submissionSuccess.value = true;
      // Optionnellement, rafraîchir les témoignages pour mettre à jour la liste
      // await fetchTestimonies(1, 100, true);
      return response;
    } catch (err: any) {
      submissionError.value = 'Erreur lors de la soumission du témoignage: ' + (err.data?.message || err.message);
      console.error(submissionError.value, err);
      submissionSuccess.value = false;
      throw err; 
    } finally {
      submissionLoading.value = false;
    }
  }

  return {
    testimonies,
    loading,
    error,
    submissionLoading,
    submissionError,
    submissionSuccess,
    fetchTestimonies,
    submitTestimony,
  };
});
