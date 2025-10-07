<template>
  <div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
    <NavigationHeader />

    <main class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div class="max-w-7xl mx-auto">
        <TeacherDashboard v-if="authStore.isTeacher" />
        <StudentDashboard v-else-if="authStore.isStudent" />
        <div v-else class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">Kein gültiger Benutzertyp erkannt.</p>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavigationHeader from '@/components/NavigationHeader.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import StudentDashboard from '@/views/StudentDashboard.vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  // Restore user session on page load
  authStore.restoreSession()

  // Initialize theme
  themeStore.initTheme()

  // Redirect to login if not authenticated
  if (!authStore.isLoggedIn) {
    router.push('/login')
  }
})
</script>
