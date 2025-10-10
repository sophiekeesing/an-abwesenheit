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
              Verwalten Sie Ihre Fehlzeiten und reichen Sie
              Abwesenheitsmeldungen ein
            </p>
          </div>

          <!-- Class Selection -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Aktuelle Klasse
            </h3>

            <div
              v-if="authStore.user?.classId"
              class="text-sm text-gray-600 dark:text-gray-400"
            >
              <span class="font-medium">{{ authStore.user.classId }}</span>
            </div>
          </div>

          <!-- Submit New Absence -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Neue Abwesenheit melden
            </h3>

            <form @submit.prevent="submitAbsence" class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Zeitraum
                </label>
                <DatePicker v-model="newAbsence.dates" />
              </div>

              <div>
                <label
                  for="reason"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Grund der Abwesenheit
                </label>
                <textarea
                  id="reason"
                  v-model="newAbsence.reason"
                  rows="3"
                  required
                  class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Beschreiben Sie den Grund Ihrer Abwesenheit..."
                ></textarea>
              </div>

              <div>
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  AU-Bescheinigung (optional)
                </label>
                <FileUpload v-model="newAbsence.document" />
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="!canSubmit"
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Abwesenheit melden
                </button>
              </div>
            </form>
          </div>

          <!-- My Absences -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Meine Fehlzeiten
            </h3>

            <div
              v-if="myAbsences.length === 0"
              class="text-gray-500 dark:text-gray-400 text-center py-8"
            >
              Sie haben noch keine Fehlzeiten gemeldet
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="absence in myAbsences"
                :key="absence.id"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ formatDate(absence.startDate) }} -
                        {{ formatDate(absence.endDate) }}
                      </h4>
                      <span
                        :class="getStatusBadgeClass(absence.status)"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                      >
                        {{ getStatusText(absence.status) }}
                      </span>
                    </div>

                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Grund: {{ absence.reason }}
                    </p>

                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      Eingereicht am: {{ formatDateTime(absence.submittedAt) }}
                    </p>

                    <div
                      v-if="absence.teacherNotes"
                      class="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                    >
                      <p
                        class="text-gray-600 dark:text-gray-400 font-medium mb-1"
                      >
                        Notiz vom Lehrer:
                      </p>
                      <p class="text-gray-800 dark:text-gray-200">
                        {{ absence.teacherNotes }}
                      </p>
                    </div>

                    <div v-if="absence.documentPath" class="mt-2">
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        📎 Dokument angehängt
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Statistiken
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ totalAbsences }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Gesamt Fehlzeiten
                </div>
              </div>

              <div
                class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div
                  class="text-2xl font-bold text-green-600 dark:text-green-400"
                >
                  {{ approvedAbsences }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Genehmigt
                </div>
              </div>

              <div
                class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div
                  class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                >
                  {{ pendingAbsences }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Ausstehend
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAttendanceStore } from "@/stores/attendance";
import DatePicker from "@/components/DatePicker.vue";
import FileUpload from "@/components/FileUpload.vue";
import { apiService } from "@/services/api";

const authStore = useAuthStore();
const attendanceStore = useAttendanceStore();

const selectedClass = ref("");

const newAbsence = ref({
  dates: { startDate: "", endDate: "" },
  reason: "",
  document: null as File | null,
});

const myAbsences = computed(() => {
  if (!authStore.user?.id) return [];
  return attendanceStore
    .getAbsencesForStudent(authStore.user.id)
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
});

const totalAbsences = computed(() => myAbsences.value.length);
const approvedAbsences = computed(
  () => myAbsences.value.filter((a) => a.status === "approved").length
);
const pendingAbsences = computed(
  () => myAbsences.value.filter((a) => a.status === "pending").length
);

const canSubmit = computed(() => {
  return (
    newAbsence.value.dates.startDate &&
    newAbsence.value.dates.endDate &&
    newAbsence.value.reason.trim()
  );
});

const submitAbsence = async () => {
  if (!authStore.user || !canSubmit.value) return;

  // Calculate working days from DatePicker
  const startDate = new Date(newAbsence.value.dates.startDate);
  const endDate = new Date(newAbsence.value.dates.endDate);
  let workingDays = 0;
  const totalDays =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  // Count working days (excluding weekends)
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Sunday (0) or Saturday (6)
      workingDays++;
    }
  }

  // Submit absence to store
  attendanceStore.submitAbsence({
    studentId: authStore.user.id,
    studentName: authStore.user.name,
    classId: authStore.user.classId || "",
    startDate: newAbsence.value.dates.startDate,
    endDate: newAbsence.value.dates.endDate,
    reason: newAbsence.value.reason.trim(),
    documentPath: newAbsence.value.document
      ? `uploads/${newAbsence.value.document.name}`
      : undefined,
  });

  // Get student data to find ausbilder email
  try {
    const students = await apiService.getStudents();
    const currentStudent = students.find(
      (s) => s.email === authStore.user?.email
    );

    if (currentStudent && currentStudent.ausbilder_email) {
      // Send email to ausbilder
      const emailResult = await apiService.sendAbsenceEmail({
        student: {
          id: currentStudent.id || authStore.user.id,
          first_name: currentStudent.first_name,
          last_name: currentStudent.last_name,
          class_name: authStore.user.classId || "",
          company_name: currentStudent.company_name || "",
          ausbilder_email: currentStudent.ausbilder_email,
        },
        absenceData: {
          startDate: newAbsence.value.dates.startDate,
          endDate: newAbsence.value.dates.endDate,
          reason: newAbsence.value.reason.trim(),
          workingDays: workingDays,
          totalDays: totalDays,
        },
      });

      if (emailResult.success) {
        console.log(
          "Absence email sent successfully to",
          currentStudent.ausbilder_email
        );
      } else {
        console.error("Failed to send absence email:", emailResult.message);
      }
    } else {
      console.warn("No ausbilder email found for student");
    }
  } catch (error) {
    console.error("Error sending absence email:", error);
  }

  // Reset form
  newAbsence.value = {
    dates: { startDate: "", endDate: "" },
    reason: "",
    document: null,
  };

  // In a real application, you would also upload the file to a server here
  if (newAbsence.value.document) {
    // Upload file logic would go here
    console.log("File to upload:", newAbsence.value.document);
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("de-DE");
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("de-DE");
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

// Initialize selected class on component mount
onMounted(() => {
  if (authStore.user?.classId) {
    selectedClass.value = authStore.user.classId;
  }
});
</script>
