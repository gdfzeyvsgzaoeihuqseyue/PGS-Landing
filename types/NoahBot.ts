export interface ThinkingStep {
  step: number;
  description: string;
  type: 'reasoning' | 'web_search' | 'code_execution' | 'image_generation';
  data?: any;
  timestamp: string;
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: 'mistral' | 'gemini' | 'system';
  metadata?: ChatMessageMetadata;
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

export interface PageContext {
  url: string;
  title: string;
  description?: string;
  content: string;
}

// Types pour les réponses API Mistral
export interface MistralConversationResponse {
  object?: string;
  conversation_id?: string;
  outputs?: Array<{
    object?: string;
    type?: string; 
    created_at?: string;
    completed_at?: string;
    id?: string;
    model?: string;
    role?: string;
    content?: string | Array<{
      type: 'text' | 'tool_file';
      text?: string;
      tool?: string;
      file_id?: string;
      file_name?: string;
      file_type?: string;
    }>;
    name?: string;
    arguments?: string;
    function?: string;
    info?: any;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    connector_tokens?: number;
    connectors?: Record<string, number>;
  };
}

// Types pour les réponses API Gemini
export interface GeminiAPIResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
        executableCode?: {
          language?: string;
          code?: string;
        };
        codeExecutionResult?: {
          outcome?: string;
          output?: string;
        };
      }>;
      role?: string;
    };
    finishReason?: string;
    safetyRatings?: any[];
    groundingMetadata?: {
      webSearchQueries?: string[];
      groundingChunks?: Array<{
        web?: {
          uri?: string;
          title?: string;
        };
      }>;
      searchEntryPoint?: {
        renderedContent?: string;
      };
    };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
}

export interface APIResponse {
  content: string;
  agent: string;
  images?: string[];
  metadata?: {
    model?: string;
    tools_used?: string[];
    thinking_steps?: ThinkingStep[];
    web_search_results?: WebSearchResult[];
    tools_executed?: any[];
    finish_reason?: string;
    safety_ratings?: any[];
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      total_tokens?: number;
    };
  };
}

export interface ChatbotAPIResponse {
  content: string;
  agent: 'mistral' | 'gemini' | 'system';
  images?: string[];
  metadata?: ChatMessageMetadata;
}

export interface ChatMessageMetadata {
  model?: string;
  tools_used?: string[];
  thinking_steps?: ThinkingStep[];
  web_search_results?: WebSearchResult[];
  tools_executed?: Array<{
    name: string;
    status: 'success' | 'failed';
    result?: any;
  }>;
  finish_reason?: string;
  safety_ratings?: any[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  edit_count?: number;
  regeneration_count?: number;
}

export interface ConversationResponse {
  conversation: {
    id: number;
    session_id: string;
    context_page: string;
    created_at: string;
    updated_at: string;
  };
  messages: ChatMessage[];
  has_more: boolean;
  total_count: number;
}

export interface CreateConversationResponse {
  conversation: {
    id: number;
    session_id: string;
    context_page: string;
    user_agent: string;
    created_at: string;
  };
}

export interface CreateMessageResponse {
  message: {
    id: number;
    conversation_id: number;
    role: 'user' | 'assistant';
    content: string;
    agent?: string;
    created_at: string;
  };
}

export interface UpdateStatsResponse {
  stats: {
    id: number;
    conversation_id: number;
    total_messages: number;
    agent_used: string;
    response_time: number;
    updated_at: string;
  };
}
