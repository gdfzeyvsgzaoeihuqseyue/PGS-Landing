export const useSSOAuth = () => {
  const config = useRuntimeConfig()

  const getSSOAuthUrl = (returnUrl?: string) => {
    const ssoBase = config.public.ssoUrl as string
    const serviceDomain = config.public.serviceDomain as string

    // Construction de l'URL de base
    const url = new URL(`${ssoBase}/auth/check`)

    // URL de retour
    if (returnUrl) {
      url.searchParams.set('returnUrl', returnUrl)
    } else {
      if (serviceDomain) {
        // Retrait d'un slash si l'url se termine par '/'
        const domain = serviceDomain.endsWith('/') ? serviceDomain.slice(0, -1) : serviceDomain
        url.searchParams.set('returnUrl', `${domain}`)
      } else if (process.client) {
        // Retour à la page actuelle si le serviceDomain est manquant
        url.searchParams.set('returnUrl', window.location.href)
      }
    }

    return url.toString()
  }

  return {
    getSSOAuthUrl
  }
}
