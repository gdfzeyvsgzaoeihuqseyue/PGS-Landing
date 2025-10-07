export interface ChatSuggestion {
  text: string;
  category: 'general' | 'product' | 'support' | 'technical';
}

export const chatSuggestions: ChatSuggestion[] = [
  // Suggestions générales
  { text: 'Quelles sont vos solutions?', category: 'general' },
  { text: 'Parlez-moi de Pro Gestion Soft', category: 'general' },
  { text: 'Quels sont vos domaines d\'expertise?', category: 'general' },
  { text: 'Comment puis-je vous contacter?', category: 'general' },
  { text: 'Où êtes-vous basés?', category: 'general' },
  
  // Suggestions sur les produits
  { text: 'Comment fonctionne SuitOps?', category: 'product' },
  { text: 'Quels sont les avantages de vos solutions?', category: 'product' },
  { text: 'Proposez-vous des solutions pour les PME?', category: 'product' },
  { text: 'Quelles sont les fonctionnalités de SuitOps?', category: 'product' },
  { text: 'Vos solutions sont-elles adaptées aux entreprises africaines?', category: 'product' },
  { text: 'Quels sont vos tarifs?', category: 'product' },
  
  // Suggestions de support
  { text: 'Comment puis-je obtenir de l\'aide?', category: 'support' },
  { text: 'Proposez-vous une formation?', category: 'support' },
  { text: 'Où puis-je trouver la documentation?', category: 'support' },
  { text: 'Comment puis-je signaler un problème?', category: 'support' },
  { text: 'Avez-vous un centre d\'aide?', category: 'support' },
  
  // Suggestions techniques
  { text: 'Générer une image d\'illustration professionnelle', category: 'technical' },
  { text: 'Expliquez-moi les fonctionnalités avancées', category: 'technical' },
  { text: 'Comment intégrer vos solutions?', category: 'technical' },
  { text: 'Quelles sont les API disponibles?', category: 'technical' },
  { text: 'Rechercher les dernières actualités sur la digitalisation en Afrique', category: 'technical' },
];

/**
 * Retourne un nombre aléatoire de suggestions (par défaut 3)
 */
export function getRandomSuggestions(count: number = 3): string[] {
  const shuffled = [...chatSuggestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(s => s.text);
}

/**
 * Retourne des suggestions par catégorie
 */
export function getSuggestionsByCategory(category: ChatSuggestion['category'], count: number = 3): string[] {
  const filtered = chatSuggestions.filter(s => s.category === category);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(s => s.text);
}
