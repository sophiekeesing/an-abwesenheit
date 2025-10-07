<template>
  <div
    class="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Anwesenheitstool
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Melden Sie sich mit Ihren Zugangsdaten an
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">E-Mail-Adresse</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="E-Mail-Adresse"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Passwort</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Passwort"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Wird angemeldet...</span>
            <span v-else>Anmelden</span>
          </button>
        </div>

        <div class="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Demo-Zugangsdaten:</p>
          <p>Lehrer: mueller@school.de / password123</p>
          <p>Schüler: max.mustermann@student.de / password123</p>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="router.push('/register')"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
          >
            Noch kein Konto? Hier registrieren
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login(email.value, password.value)

    if (success) {
      router.push('/dashboard')
    } else {
      error.value = 'Ungültige Anmeldedaten. Bitte versuchen Sie es erneut.'
    }
  } catch (err) {
    error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}
</script>
