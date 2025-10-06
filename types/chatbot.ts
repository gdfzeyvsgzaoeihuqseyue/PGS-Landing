export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  agent?: 'mistral' | 'gemini' | 'system';
  metadata?: {
    tools_used?: string[];
    images?: string[];
    code_snippets?: string[];
    search_results?: any[];
    model?: string;
    has_images?: boolean;
  };
  images?: string[];
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatbotConfig {
  agent: 'mistral' | 'gemini' | 'auto';
  enableImageGeneration: boolean;
  enableWebSearch: boolean;
  enableCodeInterpreter: boolean;
  temperature: number;
  maxTokens: number;
}

// Types pour les réponses API
export interface MistralAPIResponse {
  choices?: Array<{
    message?: {
      content?: string;
      tool_calls?: Array<{
        function?: {
          name?: string;
          arguments?: any;
        };
      }>;
    };
  }>;
}

export interface GeminiAPIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}
