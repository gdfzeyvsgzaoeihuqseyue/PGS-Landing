type ViewMode = 'grid' | 'list' | 'kanban'

interface App {
  id: string
  name: string
  description?: string
  icon?: string
  url: string
  category?: string
  color?: string
}

interface UserData {
  profileUrl?: string
  accountUrl?: string
  logoutUrl?: string
}

interface AppSwitcherOptions {
  // Target
  target?: string | HTMLElement

  // Data sources
  apiUrl?: string
  customApps?: App[]

  // View settings
  viewMode?: ViewMode
  itemsPerRow?: number
  sortAlphabetically?: boolean

  // Features
  enableFilters?: boolean
  enableViewSwitch?: boolean
  enableSettings?: boolean

  // Behavior
  openInNewTab?: boolean
  userLinksOpenInNewTab?: boolean

  // Styling
  triggerIconColor?: string

  // User data
  userData?: UserData
  profileUrl?: string
  accountUrl?: string
  logoutUrl?: string

  // Callbacks
  onAppClick?: (app: App) => void
}

export const useAppSwitcher = () => {
  const initialized = ref(false)
  const config = useRuntimeConfig()

  const loadResources = () => {
    // Inject styles
    useHead({
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/ProGestionSoft/AppSwitcher/dist/app-switcher.css'
        }
      ]
    })

    // Load script if not present
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="app-switcher.iife.js"]')) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/gh/ProGestionSoft/AppSwitcher/dist/app-switcher.iife.js'
      script.defer = true
      document.head.appendChild(script)
    }
  }

  const initAppSwitcher = (options: AppSwitcherOptions = {}) => {
    const checkAndInit = () => {
      if (typeof window === 'undefined') return

      // @ts-ignore
      let AppSwitcher = window.PGSAppSwitcher

      // Handle IIFE export object vs class
      // @ts-ignore
      if (AppSwitcher && typeof AppSwitcher !== 'function' && AppSwitcher.default) {
        // @ts-ignore
        AppSwitcher = AppSwitcher.default
      }

      if (AppSwitcher && typeof AppSwitcher === 'function') {
        // Default API URL if not provided
        const defaultApiUrl = config.public.pgsBaseAPI
          ? `${config.public.pgsBaseAPI}/solution/platform`
          : undefined

        // Merge userData
        const userData = options.userData || (options.profileUrl || options.accountUrl || options.logoutUrl ? {
          profileUrl: options.profileUrl,
          accountUrl: options.accountUrl,
          logoutUrl: options.logoutUrl
        } : undefined)

        new AppSwitcher({
          target: options.target || '#app-switcher',
          apiUrl: options.apiUrl || defaultApiUrl,
          customApps: options.customApps,
          viewMode: options.viewMode || 'grid',
          itemsPerRow: options.itemsPerRow ?? 3,
          sortAlphabetically: options.sortAlphabetically ?? false,
          enableFilters: options.enableFilters ?? true,
          enableViewSwitch: options.enableViewSwitch ?? true,
          enableSettings: options.enableSettings ?? true,
          openInNewTab: options.openInNewTab ?? false,
          userLinksOpenInNewTab: options.userLinksOpenInNewTab ?? false,
          triggerIconColor: options.triggerIconColor || 'currentColor',
          userData,
          profileUrl: options.profileUrl,
          accountUrl: options.accountUrl,
          logoutUrl: options.logoutUrl,
          onAppClick: options.onAppClick
        })
        initialized.value = true
      } else {
        setTimeout(checkAndInit, 100)
      }
    }

    checkAndInit()
  }

  return {
    loadResources,
    initAppSwitcher,
    initialized
  }
}

