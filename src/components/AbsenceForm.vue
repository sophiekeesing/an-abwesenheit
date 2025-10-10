<template>
  <div class="absence-form-container">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto"
    >
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Abwesenheit melden
      </h3>

      <form @submit.prevent="submitAbsence" class="space-y-4">
        <!-- Student Selection (if teacher) -->
        <div v-if="isTeacher">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Schüler
          </label>
          <select
            v-model="formData.studentId"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Schüler auswählen</option>
            <option
              v-for="student in availableStudents"
              :key="student.id"
              :value="student.id"
            >
              {{ student.first_name }} {{ student.last_name }} ({{
                student.class_name
              }})
            </option>
          </select>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Von (Datum)
            </label>
            <input
              v-model="formData.startDate"
              type="date"
              required
              :min="minDate"
              @change="calculateWorkingDays"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Bis (Datum)
            </label>
            <input
              v-model="formData.endDate"
              type="date"
              required
              :min="formData.startDate || minDate"
              @change="calculateWorkingDays"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <!-- Working Days Display -->
        <div v-if="workingDays !== null" class="bg-blue-50 p-3 rounded-md">
          <div class="text-sm text-blue-800">
            <strong>Schultage gesamt:</strong> {{ workingDays }}
            <span class="text-blue-600">(Wochenenden ausgeschlossen)</span>
          </div>
          <div
            v-if="totalDays !== workingDays"
            class="text-xs text-blue-600 mt-1"
          >
            Kalendertage: {{ totalDays }} | Schultage: {{ workingDays }}
          </div>
        </div>

        <!-- Reason -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Grund der Abwesenheit
          </label>
          <textarea
            v-model="formData.reason"
            required
            rows="3"
            placeholder="z.B. Krankheit, Arzttermin, Familiennotfall..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            :disabled="!canSubmit || submitting"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Wird gemeldet..." : "Abwesenheit melden" }}
          </button>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string;
}

interface Props {
  isTeacher?: boolean;
  availableStudents?: Student[];
  preSelectedStudentId?: string;
}

interface Emits {
  (e: "close"): void;
  (
    e: "submit",
    data: {
      studentId: string;
      startDate: string;
      endDate: string;
      reason: string;
      workingDays: number;
      totalDays: number;
    }
  ): void;
}

const props = withDefaults(defineProps<Props>(), {
  isTeacher: false,
  availableStudents: () => [],
  preSelectedStudentId: "",
});

const emit = defineEmits<Emits>();

const formData = ref({
  studentId: props.preSelectedStudentId,
  startDate: "",
  endDate: "",
  reason: "",
});

const submitting = ref(false);
const workingDays = ref<number | null>(null);
const totalDays = ref<number | null>(null);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

const canSubmit = computed(() => {
  const baseValid =
    formData.value.startDate &&
    formData.value.endDate &&
    formData.value.reason.trim();

  if (props.isTeacher) {
    return baseValid && formData.value.studentId;
  }

  return baseValid;
});

// Function to calculate working days excluding weekends
const calculateWorkingDays = () => {
  if (!formData.value.startDate || !formData.value.endDate) {
    workingDays.value = null;
    totalDays.value = null;
    return;
  }

  const startDate = new Date(formData.value.startDate);
  const endDate = new Date(formData.value.endDate);

  if (endDate < startDate) {
    workingDays.value = null;
    totalDays.value = null;
    return;
  }

  let workingDayCount = 0;
  let totalDayCount = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    totalDayCount++;

    // Check if it's not a weekend (0 = Sunday, 6 = Saturday)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDayCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  workingDays.value = workingDayCount;
  totalDays.value = totalDayCount;
};

// Watch for date changes to recalculate
watch(
  [() => formData.value.startDate, () => formData.value.endDate],
  calculateWorkingDays
);

const submitAbsence = async () => {
  if (
    !canSubmit.value ||
    workingDays.value === null ||
    totalDays.value === null
  ) {
    return;
  }

  submitting.value = true;

  try {
    emit("submit", {
      studentId: formData.value.studentId,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      reason: formData.value.reason,
      workingDays: workingDays.value,
      totalDays: totalDays.value,
    });
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.absence-form-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
</style>
