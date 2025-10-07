<template>
  <header class="bg-white dark:bg-gray-800 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-6">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Anwesenheitstool</h1>
          <span v-if="authStore.user" class="ml-4 text-sm text-gray-600 dark:text-gray-400">
            {{ authStore.user.name }} ({{
              authStore.user.role === 'teacher' ? 'Lehrer' : 'Schüler'
            }})
          </span>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="themeStore.toggleDarkMode"
            class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- User Menu -->
          <div v-if="authStore.isLoggedIn" class="relative">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="flex items-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserIcon class="w-5 h-5" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/datenschutz"
                        :class="[
                          active
                            ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-200',
                          'block px-4 py-2 text-sm',
                        ]"
                      >
                        Datenschutzerklärung
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[
                          active
                            ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-200',
                          'block w-full text-left px-4 py-2 text-sm',
                        ]"
                      >
                        Abmelden
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { SunIcon, MoonIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
