import type { PlatformInfo } from './applications';

/**
 * Interface représentant une FAQ (Question fréquente)
 */
export interface Faq {
  id: string;
  question: string;
  answer: string;
  status?: 'active' | 'inactive';
  isUseful: number;
  isUseless: number;
  topic?: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface représentant un sujet/topic de FAQ
 */
export interface FaqTopic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  platform: PlatformInfo;
  faqs?: Faq[];
  faqCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Interface pour une FAQ liée à une plateforme
 */
export interface PlateformFaq extends Faq {
  platform: PlatformInfo;
}

/**
 * Interface pour le vote sur une FAQ
 */
export interface FaqVote {
  faqId: string;
  type: 'useful' | 'useless';
}

/**
 * Interface pour la réponse d'un vote
 */
export interface FaqVoteResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    isUseful: number;
    isUseless: number;
    totalVotes: number;
  };
}

/**
 * Interface pour les filtres de FAQ
 */
export interface FaqFilters {
  search?: string;
  platform?: string;
  topic?: string;
  status?: 'active' | 'inactive';
}

/**
 * Interface pour les statistiques de FAQ
 */
export interface FaqStats {
  totalFaqs: number;
  totalTopics: number;
  totalPlatforms: number;
  totalVotes: number;
  usefulVotes: number;
  uselessVotes: number;
}
