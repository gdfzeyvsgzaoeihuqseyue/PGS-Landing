import { H3Event } from 'h3';
import type { GeminiAPIResponse, ThinkingStep, WebSearchResult } from '@/types';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { messages, config: chatConfig, pageContext } = body;

  const MODEL_ID = 'gemini-2.5-flash';
  const GENERATE_CONTENT_API = 'generateContent';
  const contents = [];

  let systemInstruction = `Tu es NOAH AI, un assistant virtuel intelligent pour Pro Gestion Soft (PGS), une entreprise qui développe des solutions numériques pour les PME africaines.

Tu dois:
- Être professionnel, courtois et utile
- Répondre en français avec un formatage Markdown élégant
- Connaître toutes les solutions PGS (SuitOps, etc.)
- Aider les utilisateurs à trouver la documentation appropriée
- Répondre aux questions techniques sur les solutions
- Être concis et précis dans tes réponses
- Utiliser des titres (###), des listes à puces, du gras (**texte**) et des liens quand approprié
- Structurer tes réponses de manière claire et professionnelle`;

  if (pageContext) {
    systemInstruction += `\n\nContexte de la page actuelle:
Titre: ${pageContext.title}
URL: ${pageContext.url}
Contenu: ${pageContext.content}`;
  }

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

  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  const tools: any[] = [];

  if (chatConfig?.enableWebSearch) {
    tools.push({ googleSearch: {} });
  }

  if (chatConfig?.enableCodeInterpreter) {
    tools.push({ codeExecution: {} });
  }

  tools.push({ urlContext: {} });

  const requestBody: any = {
    contents,
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      temperature: chatConfig?.temperature || 0.7,
      maxOutputTokens: chatConfig?.maxTokens || 2048,
      topP: 0.95,
      topK: 40,
    },
    tools: tools,
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

    const response = await $fetch<GeminiAPIResponse>(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    let textContent = '';
    const images: string[] = [];
    const thinkingSteps: ThinkingStep[] = [];
    const toolsUsed: string[] = [];
    const webSearchResults: WebSearchResult[] = [];
    let toolsExecuted: any[] = [];

    // MODIFICATION: Vérifier que candidates existe avant d'y accéder
    if (response.candidates && response.candidates.length > 0 && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          textContent += part.text;
        }

        if (part.executableCode) {
          toolsUsed.push('code_interpreter');

          thinkingSteps.push({
            step: thinkingSteps.length + 1,
            description: 'Exécution de code',
            type: 'code_execution',
            data: {
              language: part.executableCode.language,
              code: part.executableCode.code
            },
            timestamp: new Date().toISOString()
          });
        }

        if (part.codeExecutionResult) {
          toolsExecuted.push({
            name: 'code_execution',
            status: part.codeExecutionResult.outcome === 'OUTCOME_OK' ? 'success' : 'failed',
            result: part.codeExecutionResult
          });
        }
      }
    }

    // MODIFICATION: Vérifier que candidates[0] existe avant d'accéder à groundingMetadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata) {
      if (groundingMetadata.webSearchQueries && groundingMetadata.webSearchQueries.length > 0) {
        toolsUsed.push('web_search');

        groundingMetadata.webSearchQueries.forEach(query => {
          thinkingSteps.push({
            step: thinkingSteps.length + 1,
            description: `Recherche web: ${query}`,
            type: 'web_search',
            data: query,
            timestamp: new Date().toISOString()
          });
        });
      }

      if (groundingMetadata.groundingChunks && groundingMetadata.groundingChunks.length > 0) {
        groundingMetadata.groundingChunks.forEach(chunk => {
          if (chunk.web) {
            webSearchResults.push({
              title: chunk.web.title || '',
              url: chunk.web.uri || '',
              snippet: ''
            });
          }
        });

        toolsExecuted.push({
          name: 'web_search',
          status: 'success',
          result: groundingMetadata.groundingChunks
        });
      }
    }

    const usage = response.usageMetadata ? {
      prompt_tokens: response.usageMetadata.promptTokenCount,
      completion_tokens: response.usageMetadata.candidatesTokenCount,
      total_tokens: response.usageMetadata.totalTokenCount
    } : undefined;

    return {
      content: textContent || 'Désolé, je n\'ai pas pu générer une réponse.',
      agent: 'gemini',
      images: images,
      metadata: {
        model: MODEL_ID,
        tools_used: [...new Set(toolsUsed)],
        thinking_steps: thinkingSteps,
        web_search_results: webSearchResults,
        tools_executed: toolsExecuted,
        finish_reason: response.candidates?.[0]?.finishReason,
        safety_ratings: response.candidates?.[0]?.safetyRatings,
        usage: usage,
      },
    };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    console.error('Error details:', error.data);

    const errorMessage = error.data?.error?.message || error.message || 'Erreur inconnue';

    throw createError({
      statusCode: error.statusCode || 500,
      message: 'Erreur lors de la communication avec Gemini AI',
      data: errorMessage,
    });
  }
});
