import { useRuntimeConfig } from '#app';
import { withoutTrailingSlash } from 'ufo';
import { createError } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isBetaMode = config.public.betaMode;

  // Normalisation du chemin
  const normalizedPath = withoutTrailingSlash(to.path);

  if (isBetaMode) {
    // Routes privées générales
    const privateRoutes = [
      '/submit-testimony', '/help'
    ].map(route => withoutTrailingSlash(route));

    const isEventsRoute = normalizedPath.startsWith('/events');
    const isWikiRoute = normalizedPath.startsWith('/events');
    const isPrivate = privateRoutes.includes(normalizedPath);

    // Bloquer toutes les routes non accessibles
    if (isEventsRoute || isWikiRoute || isPrivate) {
      throw createError({
        statusCode: 403,
        statusMessage: "Accès Interdit",
        fatal: true,
      });
    }
  }
});
