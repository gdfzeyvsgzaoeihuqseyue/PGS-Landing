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
