import { ref } from 'vue'

// Global state for user menu
const isUserMenuOpen = ref(false)

export function useUserMenu() {
  const toggle = () => {
    isUserMenuOpen.value = !isUserMenuOpen.value
  }

  const open = () => {
    isUserMenuOpen.value = true
  }

  const close = () => {
    isUserMenuOpen.value = false
  }

  return {
    isUserMenuOpen,
    toggle,
    open,
    close
  }
}
