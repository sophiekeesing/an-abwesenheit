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
        <label
          :for="endId"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
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

    <div
      v-if="schoolDays > 0"
      class="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-md"
    >
      <div class="text-sm text-primary-800 dark:text-primary-200">
        <strong>Schultage gesamt:</strong> {{ schoolDays }}
        <span class="text-primary-600 dark:text-primary-400"
          >(Wochenenden ausgeschlossen)</span
        >
      </div>
      <div
        v-if="totalDays !== schoolDays"
        class="text-xs text-primary-600 dark:text-primary-400 mt-1"
      >
        Kalendertage: {{ totalDays }} | Schultage: {{ schoolDays }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  modelValue: {
    startDate: string;
    endDate: string;
  };
  minDate?: string;
}

interface Emits {
  (e: "update:modelValue", value: { startDate: string; endDate: string }): void;
}

const props = withDefaults(defineProps<Props>(), {
  minDate: new Date().toISOString().split("T")[0],
});

const emit = defineEmits<Emits>();

const startId = "start-date-" + Math.random().toString(36).substring(2, 9);
const endId = "end-date-" + Math.random().toString(36).substring(2, 9);

const startDate = computed({
  get: () => props.modelValue.startDate,
  set: (value: string) => {
    emit("update:modelValue", {
      startDate: value,
      endDate: props.modelValue.endDate,
    });
  },
});

const endDate = computed({
  get: () => props.modelValue.endDate,
  set: (value: string) => {
    emit("update:modelValue", {
      startDate: props.modelValue.startDate,
      endDate: value,
    });
  },
});

const totalDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0;

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays;
});

const schoolDays = computed(() => {
  if (!startDate.value || !endDate.value) return 0;

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (end < start) return 0;

  let workingDayCount = 0;
  const currentDate = new Date(start);

  while (currentDate <= end) {
    // Check if it's not a weekend (0 = Sunday, 6 = Saturday)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDayCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDayCount;
});

// Auto-set end date to start date if not set
watch(startDate, (newStartDate) => {
  if (newStartDate && !endDate.value) {
    endDate.value = newStartDate;
  }
});
</script>
