import { H3Event } from 'h3';
import type { GeminiAPIResponse } from '@/types/chatbot';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messages, config: chatConfig } = body;

  const MODEL_ID = 'gemini-2.5-flash';
  const GENERATE_CONTENT_API = 'generateContent';
  const contents = [];
  
  // Ajouter le prompt système
  contents.push({
    role: 'user',
    parts: [{
      text: `Tu es un assistant virtuel intelligent pour Pro Gestion Soft (PGS), une entreprise qui développe des solutions numériques pour les PME africaines. 

Tu dois:
- Être professionnel, courtois et utile
- Répondre en français
- Connaître toutes les solutions PGS (SuitOps, etc.)
- Aider les utilisateurs à trouver la documentation appropriée
- Répondre aux questions techniques sur les solutions`
    }]
  });

  contents.push({
    role: 'model',
    parts: [{
      text: 'Compris! Je suis prêt à vous aider avec Pro Gestion Soft.'
    }]
  });

  // Ajouter les messages de la conversation
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  const requestBody = {
    contents,
    generationConfig: {
      temperature: chatConfig?.temperature || 0.7,
      maxOutputTokens: chatConfig?.maxTokens || 2048,
      topP: 0.95,
      topK: 40,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }
    ]
  };

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${config.geminiApiKey}`;
    
    const response = await $fetch(apiUrl, {
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
        if (part.text) {
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
        finish_reason: response.candidates?.[0]?.finishReason,
        safety_ratings: response.candidates?.[0]?.safetyRatings,
      },
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', error.data);
    
    // Extraire le message d'erreur de Gemini
    const errorMessage = error.data?.error?.message || error.message || 'Erreur inconnue';
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Erreur lors de la communication avec Gemini AI',
      data: errorMessage,
    });
  }
});
