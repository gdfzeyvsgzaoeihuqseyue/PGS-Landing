import { useRuntimeConfig } from '#app';
import { withoutTrailingSlash } from 'ufo';
import { createError } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isBetaMode = config.public.betaMode;

  // Normalisation du chemin
  const normalizedPath = withoutTrailingSlash(to.path);

  if (isBetaMode) {
    const privateRoutes = [
      '/privacy', '/terms', '/help', '/usefullinks'
    ].map(route => withoutTrailingSlash(route));

    const isEventsRoute = normalizedPath.startsWith('/events');
    const isPrivate = privateRoutes.includes(normalizedPath);

    if (isEventsRoute || isPrivate) {
      throw createError({
        statusCode: 403,
        statusMessage: "Accès Interdit",
        fatal: true,
      });
    }
  }
});
