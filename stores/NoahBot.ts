import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChatMessage, ChatbotConfig, ChatbotAPIResponse, ChatMessageMetadata } from '@/types';
import { usePageContext } from '@/composables/usePageContext';

export const useChatbotStore = defineStore('chatbot', () => {
  const messages = ref<ChatMessage[]>([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const sessionId = ref<string>('');
  const conversationId = ref<number | null>(null);
  const contextPage = ref<string>('');
  const hasMoreMessages = ref(false);
  const isLoadingMore = ref(false);
  const currentPage = ref(1);
  const termsAccepted = ref<boolean>(false);

  const config = ref<ChatbotConfig>({
    agent: 'auto',
    enableImageGeneration: true,
    enableWebSearch: true,
    enableCodeInterpreter: true,
    temperature: 0.7,
    maxTokens: 2048,
  });

  const { capturePageContext, isContextRelevant } = usePageContext();

  // Vérifier si l'utilisateur a accepté les conditions
  const checkTermsAcceptance = (): boolean => {
    try {
      const accepted = localStorage.getItem('noah_terms_accepted');
      termsAccepted.value = accepted === 'true';
      return termsAccepted.value;
    } catch (error) {
      console.error('Impossible de vérifier le statut de validation des conditions:', error);
      return false;
    }
  };

  // Accepter les conditions d'utilisation
  const acceptTerms = async () => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI) {
      console.warn('API PGS non configuré, stockage en localstorage uniquement');
      localStorage.setItem('noah_terms_accepted', 'true');
      termsAccepted.value = true;
      return;
    }

    try {
      if (!sessionId.value) {
        sessionId.value = generateSessionId();
      }
      if (!conversationId.value) {
        await createConversationInAPI();
      }

      await $fetch(`${pgsBaseAPI}/chatbot/accept-terms`, {
        method: 'POST',
        body: {
          conversationId: conversationId.value,
        },
      });

      localStorage.setItem('noah_terms_accepted', 'true');
      termsAccepted.value = true;
    } catch (error: any) {
      console.error('Failed to accept terms:', error);

      // Stocker localement si l'API n'est pas disponible
      if (error.statusCode === 400 || error.statusCode === 404 || error.statusCode === 500) {
        console.warn('API PGS non disponible, stockage en local effectué');
        localStorage.setItem('noah_terms_accepted', 'true');
        termsAccepted.value = true;
      } else {
        throw error;
      }
    }
  };

  // Réinitialiser l'acceptation des conditions
  const resetTermsAcceptance = async () => {
    try {
      localStorage.removeItem('noah_terms_accepted');
      termsAccepted.value = false;
    } catch (error) {
      console.error('Impossible de rénitialiser les conditions:', error);
    }
  };

  // Générer un ID de session unique
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialiser une nouvelle conversation
  const initConversation = async (page?: string) => {
    if (!sessionId.value) {
      sessionId.value = generateSessionId();
      contextPage.value = page || window.location.pathname;

      checkTermsAcceptance();

      await loadConversationFromAPI();
    }
  };

  // Charger la conversation depuis l'API
  const loadConversationFromAPI = async () => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI) {
      loadConversationHistoryLocal();
      return;
    }

    try {
      const response: any = await $fetch(`${pgsBaseAPI}/chatbot/conversations`, {
        method: 'GET',
        params: {
          session_id: sessionId.value,
          context_page: contextPage.value,
          page: 1,
          limit: 20,
        },
      });

      if (response.conversation) {
        conversationId.value = response.conversation.id;
        messages.value = response.messages.reverse();
        hasMoreMessages.value = response.has_more;
        currentPage.value = 1;
      } else {
        loadConversationHistoryLocal();
      }
    } catch (error) {
      console.warn('Impossible de charger la connversation depuis l\'API, utilisation du localStorage:', error);
      loadConversationHistoryLocal();
    }
  };

  // Charger plus de messages
  const loadMoreMessages = async () => {
    if (isLoadingMore.value || !hasMoreMessages.value) return;

    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI || !conversationId.value) return;

    isLoadingMore.value = true;

    try {
      const response: any = await $fetch(`${pgsBaseAPI}/chatbot/conversations`, {
        method: 'GET',
        params: {
          conversation_id: conversationId.value,
          page: currentPage.value + 1,
          limit: 20,
        },
      });

      if (response.messages && response.messages.length > 0) {
        messages.value = [...response.messages.reverse(), ...messages.value];
        hasMoreMessages.value = response.has_more;
        currentPage.value += 1;
      }
    } catch (error) {
      console.error('Impossible de charger plus de messages:', error);
    } finally {
      isLoadingMore.value = false;
    }
  };

  // Charger l'historique depuis localStorage (fallback)
  const loadConversationHistoryLocal = () => {
    try {
      const saved = localStorage.getItem(`noah_conversation_${contextPage.value}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages && Array.isArray(parsed.messages)) {
          messages.value = parsed.messages.slice(-50);
          conversationId.value = parsed.conversation_id || null;
        }
      }
    } catch (error) {
      console.error('Impossible de charger l\'historique de la cnversation:', error);
    }
  };

  // Sauvegarder l'historique dans localStorage
  const saveConversationHistoryLocal = () => {
    try {
      const data = {
        session_id: sessionId.value,
        conversation_id: conversationId.value,
        messages: messages.value.slice(-50),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`noah_conversation_${contextPage.value}`, JSON.stringify(data));
    } catch (error) {
      console.error('Impossible de sauvegarder l\'histrique de la conversation:', error);
    }
  };

  // Créer une conversation dans l'API
  const createConversationInAPI = async () => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI) return;

    try {
      const response: any = await $fetch(`${pgsBaseAPI}/chatbot/create-conversation`, {
        method: 'POST',
        body: {
          sessionId: sessionId.value,
          siteIdentifier: 'pgs',
          contextPage: contextPage.value,
          termsAccepted: termsAccepted.value,
        },
      });

      conversationId.value = response.data.id;
      return response.data;
    } catch (error) {
      console.error('Impossible de créer la conversation:', error);
      throw error;
    }
  };

  // Créer un message dans l'API
  const createMessageInAPI = async (message: ChatMessage) => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI || !conversationId.value) return;

    try {
      await $fetch(`${pgsBaseAPI}/chatbot/create-message`, {
        method: 'POST',
        body: {
          conversationId: conversationId.value,
          role: message.role,
          content: message.content,
          agent: message.agent,
          metadata: message.metadata,
          images: message.images,
          messageTimestamp: message.timestamp,
        },
      });
    } catch (error) {
      console.warn('Impossible d\'ajouter un message:', error);
    }
  };

  // Mettre à jour les statistiques
  const updateStatsInAPI = async (statsData: {
    total_messages: number;
    agent_used: string;
    response_time?: number;
    tokens_used?: number;
  }) => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (!pgsBaseAPI || !conversationId.value) return;

    try {
      await $fetch(`${pgsBaseAPI}/chatbot/update-stats`, {
        method: 'POST',
        body: {
          conversation_id: conversationId.value,
          ...statsData,
        },
      });
    } catch (error) {
      console.warn('Impossible de mettre à jour les statistiques:', error);
    }
  };

  // Détection automatique du meilleur agent
  const detectBestAgent = (content: string): 'mistral' | 'gemini' => {
    const lowerContent = content.toLowerCase();

    // Génération d'images (Mistral)
    const imageKeywords = [
      'génère une image', 'crée une image', 'dessine', 'génération d\'image',
      'créer une image', 'generate image', 'draw', 'illustration visuelle'
    ];

    // Recherche web approfondie (Gemini meilleur)
    const webSearchKeywords = [
      'recherche', 'cherche sur internet', 'trouve sur le web',
      'actualités', 'dernières infos', 'quoi de neuf'
    ];

    const hasImageKeyword = imageKeywords.some(kw => lowerContent.includes(kw));
    const hasWebSearchKeyword = webSearchKeywords.some(kw => lowerContent.includes(kw));

    // Si demande explicite de génération d'image, utiliser Mistral
    if (hasImageKeyword) {
      return 'mistral';
    }

    // Si demande de recherche web, privilégier Gemini
    if (hasWebSearchKeyword) {
      return 'gemini';
    }

    // Par défaut, utiliser Mistral
    return 'mistral';
  };

  // Envoyer un message
  const sendMessage = async (content: string, forcedAgent?: 'mistral' | 'gemini') => {
    if (!termsAccepted.value) {
      throw new Error('Terms not accepted');
    }

    if (!sessionId.value) {
      await initConversation();
    }

    if (!conversationId.value) {
      await createConversationInAPI();
    }

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    messages.value.push(userMessage);
    isLoading.value = true;

    await createMessageInAPI(userMessage);

    try {
      // Déterminer l'agent à utiliser
      let selectedAgent: 'mistral' | 'gemini';

      if (forcedAgent) {
        selectedAgent = forcedAgent;
      } else if (config.value.agent === 'auto') {
        selectedAgent = detectBestAgent(content);
        console.log(`Mode Auto: Agent sélectionné = ${selectedAgent}`);
      } else {
        selectedAgent = config.value.agent as 'mistral' | 'gemini';
        console.log(`Mode Manuel: Agent sélectionné = ${selectedAgent}`);
      }

      // Capturer le contexte de page si pertinent
      let pageContext = null;
      if (isContextRelevant(content)) {
        pageContext = capturePageContext();
        console.log('Contexte de page capturé:', pageContext);
      }

      const endpoint = selectedAgent === 'gemini'
        ? '/api/chatbot/gemini'
        : '/api/chatbot/mistral';

      const response = await $fetch<ChatbotAPIResponse>(endpoint, {
        method: 'POST',
        body: {
          messages: messages.value.map(m => ({
            role: m.role,
            content: m.content,
          })),
          config: config.value,
          sessionId: sessionId.value,
          contextPage: contextPage.value,
          pageContext: pageContext,
        },
      });

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.content || '',
        agent: selectedAgent,
        metadata: response.metadata,
        images: response.images,
        timestamp: new Date().toISOString(),
      };

      messages.value.push(assistantMessage);

      await createMessageInAPI(assistantMessage);

      await updateStatsInAPI({
        total_messages: messages.value.length,
        agent_used: selectedAgent,
        response_time: 0,
        tokens_used: response.metadata?.usage?.total_tokens || 0,
      });

      saveConversationHistoryLocal();

      return assistantMessage;
    } catch (error: any) {
      console.error('Error sending message:', error);

      // Message d'erreur plus détaillé
      let errorContent = 'Désolé, une erreur est survenue. Veuillez réessayer.';

      if (error.statusCode === 429) {
        errorContent = 'Limite de requêtes atteinte. Veuillez patienter quelques instants ou changer d\'agent.';
      } else if (error.statusCode === 500) {
        errorContent = 'Impossible de joindre le service IA. Veuillez contacter le support pour le lui notifier.';
      } else if (error.message) {
        errorContent = `Erreur: ${error.message}`;
      }

      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: errorContent,
        agent: 'system',
        timestamp: new Date().toISOString(),
      };

      messages.value.push(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Régénérer un message
  const regenerateMessage = async (messageId: string) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const messageToRegenerate = messages.value[messageIndex];
    const currentRegenerationCount = messageToRegenerate.metadata?.regeneration_count || 0;

    // Trouver le message utilisateur précédent
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages.value[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }

    if (userMessageIndex < 0) return;

    const userMessage = messages.value[userMessageIndex];

    // Supprimer le message à régénérer et tous les suivants
    messages.value = messages.value.slice(0, messageIndex);

    // Envoyer le message avec le même agent si disponible
    const forcedAgent = messageToRegenerate.agent as 'mistral' | 'gemini' | undefined;
    const newMessage = await sendMessage(userMessage.content, forcedAgent);

    // Incrémenter le compteur de régénération sur le nouveau message
    if (newMessage) {
      if (!newMessage.metadata) {
        newMessage.metadata = {};
      }
      newMessage.metadata.regeneration_count = currentRegenerationCount + 1;

      // Mettre à jour dans le tableau
      const lastIndex = messages.value.length - 1;
      if (lastIndex >= 0 && messages.value[lastIndex].id === newMessage.id) {
        messages.value[lastIndex] = newMessage;
      }

      saveConversationHistoryLocal();
    }
  };

  // Modifier un message utilisateur
  const editMessage = async (messageId: string, newContent: string) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const originalMessage = messages.value[messageIndex];
    const editCount = (originalMessage.metadata?.edit_count || 0) + 1;

    // Supprimer ce message et tous les suivants
    messages.value = messages.value.slice(0, messageIndex);

    // Créer le nouveau message avec le compteur
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: newContent,
      timestamp: new Date().toISOString(),
      metadata: {
        edit_count: editCount
      }
    };

    messages.value.push(userMessage);

    saveConversationHistoryLocal();

    // Envoyer le nouveau message
    await sendMessage(newContent);
  };

  // Copier un message
  const copyMessage = async (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId);
    if (!message) return;

    try {
      await navigator.clipboard.writeText(message.content);
      return true;
    } catch (error) {
      console.error('Impossible de copier le message:', error);
      return false;
    }
  };

  // Effacer toutes les conversations de l'utilisateur
  const deleteAllConversations = async () => {
    const runtimeConfig = useRuntimeConfig();
    const pgsBaseAPI = runtimeConfig.public.pgsBaseAPI;

    if (pgsBaseAPI) {
      try {
        await $fetch(`${pgsBaseAPI}/chatbot/delete-conversations`, {
          method: 'DELETE',
          body: {
            session_id: sessionId.value,
          },
        });
      } catch (error) {
        console.error('Impossible de supprimer toutes les conversation depuis l\'API:', error);
      }
    }

    // Effacer le localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('noah_conversation_')) {
        localStorage.removeItem(key);
      }
    });

    resetConversation();
  };

  // Toggle chatbot
  const toggleChatbot = () => {
    isOpen.value = !isOpen.value;
  };

  // Réinitialiser la conversation
  const resetConversation = () => {
    messages.value = [];
    sessionId.value = '';
    conversationId.value = null;
    contextPage.value = '';
    currentPage.value = 1;
    hasMoreMessages.value = false;

    // Effacer localStorage
    try {
      if (contextPage.value) {
        localStorage.removeItem(`noah_conversation_${contextPage.value}`);
      }
    } catch (error) {
      console.error('Impossible de nettoyer le localStorage:', error);
    }
  };

  return {
    messages,
    isOpen,
    isLoading,
    isLoadingMore,
    hasMoreMessages,
    sessionId,
    conversationId,
    config,
    termsAccepted,
    initConversation,
    sendMessage,
    regenerateMessage,
    editMessage,
    copyMessage,
    toggleChatbot,
    resetConversation,
    checkTermsAcceptance,
    acceptTerms,
    resetTermsAcceptance,
    loadMoreMessages,
    deleteAllConversations,
  };
});
