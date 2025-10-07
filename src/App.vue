<template>
  <div id="app" class="min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  // Restore user session on app load
  authStore.restoreSession()

  // Initialize theme
  themeStore.initTheme()
})
</script>
