import { useRuntimeConfig, createError, abortNavigation } from '#app'
import { withoutTrailingSlash } from 'ufo'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()
  const isBetaMode = config.public?.betaMode
  const normalizedPath = withoutTrailingSlash(to.path)

  if (isBetaMode) {
    // Routes privées générales
    const privateRoutes = ['/nothing', '/help'].map(r => withoutTrailingSlash(r))
    const isEventsRoute = normalizedPath.startsWith('/events')
    const isWikiRoute = normalizedPath.startsWith('/wiki')
    const isPrivate = privateRoutes.includes(normalizedPath)

    // Bloquer les routes interdites
    if (isEventsRoute || isWikiRoute || isPrivate) {
      const err = createError({
        statusCode: 403,
        statusMessage: 'Accès Interdit',
        fatal: true,
      })

      if (process.server) throw err
      return abortNavigation(err)
    }
  }
})
