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
