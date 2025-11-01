import { defineStore } from 'pinia';
import { useApiFetch } from '~/utils/api';
import { ref } from 'vue';
import type { Event } from '@/types';
import { useRuntimeConfig } from '#app';

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([]);
  const currentEvent = ref<Event | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    limit: 10, 
  });

  /**
   * Récupère une liste paginée ou tous les événements depuis l'API.
   * @param page Le numéro de la page à récupérer (ignoré si all est true).
   * @param limit Le nombre d'événements par page (ignoré si all est true).
   * @param all Si true, tente de récupérer tous les événements.
   */
  async function fetchEvents(page: number = 1, limit: number = 10, all: boolean = false) {
    loading.value = true;
    error.value = null;
    try {
      if (all) {
        let allFetchedEvents: Event[] = [];
        let currentPage = 1;
        let totalPages = 1;
        const initialLimit = 100; 

        do {
          const response = await useApiFetch<{
            success: boolean;
            message: string;
            nb: number;
            nbOnPage: number;
            currentPage: number;
            totalPages: number;
            data: Event[];
          }>(`/event`, {
            params: { page: currentPage, limit: initialLimit }
          });

          allFetchedEvents = allFetchedEvents.concat(response.data);
          totalPages = response.totalPages;
          currentPage++;
        } while (currentPage <= totalPages);

        events.value = allFetchedEvents;
        pagination.value = {
          currentPage: 1, 
          totalPages: 1, 
          totalEvents: allFetchedEvents.length,
          limit: allFetchedEvents.length, 
        };

      } else {
        const response = await useApiFetch<{
          success: boolean;
          message: string;
          nb: number;
          nbOnPage: number;
          currentPage: number;
          totalPages: number;
          data: Event[];
        }>(`/event`, {
          params: { page, limit }
        });

        events.value = response.data;
        pagination.value = {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalEvents: response.nb,
          limit: limit,
        };
      }
    } catch (err: any) {
      error.value = 'Erreur lors du chargement des événements: ' + (err.data?.message || err.message);
      console.error(error.value, err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Récupère un événement spécifique par son ID.
   * @param id L'ID de l'événement à récupérer.
   */
  async function fetchEventById(id: string) {
    loading.value = true;
    error.value = null;
    currentEvent.value = null; 
    try {
      const response = await useApiFetch<{
        success: boolean;
        message: string;
        data: Event;
      }>(`/event/${id}`);

      currentEvent.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = 'Erreur lors du chargement de l\'événement: ' + (err.data?.message || err.message);
      console.error(error.value, err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  return {
    events,
    currentEvent,
    loading,
    error,
    pagination,
    fetchEvents,
    fetchEventById,
  };
});
