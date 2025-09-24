import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Partner } from '@/types';
import { useRuntimeConfig } from '#app';

export const usePartnerStore = defineStore('partners', () => {
  const config = useRuntimeConfig();
  const API_BASE_URL = config.public.pgsBaseAPI;

  const partners = ref<Partner[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Récupère une liste paginée ou tous les partenaires depuis l'API.
   * @param page Le numéro de la page à récupérer (ignoré si all est true).
   * @param limit Le nombre de partenaires par page (ignoré si all est true).
   * @param all Si true, tente de récupérer tous les partenaires.
   */
  async function fetchPartners(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (all) {
        let allFetchedPartners: Partner[] = [];
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
            data: Partner[];
          }>(`${API_BASE_URL}/solution/partner`, {
            params: { page: currentPage, limit: initialLimit }
          });

          allFetchedPartners = allFetchedPartners.concat(response.data);
          totalPages = response.totalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        partners.value = allFetchedPartners;

      } else {
        const response = await $fetch<{
          success: boolean;
          message: string;
          nb: number;
          nbOnPage: number;
          currentPage: number;
          totalPages: number;
          data: Partner[];
        }>(`${API_BASE_URL}/solution/partner`, {
          params: { page, limit }
        });

        partners.value = response.data;
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des partenaires: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  return {
    partners,
    loading,
    error,
    fetchPartners,
  };
});
