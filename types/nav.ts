// Interface pour un lien de navigation
export interface NavLink {
  name: string
  to: string
  disabled?: boolean
}

// Interface pour une section de navigation
export interface NavSection {
  title: string
  links: NavLink[]
}
