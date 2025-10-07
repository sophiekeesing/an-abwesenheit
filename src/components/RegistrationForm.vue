<template>
  <div
    class="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Registrierung
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Erstellen Sie Ihr Konto für das Anwesenheitstool
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Vollständiger Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Max Mustermann"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="max.mustermann@student.de"
            />
          </div>

          <div>
            <label
              for="dateOfBirth"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Geburtsdatum
            </label>
            <input
              id="dateOfBirth"
              v-model="formData.dateOfBirth"
              name="dateOfBirth"
              type="date"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rolle
            </label>
            <select
              id="role"
              v-model="formData.role"
              name="role"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Rolle auswählen</option>
              <option value="student">Schüler</option>
              <option value="teacher">Lehrer</option>
            </select>
          </div>

          <div v-if="formData.role === 'student'">
            <label for="classId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Klasse
            </label>
            <select
              id="classId"
              v-model="formData.classId"
              name="classId"
              :required="formData.role === 'student'"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md bg-white dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">Klasse auswählen</option>
              <option value="IT4L">IT4L</option>
              <option value="IT4O">IT4O</option>
              <option value="IT4K">IT4K</option>
            </select>
          </div>

          <div v-if="formData.role === 'teacher'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Unterrichtete Klassen
            </label>
            <div class="space-y-2">
              <label
                v-for="classOption in availableClasses"
                :key="classOption"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :value="classOption"
                  v-model="formData.teacherClasses"
                  class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ classOption }}</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 dark:text-green-400 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading || !canSubmit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">Wird registriert...</span>
            <span v-else>Registrieren</span>
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="$router.push('/login')"
            class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
          >
            Bereits registriert? Hier anmelden
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const availableClasses = ['IT4L', 'IT4O', 'IT4K']

const formData = ref({
  name: '',
  email: '',
  dateOfBirth: '',
  role: '' as 'student' | 'teacher' | '',
  classId: '',
  teacherClasses: [] as string[],
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const canSubmit = computed(() => {
  const baseFields =
    formData.value.name && formData.value.email && formData.value.dateOfBirth && formData.value.role

  if (formData.value.role === 'student') {
    return baseFields && formData.value.classId
  } else if (formData.value.role === 'teacher') {
    return baseFields && formData.value.teacherClasses.length > 0
  }

  return false
})

// Clear class-related fields when role changes
watch(
  () => formData.value.role,
  (newRole) => {
    if (newRole === 'student') {
      formData.value.teacherClasses = []
    } else if (newRole === 'teacher') {
      formData.value.classId = ''
    }
  },
)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Prepare registration data based on role
    const registrationData = {
      name: formData.value.name,
      email: formData.value.email,
      dateOfBirth: formData.value.dateOfBirth,
      role: formData.value.role as 'student' | 'teacher',
      classId: formData.value.role === 'student' ? formData.value.classId : undefined,
      classes: formData.value.role === 'teacher' ? formData.value.teacherClasses : undefined,
    }

    const result = await authStore.register(registrationData)

    if (result.success) {
      success.value = result.message
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else {
      error.value = result.message
    }
  } catch {
    error.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
  } finally {
    loading.value = false
  }
}
</script>
