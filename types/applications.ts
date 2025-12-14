export interface Solution {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  content: string;
  logo: string;
  logoDesk?: string;
  disabled: boolean;
  ctaText: string;
  ctaLink: string;
  features?: string[];
  docs?: { name: string; link: string }[];
  faqTopics?: FaqTopic[];
  tutorials?: { title: string; description: string; time: string; link: string; thumbnail?: string; }[];
  wiki?: PlateformWiki[];
  partners?: Partner[];
  testimonies?: Testimony[];
  createdAt: string;
  updatedAt: string;
  allowAuth: boolean;
  authType: 'user' | 'learner' | 'all';
}

export interface PlatformInfo {
  id: string;
  name: string;
  slug: string;
  category?: string;
  logo?: string;
  logoDesk?: string;
}

export interface PlateformDoc {
  id: string;
  name: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
}

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

export interface PlateformFaq extends Faq {
  platform: PlatformInfo;
}

export interface PlateformTutorial {
  id: string;
  title: string;
  description: string;
  time: string;
  link: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
}

export interface PlateformWiki {
  id: string;
  name: string;
  description: string;
  url: string;
  slug: string;
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
  order?: number;
}

export interface Partner {
  id: string;
  name: string;
  website: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
}

export interface Testimony {
  id: string;
  author: string;
  company?: string;
  role?: string;
  content: string;
  note?: number;
  avatar?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
}
