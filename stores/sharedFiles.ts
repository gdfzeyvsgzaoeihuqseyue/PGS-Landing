import { defineStore } from 'pinia';

type FooterData = {
  brand: string;
  brandUrl: string
}

export const useSharedFiles = defineStore('sharedFiles', () => {
  const runtimeConfig = useRuntimeConfig();
  const SHARED_URL = runtimeConfig.public.pgsSharedFiles;
  const GNR_IMG = `${SHARED_URL}/_General/Images`;
  const GNR_DOC = `${SHARED_URL}/_General/Docs`;
  const APP_IMG = `${SHARED_URL}/PGS_Landing`;

  // Chemins des fichiers
  const paths = {
    // IMAGES
    logo: {
      dc: `${GNR_IMG}/Logos/PGS-DC.png`,
      dw: `${GNR_IMG}/Logos/PGS-DW.png`,
      mc: `${GNR_IMG}/Logos/PGS-MC.png`,
      mw: `${GNR_IMG}/Logos/PGS-MW.png`,
      noah: `${GNR_IMG}/Logos/NOAH-MC.png`,
    },
    page: {
      indexHero: `${APP_IMG}/indexHero.png`,
      indexAbout: `${APP_IMG}/indexAbout.png`,
      aboutPicture: `${APP_IMG}/aboutPicture.png`,
    },
    team: {
      SteveAster: `${GNR_IMG}/Team/SteveAster.png`,
      Marcias: `${GNR_IMG}/Team/Marcias.png`,
      Delluc: `${GNR_IMG}/Team/Delluc.png`,
      Charmaine: `${GNR_IMG}/Team/Charmaine.png`,
    },
    general: {
      error403: `${GNR_IMG}/Error/403.png`,
      error404: `${GNR_IMG}/Error/404.png`,
      error500: `${GNR_IMG}/Error/500.png`,
    },

    //PDF
    pdf: {
      legal: `${GNR_DOC}/PDF/PGS_Legal.pdf`,
      terms: `${GNR_DOC}/PDF/PGS_Terms.pdf`,
      privacy: `${GNR_DOC}/PDF/PGS_Privacy.pdf`,
    },

    //JSON
    data: {
      footer: `${GNR_DOC}/JSON/custum.json`
    }
  };

  // Getter pour les données JSON
  async function getFooterData() {
    try {
      return await $fetch<FooterData>(paths.data.footer);
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