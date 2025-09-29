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
      dc: `${SHARED_URL}/_General/Logos/PGS-DC.png`,
      dw: `${SHARED_URL}/_General/Logos/PGS-DW.png`,
      mc: `${SHARED_URL}/_General/Logos/PGS-MC.png`,
      mw: `${SHARED_URL}/_General/Logos/PGS-MW.png`,
    },
    page: {
      indexHero: `${SHARED_URL}/PGS_Landing/indexHero.png`,
      indexAbout: `${SHARED_URL}/PGS_Landing/indexAbout.png`,
      aboutPicture: `${SHARED_URL}/PGS_Landing/aboutPicture.png`,
    },
    team: {
      SteveAster: `${SHARED_URL}/_General/Team/SteveAster.png`,
      Marcias: `${SHARED_URL}/_General/Team/Marcias.png`,
      Delluc: `${SHARED_URL}/_General/Team/Delluc.png`,
      Charmaine: `${SHARED_URL}/_General/Team/Charmaine.png`,
    },
    general: {
      error403: `${SHARED_URL}/_General/Error/403.png`,
      error404: `${SHARED_URL}/_General/Error/404.png`,
      error500: `${SHARED_URL}/_General/Error/500.png`,
    },

    //PDF
    pdf: {
      legal: `${SHARED_URL}/_Docs/PDF/PGS_Legal.pdf`,
      terms: `${SHARED_URL}/_Docs/PDF/PGS_Terms.pdf`,
      privacy: `${SHARED_URL}/_Docs/PDF/PGS_Privacy.pdf`,
    },

    //JSON
    data: {
      footer: `${SHARED_URL}/Docs/JSON/custum.json`
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