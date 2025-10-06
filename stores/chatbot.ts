import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChatMessage, ChatbotConfig } from '@/types/chatbot';

export const useChatbotStore = defineStore('chatbot', () => {
  // État local uniquement
  const messages = ref<ChatMessage[]>([]);
  const isOpen = ref(false);
  const isLoading = ref(false);
  const sessionId = ref<string>('');
  const contextPage = ref<string>('');
  
  const config = ref<ChatbotConfig>({
    agent: 'auto',
    enableImageGeneration: true,
    enableWebSearch: true,
    enableCodeInterpreter: true,
    temperature: 0.7,
    maxTokens: 2048,
  });

  // Générer un ID de session unique
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Initialiser une nouvelle conversation
  const initConversation = (page?: string) => {
    if (!sessionId.value) {
      sessionId.value = generateSessionId();
      contextPage.value = page || window.location.pathname;
    }
  };

  // Détecter l'agent approprié selon le contenu
  const detectBestAgent = (content: string): 'mistral' | 'gemini' => {
    const lowerContent = content.toLowerCase();
    
    // Keywords pour Gemini (génération d'images, visuel)
    const geminiKeywords = [
      'image', 'photo', 'illustration', 'dessin', 'visuel', 
      'graphique', 'schéma', 'diagramme', 'génère', 'crée une image'
    ];
    
    // Keywords pour Mistral (code, recherche, analyse)
    const mistralKeywords = [
      'code', 'fonction', 'algorithme', 'recherche', 'cherche',
      'trouve', 'web', 'internet', 'documentation'
    ];

    const hasGeminiKeyword = geminiKeywords.some(kw => lowerContent.includes(kw));
    const hasMistralKeyword = mistralKeywords.some(kw => lowerContent.includes(kw));

    // Si les deux ou aucun, préférer Mistral (plus polyvalent)
    if (hasMistralKeyword || (!hasGeminiKeyword && !hasMistralKeyword)) {
      return 'mistral';
    }

    return 'gemini';
  };

  // Envoyer un message
  const sendMessage = async (content: string, forcedAgent?: 'mistral' | 'gemini') => {
    if (!sessionId.value) {
      initConversation();
    }

    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    messages.value.push(userMessage);
    isLoading.value = true;

    try {
      // Déterminer l'agent à utiliser
      let selectedAgent: 'mistral' | 'gemini';
      
      if (forcedAgent) {
        selectedAgent = forcedAgent;
      } else if (config.value.agent === 'auto') {
        selectedAgent = detectBestAgent(content);
      } else {
        selectedAgent = config.value.agent;
      }

      const endpoint = selectedAgent === 'gemini' 
        ? '/api/chatbot/gemini' 
        : '/api/chatbot/mistral';

      const response = await $fetch(endpoint, {
        method: 'POST',
        body: {
          messages: messages.value.map(m => ({
            role: m.role,
            content: m.content,
          })),
          config: config.value,
          sessionId: sessionId.value,
          contextPage: contextPage.value,
        },
      });

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.content,
        agent: selectedAgent,
        metadata: response.metadata,
        images: response.images,
        timestamp: new Date().toISOString(),
      };

      messages.value.push(assistantMessage);

      // Optionnel: sauvegarder dans PGS API si nécessaire plus tard
      await saveConversationToPGSAPI();

      return assistantMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Message d'erreur
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        agent: 'system',
        timestamp: new Date().toISOString(),
      };
      
      messages.value.push(errorMessage);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Sauvegarder la conversation dans PGS API (optionnel, pour plus tard)
  const saveConversationToPGSAPI = async () => {
    const config = useRuntimeConfig();
    const pgsBaseAPI = config.public.pgsBaseAPI;

    if (!pgsBaseAPI) return; // Pas d'API configurée

    try {
      await $fetch(`${pgsBaseAPI}/chatbot/conversations`, {
        method: 'POST',
        body: {
          session_id: sessionId.value,
          context_page: contextPage.value,
          messages: messages.value,
        },
      });
    } catch (error) {
      // Échec silencieux - pas critique
      console.warn('Failed to save conversation to PGS API:', error);
    }
  };

  // Toggle chatbot
  const toggleChatbot = () => {
    isOpen.value = !isOpen.value;
  };

  // Réinitialiser la conversation
  const resetConversation = () => {
    messages.value = [];
    sessionId.value = '';
    contextPage.value = '';
  };

  return {
    messages,
    isOpen,
    isLoading,
    sessionId,
    config,
    initConversation,
    sendMessage,
    toggleChatbot,
    resetConversation,
  };
});
