<template>
  <div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
    <main class="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div class="max-w-7xl mx-auto">
        <div class="space-y-6">
          <!-- Header -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Guten Tag,
              <span
                v-if="authStore.user"
                class="text-gray-900 dark:text-white ml-1 font-bold"
              >
                {{ authStore.user.name }}
              </span>
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              Verwalten Sie Fehlzeiten für Ihre Klassen
            </p>
          </div>

          <!-- Student Table Component -->
          <StudentTable />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import StudentTable from "@/components/StudentTable.vue";

const authStore = useAuthStore();
</script>
