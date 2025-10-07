<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label
          :for="startId"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Startdatum
        </label>
        <input
          :id="startId"
          v-model="startDate"
          type="date"
          :min="minDate"
          :max="endDate || undefined"
          required
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>

      <div>
        <label :for="endId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Enddatum
        </label>
        <input
          :id="endId"
          v-model="endDate"
          type="date"
          :min="startDate || minDate"
          required
          class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
    </div>

    <div v-if="duration > 0" class="text-sm text-gray-600 dark:text-gray-400">
      Dauer: {{ duration }} {{ duration === 1 ? 'Tag' : 'Tage' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  modelValue: {
    startDate: string
    endDate: string
  }
  minDate?: string
}

interface Emits {
  (e: 'update:modelValue', value: { startDate: string; endDate: string }): void
}

const props = withDefaults(defineProps<Props>(), {
  minDate: new Date().toISOString().split('T')[0],
})

const emit = defineEmits<Emits>()

const startId = 'start-date-' + Math.random().toString(36).substring(2, 9)
const endId = 'end-date-' + Math.random().toString(36).substring(2, 9)

const startDate = computed({
  get: () => props.modelValue.startDate,
  set: (value: string) => {
    emit('update:modelValue', {
      startDate: value,
      endDate: props.modelValue.endDate,
    })
  },
})

const endDate = computed({
  get: () => props.modelValue.endDate,
  set: (value: string) => {
    emit('update:modelValue', {
      startDate: props.modelValue.startDate,
      endDate: value,
    })
  },
})

const duration = computed(() => {
  if (!startDate.value || !endDate.value) return 0

  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

  return diffDays
})

// Auto-set end date to start date if not set
watch(startDate, (newStartDate) => {
  if (newStartDate && !endDate.value) {
    endDate.value = newStartDate
  }
})
</script>
