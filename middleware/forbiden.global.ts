import { useRuntimeConfig } from '#app';
import { withoutTrailingSlash } from 'ufo';
import { createError } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const isBetaMode = config.public.betaMode;

  // Dossier privé
  if (isBetaMode && to.path.startsWith('/events')) {
    throw createError({
      statusCode: 403,
      statusMessage: "Accès Interdit au dossier 'events'",
      fatal: true,
    });
  }

  // Routes privées
  const privateRoutes = [
    '/privacy', '/terms', '/help', '/usefullinks'
  ].map(route => withoutTrailingSlash(route));

  // Normalisation du chemin
  const normalizedPath = withoutTrailingSlash(to.path);

  // Si le mode bêta est activé
  if (isBetaMode) {
    const isPrivate = privateRoutes.includes(normalizedPath);

    if (isPrivate) {
      throw createError({
        statusCode: 403,
        statusMessage: "Accès Interdit à la page 'privacy'",
        fatal: true,
      });
    }
  }
});