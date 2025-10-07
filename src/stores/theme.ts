import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useLocalStorage('attendance-dark-mode', false)

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const updateTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initTheme = () => {
    updateTheme()
  }

  return {
    isDark,
    toggleDarkMode,
    initTheme,
  }
})
