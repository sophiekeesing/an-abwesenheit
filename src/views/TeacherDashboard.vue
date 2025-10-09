<template>
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

    <!-- Class Selector -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Klasse auswählen
      </h3>
      <select
        v-model="selectedClass"
        class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      >
        <option value="">Alle Klassen</option>
        <option
          v-for="classId in teacherClasses"
          :key="classId"
          :value="classId"
        >
          {{ classId }}
        </option>
      </select>
    </div>

    <!-- Pending Absences -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Ausstehende Genehmigungen
        <span
          class="ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
          {{ pendingAbsences.length }}
        </span>
      </h3>

      <div
        v-if="pendingAbsences.length === 0"
        class="text-gray-500 dark:text-gray-400 text-center py-8"
      >
        Keine ausstehenden Genehmigungen
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="absence in pendingAbsences"
          :key="absence.id"
          class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white">
                {{ absence.studentName }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Klasse: {{ absence.classId }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ formatDate(absence.startDate) }} -
                {{ formatDate(absence.endDate) }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Grund: {{ absence.reason }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="approveAbsence(absence.id)"
                class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Genehmigen
              </button>
              <button
                @click="rejectAbsence(absence.id)"
                class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Ablehnen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Class Absences Overview -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Fehlzeiten-Übersicht
        {{ selectedClass ? `- Klasse ${selectedClass}` : "" }}
      </h3>

      <div
        v-if="filteredAbsences.length === 0"
        class="text-gray-500 dark:text-gray-400 text-center py-8"
      >
        Keine Fehlzeiten gefunden
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Schüler
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Klasse
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Zeitraum
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Grund
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600"
          >
            <tr v-for="absence in filteredAbsences" :key="absence.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ absence.studentName }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ absence.classId }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ formatDate(absence.startDate) }} -
                {{ formatDate(absence.endDate) }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
              >
                {{ absence.reason }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusBadgeClass(absence.status)"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ getStatusText(absence.status) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
              >
                <button
                  @click="editAbsence(absence)"
                  class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Bearbeiten
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Absence Modal -->
    <div
      v-if="editingAbsence"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800"
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Fehlzeit bearbeiten
          </h3>

          <div class="space-y-4">
            <DatePicker v-model="editingDates" />

            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Notizen
              </label>
              <textarea
                v-model="teacherNotes"
                rows="3"
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Notizen hinzufügen..."
              ></textarea>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              @click="cancelEdit"
              class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Abbrechen
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              Speichern
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAttendanceStore, type Absence } from "@/stores/attendance";
import DatePicker from "@/components/DatePicker.vue";

const authStore = useAuthStore();
const attendanceStore = useAttendanceStore();

const selectedClass = ref("");
const editingAbsence = ref<Absence | null>(null);
const editingDates = ref({ startDate: "", endDate: "" });
const teacherNotes = ref("");

const teacherClasses = computed(() => authStore.user?.classes || []);

const pendingAbsences = computed(() => {
  const pending = attendanceStore.getPendingAbsences;
  return selectedClass.value
    ? pending.filter((absence) => absence.classId === selectedClass.value)
    : pending.filter((absence) =>
        teacherClasses.value.includes(absence.classId)
      );
});

const filteredAbsences = computed(() => {
  const allAbsences = attendanceStore.absences;
  const filtered = selectedClass.value
    ? allAbsences.filter((absence) => absence.classId === selectedClass.value)
    : allAbsences.filter((absence) =>
        teacherClasses.value.includes(absence.classId)
      );

  return filtered.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
});

const approveAbsence = (absenceId: string) => {
  attendanceStore.updateAbsenceStatus(
    absenceId,
    "approved",
    authStore.user?.id
  );
};

const rejectAbsence = (absenceId: string) => {
  attendanceStore.updateAbsenceStatus(
    absenceId,
    "rejected",
    authStore.user?.id
  );
};

const editAbsence = (absence: Absence) => {
  editingAbsence.value = absence;
  editingDates.value = {
    startDate: absence.startDate,
    endDate: absence.endDate,
  };
  teacherNotes.value = absence.teacherNotes || "";
};

const cancelEdit = () => {
  editingAbsence.value = null;
  editingDates.value = { startDate: "", endDate: "" };
  teacherNotes.value = "";
};

const saveEdit = () => {
  if (editingAbsence.value) {
    attendanceStore.updateAbsenceDates(
      editingAbsence.value.id,
      editingDates.value.startDate,
      editingDates.value.endDate
    );

    if (teacherNotes.value) {
      attendanceStore.updateAbsenceStatus(
        editingAbsence.value.id,
        editingAbsence.value.status,
        authStore.user?.id,
        teacherNotes.value
      );
    }
  }

  cancelEdit();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("de-DE");
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Ausstehend";
    case "approved":
      return "Genehmigt";
    case "rejected":
      return "Abgelehnt";
    default:
      return status;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

onMounted(() => {
  // Set default class to first class if available
  if (teacherClasses.value.length > 0 && teacherClasses.value[0]) {
    selectedClass.value = teacherClasses.value[0];
  }
});
</script>
