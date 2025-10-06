import { H3Event } from 'h3';
import type { MistralAPIResponse } from '@/types/chatbot';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messages, config: chatConfig } = body;

  const mistralRequest = {
    model: 'mistral-large-latest',
    inputs: messages,
    tools: [
      ...(chatConfig.enableCodeInterpreter ? [{ type: 'code_interpreter' }] : []),
      ...(chatConfig.enableImageGeneration ? [{ type: 'image_generation' }] : []),
      ...(chatConfig.enableWebSearch ? [{ type: 'web_search', openResults: false }] : []),
    ],
    completion_args: {
      temperature: chatConfig.temperature || 0.7,
      max_tokens: chatConfig.maxTokens || 2048,
      top_p: 1,
    },
    stream: false,
    instructions: `Tu es un assistant virtuel intelligent pour Pro Gestion Soft (PGS), une entreprise qui développe des solutions numériques pour les PME africaines. 
    
Tu dois:
- Être professionnel, courtois et utile
- Répondre en français
- Connaître toutes les solutions PGS (SuitOps, etc.)
- Aider les utilisateurs à trouver la documentation appropriée
- Répondre aux questions techniques sur les solutions
- Générer des images ou du code si nécessaire pour mieux expliquer
- Effectuer des recherches web si tu as besoin d'informations à jour`,
  };

  try {
    const response = await $fetch<MistralAPIResponse>('https://api.mistral.ai/v1/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.mistralApiKey,
      },
      body: mistralRequest,
    });

    // Extraire les images générées si présentes
    const images: string[] = [];
    const toolsUsed: string[] = [];
    const toolCalls = response.choices?.[0]?.message?.tool_calls || [];
    
    for (const toolCall of toolCalls) {
      if (toolCall.function?.name) {
        toolsUsed.push(toolCall.function.name);
        
        if (toolCall.function.name === 'image_generation') {
          const imageData = toolCall.function.arguments;
          if (imageData?.image_url) {
            images.push(imageData.image_url);
          }
        }
      }
    }

    return {
      content: response.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse.',
      agent: 'mistral',
      images,
      metadata: {
        tools_used: toolsUsed,
        images: images,
        model: mistralRequest.model,
      },
    };
  } catch (error: any) {
    console.error('Mistral API Error:', error);
    
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la communication avec Mistral AI',
      data: error.message,
    });
  }
});
