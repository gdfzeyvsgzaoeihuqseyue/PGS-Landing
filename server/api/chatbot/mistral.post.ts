import { H3Event } from 'h3';
import type { MistralAPIResponse } from '@/types/chatbot';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messages, config: chatConfig } = body;

  const mistralMessages = messages.map((msg: any) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Ajouter le prompt système au début
  mistralMessages.unshift({
    role: 'system',
    content: `Tu es un assistant virtuel intelligent pour Pro Gestion Soft (PGS), une entreprise qui développe des solutions numériques pour les PME africaines. 

Tu dois:
- Être professionnel, courtois et utile
- Répondre en français
- Connaître toutes les solutions PGS (SuitOps, etc.)
- Aider les utilisateurs à trouver la documentation appropriée
- Répondre aux questions techniques sur les solutions
- Être concis et précis dans tes réponses`
  });

  const mistralRequest = {
    model: 'mistral-large-latest',
    messages: mistralMessages,
    temperature: chatConfig?.temperature || 0.7,
    max_tokens: chatConfig?.maxTokens || 2048,
    top_p: 1,
  };

  try {
    const response = await $fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.mistralApiKey}`,
      },
      body: mistralRequest,
    });

    return {
      content: response.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.',
      agent: 'mistral',
      images: [],
      metadata: {
        model: mistralRequest.model,
        finish_reason: response.choices?.[0]?.finish_reason,
        usage: response.usage,
      },
    };
  } catch (error: any) {
    console.error('Mistral API Error:', error);
    console.error('Error details:', error.data);
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Erreur lors de la communication avec Mistral AI',
      data: error.data || error.message,
    });
  }
});
