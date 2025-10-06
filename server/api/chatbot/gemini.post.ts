import { H3Event } from 'h3';
import type { GeminiAPIResponse } from '@/types/chatbot';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messages, config: chatConfig } = body;

  const MODEL_ID = 'gemini-2.5-flash-image';
  const GENERATE_CONTENT_API = 'generateContent';
  
  // Convertir les messages au format Gemini
  const contents = messages.map((msg: any) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [
      {
        text: msg.content,
      },
    ],
  }));

  // Ajouter le prompt système au début
  contents.unshift({
    role: 'user',
    parts: [
      {
        text: `Tu es un assistant virtuel intelligent pour Pro Gestion Soft (PGS), une entreprise qui développe des solutions numériques pour les PME africaines. 
      
Tu dois:
- Être professionnel, courtois et utile
- Répondre en français
- Connaître toutes les solutions PGS (SuitOps, etc.)
- Aider les utilisateurs à trouver la documentation appropriée
- Répondre aux questions techniques sur les solutions
- Générer des images si nécessaire pour mieux expliquer des concepts visuels`,
      },
    ],
  });

  const requestBody = {
    contents,
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: chatConfig.temperature || 0.7,
      maxOutputTokens: chatConfig.maxTokens || 2048,
    },
  };

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${config.geminiApiKey}`;
    
    const response = await $fetch<GeminiAPIResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    let textContent = '';
    const images: string[] = [];

    // Parser la réponse
    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          // Convertir l'image en data URL
          const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          images.push(dataUrl);
        } else if (part.text) {
          textContent += part.text;
        }
      }
    }

    return {
      content: textContent || 'Désolé, je n\'ai pas pu générer une réponse.',
      agent: 'gemini',
      images,
      metadata: {
        model: MODEL_ID,
        has_images: images.length > 0,
        images: images,
      },
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Extraire le message d'erreur de Gemini
    const errorMessage = error.data?.error?.message || error.message || 'Erreur inconnue';
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Erreur lors de la communication avec Gemini AI',
      data: errorMessage,
    });
  }
});
