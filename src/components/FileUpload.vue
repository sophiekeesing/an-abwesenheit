<template>
  <div class="space-y-4">
    <div class="flex items-center justify-center w-full">
      <label
        :for="inputId"
        class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        :class="{
          'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragOver,
        }"
        @dragover.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <DocumentIcon class="w-8 h-8 mb-3 text-gray-400" />
          <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold">Klicken Sie hier</span> oder ziehen Sie eine Datei hierher
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            AU-Bescheinigung (PDF, JPG, PNG, max. 5MB)
          </p>
        </div>
        <input
          :id="inputId"
          type="file"
          class="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          @change="handleFileSelect"
        />
      </label>
    </div>

    <!-- File Preview -->
    <div v-if="selectedFile" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <DocumentIcon class="w-8 h-8 text-gray-400" />
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ selectedFile.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
        </div>
        <button @click="removeFile" class="text-red-500 hover:text-red-700 transition-colors">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DocumentIcon, XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
  modelValue?: File | null
}

interface Emits {
  (e: 'update:modelValue', value: File | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputId = 'file-upload-' + Math.random().toString(36).substring(2, 9)
const selectedFile = ref<File | null>(props.modelValue || null)
const isDragOver = ref(false)
const error = ref('')

const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
const maxSize = 5 * 1024 * 1024 // 5MB

const validateFile = (file: File): boolean => {
  error.value = ''

  if (!allowedTypes.includes(file.type)) {
    error.value = 'Dateityp nicht unterstützt. Bitte wählen Sie eine PDF-, JPG- oder PNG-Datei.'
    return false
  }

  if (file.size > maxSize) {
    error.value = 'Datei ist zu groß. Maximale Größe: 5MB.'
    return false
  }

  return true
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file && validateFile(file)) {
    selectedFile.value = file
    emit('update:modelValue', file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  const files = event.dataTransfer?.files
  const file = files?.[0]

  if (file && validateFile(file)) {
    selectedFile.value = file
    emit('update:modelValue', file)
  }
}

const removeFile = () => {
  selectedFile.value = null
  emit('update:modelValue', null)
  error.value = ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
