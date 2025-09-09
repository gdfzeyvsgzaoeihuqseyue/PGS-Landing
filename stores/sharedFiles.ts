import { defineStore } from 'pinia';

type FooterData = { 
  brand: string; 
  brandUrl: string 
}

export const useSharedFiles = defineStore('sharedFiles', () => {
  const runtimeConfig = useRuntimeConfig();
  const SHARED_URL = runtimeConfig.public.pgsSharedFiles;

  // Chemins des fichiers
  const paths = {
    // IMAGES
    logo: {
      dc: `${SHARED_URL}/Logos/PGS-DC.png`,
      dw: `${SHARED_URL}/Logos/PGS-DW.png`,
      mc: `${SHARED_URL}/Logos/PGS-MC.png`,
      mw: `${SHARED_URL}/Logos/PGS-MW.png`,
    },
    page: {
      indexHero: `${SHARED_URL}/PGS_Landing/indexHero.png`,
      indexAbout: `${SHARED_URL}/PGS_Landing/indexAbout.png`,
      aboutPicture: `${SHARED_URL}/PGS_Landing/aboutPicture.png`,
    },
    team: {
      SteveAster: `${SHARED_URL}/Team/SteveAster.png`,
      Marcias: `${SHARED_URL}/Team/Marcias.png`,
      Delluc: `${SHARED_URL}/Team/Delluc.png`,
      Charmaine: `${SHARED_URL}/Team/Charmaine.png`,
    },
    general: {
      error404: `${SHARED_URL}/General/404.png`,
      error403: `${SHARED_URL}/General/403.png`,
    },

    //JSON
    data: {
      footer: `${SHARED_URL}/JSON/custum.json`
    }
  };

  // Getter pour les données JSON
  async function getFooterData() {
    try {
      return await $fetch<{ brand: string; brandUrl: string }>(paths.data.footer);
    } catch (err) {
      return {
        brand: 'PGS SARL',
        brandUrl: '#'
      };
    }
  }

  return {
    paths,
    getFooterData
  };
});