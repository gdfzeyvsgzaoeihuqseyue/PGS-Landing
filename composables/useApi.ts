import type { UseFetchOptions } from 'nuxt/app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.pgsBaseAPI

  const apiFetch = async <T>(
    endpoint: string,
    options: UseFetchOptions<T> = {}
  ) => {
    return await useFetch<T>(endpoint, {
      baseURL,
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    } as any)
  }

  return {
    apiFetch
  }
}
