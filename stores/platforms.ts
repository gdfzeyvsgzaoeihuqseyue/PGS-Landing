import type { Platform } from '@/types';

export const platforms: Platform[] = [
  {
    id: "suitops",
    name: "SuitOps",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/SuitOps-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/SuitOps-DC.png",
    category: "Outil",
    description: "Suite complète de gestion d'entreprise"
  },
  {
    id: "pgs-studio",
    name: "PGS Studio",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/Studio-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/Studio-DC.png",
    category: "Outil",
    description: "Plateforme de développement collaboratif"
  },
  {
    id: "game-bot",
    name: "GAME BOT",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/GmaeBot-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/GameBot-DC.png",
    category: "Jeux",
    description: "Solution d'automatisation intelligente"
  },
  {
    id: "skillup",
    name: "SkillUp",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/SkillUp-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/SkillUp-DC.png",
    category: "Éducation",
    description: "Plateforme de formation professionnelle"
  },
  {
    id: "appbot",
    name: "AppBot",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/AppBot-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/AppBot-DC.png",
    category: "Bot",
    description: "Bot Telegram pour PGS"
  },
  {
    id: "documentation",
    name: "Documentation",
    logo: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/Docs-MC.png",
    logoDesk: "https://raw.githubusercontent.com/ProGestionSoft/Files/refs/heads/main/Logos/Docs-DC.png",
    category: "Docs",
    description: "Documentation officielle de PGS"
  },
  {
    id: "locaspace",
    name: "LocaSpace",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center",
    category: "Immobilier",
    description: "Plateforme de gestion immobilière"
  }
];

// Récupérer les données de plateforme
export const getPlatformById = (id: string): Platform | undefined => {
  return platforms.find(platform => platform.id === id);
};

export const getPlatformByName = (name: string): Platform | undefined => {
  return platforms.find(platform => platform.name === name);
};
