// ===============================================
// APPLICATIONS
// ===============================================
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
  faq?: { question: string; answer: string }[];
  tutorials?: { title: string; description: string; time: string; link: string; thumbnail?: string; }[];
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  logo: string;
  logoDesk?: string;
  category: string;
  description?: string;
}

export interface PlatformInfo {
  id: string;
  name: string;
  slug: string;
  category?: string;
  logo?: string;
}

export interface PlateformDoc {
  id: string;
  name: string;
  link: string;
  createdAt: string;
  updatedAt: string;
  platform: PlatformInfo;
}

export interface PlateformFaq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
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

// ===============================================
// LIENS UTILES
// ===============================================
export interface UsefulLink {
  id: string;
  name: string;
  description: string;
  platformId: string;
  url: string;
  slug: string;
  additionalInfo?: string;
}

export interface UsefulLinksState {
  links: UsefulLink[]
  loading: boolean
  error: string | null
}

export type EnrichedLink = UsefulLink & {
  order: number;
  platform: string;
  platformLogo: string;
  platformCategory?: string;
};


// ===============================================
// BLOG
// ===============================================
export interface Author {
  id: string; 
  slug: string;
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
  };
  createdAt?: string; 
  updatedAt?: string; 
  articleCount?: number; 
}

export interface Category {
  id: string; 
  name: string;
  slug: string;
  createdAt?: string; 
  updatedAt?: string; 
  articleCount?: number; 
}

export interface Article {
  id: string; 
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  tags: string[];
  imageAlt?: string;
  views: number; 
  createdAt: string; 
  updatedAt: string; 
  author: Author; 
  category: Category; 
}


// ===============================================
// EVENEMENT
// ===============================================
export interface Event {
  id: string;
  type: 'event' | 'webinar';
  title: string;
  description: string;
  format: 'hybride' | 'présential' | 'online'; 
  date: string; 
  time: string; 
  location?: string;
  link?: string;
  ctaText: string;
  ctaLink: string;
  agenda?: string[]; 
  createdAt: string;
  updatedAt: string;
}


// ===============================================
// PREFERENCE
// ===============================================
export interface PreferencesState {
  email: string
  maskedEmail: string
  firstName: string
  lastName: string
  company: string
  source: 'social' | 'search' | 'friend' | 'other' | ''
  newsletter: boolean
  currentStep: 'initial' | 'email_input' | 'totp_input' | 'preferences_form'
  isLoading: boolean
  message: string
  messageType: 'success' | 'error' | 'info' | ''
  totpCode: string
}

export interface VerifyLinkResponse {
  canUpdate: boolean;
  email: string;
  maskedEmail: string;
  message: string;
  data?: {
    firstName: string;
    lastName: string;
    company: string;
    source: 'social' | 'search' | 'friend' | 'other' | '';
    newsletter: boolean;
  };
}

export interface TotpRequestResponse {
  maskedEmail: string;
  email: string;
  message: string;
}

export interface UpdatePreferencesResponse {
  message: string;
  data: {
    firstName: string;
    lastName: string;
    company: string;
    source: string;
    newsletter: boolean;
    email: string;
    id: string;
  };
}

// ===============================================
// SITE INFO
// ===============================================
export interface SiteInfo {
  id: string;
  title: string;
  message: string;
  targetSites: string[]; // Ex: ['all', 'pgs']
  displayType: 'banner' | 'modal' | 'popup' | 'toast';
  position: 'top' | 'bottom' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  animationSettings: {
    type: 'slideDown' | string; 
    duration: number;
    autoHide: boolean;
    autoHideDelay: number;
  };
  stylesSettings: {
    backgroundColor: string;
    textColor: string;
    linkColor: string;
    borderColor: string;
    fontSize: string;
    fontWeight: string;
  };
  showCloseButton: boolean;
  showDismissButton: boolean;
  linkSettings: {
    openInNewTab: boolean;
    underline: boolean;
  };
  links: Array<{ url: string; label: string }>;
  startDate?: string; 
  expirationDate?: string; 
  isActive: boolean;
  priority: number;
  createdBy: string;
  stats: {
    views: number;
    clicks: number;
    dismissals: number;
  };
  version: number;
  createdAt: string; 
  updatedAt: string; 
}

// ===============================================
// SOCIAL LINKS
// ===============================================
// Backend
export interface SocialLinkApi {
  id: string;
  media: string;
  link: string;
  createdAt: number;
  updatedAt: number;
}

// Frontend
export interface SocialLink {
  name: string;
  href: string;
  icon: any;
  title?: string;
}
