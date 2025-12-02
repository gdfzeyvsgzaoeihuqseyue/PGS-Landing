<template>
  <div :id="containerId" class="pgs-app-switcher-container"></div>
</template>

<script setup lang="ts">
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

const props = withDefaults(defineProps<{
  // Container
  containerId?: string

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

  // User data (legacy - userData object)
  userData?: UserData

  // User data (new - individual props)
  profileUrl?: string
  accountUrl?: string
  logoutUrl?: string

  // Callbacks
  onAppClick?: (app: App) => void
}>(), {
  containerId: 'pgs-app-switcher',
  viewMode: 'grid',
  itemsPerRow: 3,
  sortAlphabetically: true,
  enableFilters: true,
  enableViewSwitch: true,
  enableSettings: true,
  openInNewTab: false,
  userLinksOpenInNewTab: false,
  triggerIconColor: 'currentColor'
})

const { loadResources, initAppSwitcher } = useAppSwitcher()
const authStore = useAuthStore()

onMounted(() => {
  loadResources()

  // Determine URLs: use props if provided, otherwise fallback to store/defaults
  const profileUrl = props.profileUrl || (authStore.sessionChecked ? ('/me/profile') : undefined)
  const accountUrl = props.accountUrl || (authStore.sessionChecked ? ('/me/setting') : undefined)
  const logoutUrl = props.logoutUrl || (authStore.sessionChecked ? ('/auth/logout') : undefined)

  // Merge userData
  const userData = props.userData || (profileUrl || accountUrl || logoutUrl ? {
    profileUrl,
    accountUrl,
    logoutUrl
  } : undefined)

  initAppSwitcher({
    target: `#${props.containerId}`,
    apiUrl: props.apiUrl,
    customApps: props.customApps,
    viewMode: props.viewMode,
    itemsPerRow: props.itemsPerRow,
    sortAlphabetically: props.sortAlphabetically,
    enableFilters: props.enableFilters,
    enableViewSwitch: props.enableViewSwitch,
    enableSettings: props.enableSettings,
    openInNewTab: props.openInNewTab,
    userLinksOpenInNewTab: props.userLinksOpenInNewTab,
    triggerIconColor: props.triggerIconColor,
    userData,
    onAppClick: (app) => {
      if (props.onAppClick) {
        props.onAppClick(app)
      }

      // Navigation automatiquement
      if (app.url) {
        if (props.openInNewTab) {
          window.open(app.url, '_blank')
        } else {
          window.location.href = app.url
        }
      }
    }
  })
})
</script>
