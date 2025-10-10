<template>
  <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-3 sm:p-6">
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0"
    >
      <h2 class="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
        Schüler Übersicht
      </h2>
      <div class="flex justify-between items-center gap-2 relative">
        <CustomSelect
          v-model="selectedClass"
          :options="classOptions"
          placeholder="Alle Klassen"
        />
        <div class="flex gap-2 sm:gap-2">
          <button
            @click="loadStudents"
            class="px-3 py-2 sm:px-4 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title="Schülerliste aktualisieren"
          >
            <svg
              class="w-5 h-5 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
          <button
            @click="showAddStudentForm = true"
            class="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Neuen Schüler hinzufügen"
          >
            <svg
              class="w-5 h-5 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <table class="min-w-full table-auto">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              class="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              class="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Klasse
            </th>
            <th
              class="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Volljährig
            </th>
            <th
              class="hidden lg:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Ausbildungsbetrieb
            </th>
            <th
              class="hidden md:table-cell px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Fehlzeiten
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600"
        >
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            @click="selectStudent(student)"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
          >
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ student.first_name }} {{ student.last_name }}
                </div>
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
              <span
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                {{ student.class_name }}
              </span>
            </td>
            <td
              class="hidden md:table-cell px-6 py-4 whitespace-nowrap text-left"
            >
              <span class="text-2xl">
                {{ student.is_of_age ? "✅" : "🚫" }}
              </span>
            </td>
            <td
              class="hidden lg:table-cell px-6 py-4 whitespace-nowrap max-w-xs"
            >
              <div
                class="text-sm text-gray-900 dark:text-white truncate"
                :title="student.company_name"
              >
                {{ student.company_name }}
              </div>
              <div
                class="text-sm text-gray-500 dark:text-gray-400 truncate"
                :title="student.ausbilder_email"
              >
                {{ student.ausbilder_email }}
              </div>
            </td>
            <td class="hidden md:table-cell px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ student.total_absence_days || 0 }} Tage
                </span>
                <span
                  v-if="student.pending_absences > 0"
                  class="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                >
                  {{ student.pending_absences }} ausstehend
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Student Detail Sidebar -->
    <div
      v-if="selectedStudent"
      class="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
      :class="selectedStudent ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
        >
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ selectedStudent.first_name }} {{ selectedStudent.last_name }}
            </h3>
            <div class="flex items-center gap-2">
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-primary-600 dark:text-primary-400"
                title="Bearbeiten"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
              </button>
              <button
                v-if="!isEditing"
                @click="showDeleteConfirmation = true"
                class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors text-red-600 dark:text-red-400"
                title="Schüler löschen"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
              <button
                @click="selectedStudent = null"
                class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-600 dark:text-gray-300"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Student Info -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <h4
                class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Schüler Information
              </h4>
              <div v-if="isEditing" class="flex gap-2">
                <button
                  @click="saveChanges"
                  :disabled="saving"
                  class="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 disabled:opacity-50"
                >
                  {{ saving ? "Speichern..." : "Speichern" }}
                </button>
                <button
                  @click="cancelEditing"
                  class="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                >
                  Abbrechen
                </button>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm font-bold text-gray-700 dark:text-gray-200"
                  >Klasse:</span
                >
                <span class="text-sm text-gray-600 dark:text-gray-400">{{
                  selectedStudent.class_name
                }}</span>
              </div>
              <div class="flex justify-between">
                <span
                  class="flex items-center text-sm font-bold text-gray-700 dark:text-gray-200"
                  >Volljährig:</span
                >
                <span class="text-lg">{{
                  selectedStudent.is_of_age ? "✅" : "🚫"
                }}</span>
              </div>
              <div class="flex justify-between items-start gap-3">
                <span
                  class="text-sm font-bold text-gray-700 dark:text-gray-200 flex-shrink-0"
                  >Ausbildungsbetrieb:</span
                >
                <span
                  class="text-sm text-gray-600 dark:text-gray-400 text-right break-words min-w-0"
                  :title="selectedStudent.company_name"
                  >{{ selectedStudent.company_name }}</span
                >
              </div>
              <div class="flex justify-between items-start gap-3">
                <span
                  class="text-sm font-bold text-gray-700 dark:text-gray-200 flex-shrink-0"
                  >Ausbilder E-Mail:</span
                >
                <input
                  v-if="isEditing"
                  v-model="editForm.ausbilder_email"
                  type="email"
                  class="text-sm font-medium border border-gray-300 dark:border-gray-600 rounded px-2 py-1 min-w-0 flex-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="email@firma.de"
                />
                <span
                  v-else
                  class="text-sm text-gray-600 dark:text-gray-400 text-right break-all min-w-0"
                  :title="selectedStudent.ausbilder_email"
                  >{{ selectedStudent.ausbilder_email }}</span
                >
              </div>
            </div>
          </div>

          <!-- Absence Summary -->
          <div class="mb-6">
            <h4
              class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
            >
              Fehlzeiten Übersicht
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div
                    class="text-2xl font-bold text-primary-600 dark:text-primary-400"
                  >
                    {{ selectedStudent.total_absence_days || 0 }}
                  </div>
                  <div
                    class="text-sm font-bold text-gray-700 dark:text-gray-200"
                  >
                    Gesamt Tage
                  </div>
                </div>
                <div>
                  <div
                    class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                  >
                    {{ selectedStudent.pending_absences || 0 }}
                  </div>
                  <div
                    class="text-sm font-bold text-gray-700 dark:text-gray-200"
                  >
                    Ausstehend
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Absences -->
          <div class="mb-6">
            <h4
              class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3"
            >
              Letzte Fehlzeiten
            </h4>
            <div class="space-y-3">
              <div
                v-for="absence in selectedStudent.recent_absences"
                :key="absence.id"
                class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700"
              >
                <div class="flex justify-between items-start mb-2">
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ formatDate(absence.start_date) }}
                    <span v-if="absence.start_date !== absence.end_date">
                      - {{ formatDate(absence.end_date) }}
                    </span>
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(absence.status)"
                  >
                    {{ getStatusText(absence.status) }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  {{ absence.reason }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ absence.working_days_count }} Werktage
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div
          class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600"
        >
          <button
            @click="showAbsenceForm = true"
            class="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Neue Abwesenheit melden
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div
      v-if="selectedStudent"
      @click="selectedStudent = null"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Absence Form Modal -->
    <AbsenceForm
      v-if="showAbsenceForm"
      :is-teacher="true"
      :available-students="students"
      :pre-selected-student-id="selectedStudent?.id"
      @close="showAbsenceForm = false"
      @submit="handleAbsenceSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div class="flex items-center mb-4">
          <div
            class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Schüler löschen
            </h3>
          </div>
        </div>
        <div class="mb-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Sind Sie sicher, dass Sie
            <strong class="text-gray-900 dark:text-white">
              {{ selectedStudent?.first_name }} {{ selectedStudent?.last_name }}
            </strong>
            löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirmation = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Abbrechen
          </button>
          <button
            @click="confirmDeleteStudent"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>

    <!-- Add Student Modal -->
    <div
      v-if="showAddStudentForm"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm sm:max-w-lg h-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
      >
        <div class="p-4 sm:p-6">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h3
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white"
            >
              Neuen Schüler hinzufügen
            </h3>
            <button
              @click="closeAddStudentForm"
              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors text-gray-600 dark:text-gray-300"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <form
            @submit.prevent="handleAddStudent"
            class="space-y-3 sm:space-y-4"
          >
            <!-- Name -->
            <div>
              <label
                for="add-name"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Vollständiger Name
              </label>
              <input
                id="add-name"
                v-model="addStudentForm.name"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Max Mustermann"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                for="add-email"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                E-Mail-Adresse
              </label>
              <input
                id="add-email"
                v-model="addStudentForm.email"
                type="email"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="max.mustermann@student.de"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label
                for="add-dateOfBirth"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Geburtsdatum
              </label>
              <input
                id="add-dateOfBirth"
                v-model="addStudentForm.dateOfBirth"
                type="date"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- Class -->
            <div>
              <label
                for="add-classId"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Klasse
              </label>
              <select
                id="add-classId"
                v-model="addStudentForm.classId"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Klasse auswählen</option>
                <option value="IT4L">IT4L</option>
                <option value="IT4O">IT4O</option>
                <option value="IT4K">IT4K</option>
              </select>
            </div>

            <!-- Company Name -->
            <div>
              <label
                for="add-companyName"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Unternehmen
              </label>
              <input
                id="add-companyName"
                v-model="addStudentForm.companyName"
                type="text"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="TechCorp GmbH"
              />
            </div>

            <!-- Ausbilder Email -->
            <div>
              <label
                for="add-ausbilderEmail"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ausbilder E-Mail
              </label>
              <input
                id="add-ausbilderEmail"
                v-model="addStudentForm.ausbilderEmail"
                type="email"
                required
                class="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="ausbilder@firma.de"
              />
            </div>

            <!-- Actions -->
            <div
              class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4"
            >
              <button
                type="button"
                @click="closeAddStudentForm"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                :disabled="addingStudent"
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {{ addingStudent ? "Hinzufügen..." : "Schüler hinzufügen" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { apiService } from "@/services/api";
import { emailService } from "@/services/email";
import { useAuthStore } from "@/stores/auth";
import AbsenceForm from "./AbsenceForm.vue";
import CustomSelect from "./CustomSelect.vue";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  class_name: string;
  is_of_age: boolean;
  company_name: string;
  ausbilder_email: string;
  total_absence_days: number;
  pending_absences: number;
  recent_absences: Array<{
    id: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    working_days_count: number;
  }>;
}

const students = ref<Student[]>([]);
const selectedClass = ref("");
const selectedStudent = ref<Student | null>(null);
const isEditing = ref(false);
const showAbsenceForm = ref(false);
const showDeleteConfirmation = ref(false);
const showAddStudentForm = ref(false);
const addStudentForm = ref({
  name: "",
  email: "",
  dateOfBirth: "",
  classId: "",
  companyName: "",
  ausbilderEmail: "",
});
const addingStudent = ref(false);
const editForm = ref({
  ausbilder_email: "",
});
const saving = ref(false);

// Auth store for current user information
const authStore = useAuthStore();

// Class options for the dropdown
const classOptions = [
  { value: "", label: "Alle Klassen" },
  { value: "IT4L", label: "IT4L" },
  { value: "IT4O", label: "IT4O" },
  { value: "IT4K", label: "IT4K" },
];

const filteredStudents = computed(() => {
  if (!selectedClass.value) return students.value;
  return students.value.filter(
    (student) => student.class_name === selectedClass.value
  );
});

const selectStudent = async (student: Student) => {
  // In a real app, this would fetch detailed student data including recent absences
  // For now, we'll simulate the data
  selectedStudent.value = {
    ...student,
    recent_absences: [
      {
        id: "1",
        start_date: "2025-10-07",
        end_date: "2025-10-09",
        reason: "Grippe",
        status: "approved",
        working_days_count: 3,
      },
      {
        id: "2",
        start_date: "2025-09-15",
        end_date: "2025-09-17",
        reason: "Krankheit",
        status: "approved",
        working_days_count: 3,
      },
    ],
  };
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("de-DE");
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "denied":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Genehmigt";
    case "pending":
      return "Ausstehend";
    case "denied":
      return "Abgelehnt";
    default:
      return "Unbekannt";
  }
};

const handleAbsenceSubmit = async (absenceData: {
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  workingDays: number;
  totalDays: number;
}) => {
  try {
    console.log("Submitting absence:", absenceData);

    // Find the student
    const student = students.value.find((s) => s.id === absenceData.studentId);
    if (!student) {
      console.error("Student not found");
      return;
    }

    // Send email via API service
    const emailResult = await apiService.sendAbsenceEmail({
      student: student,
      absenceData: absenceData,
    });

    if (emailResult.success) {
      console.log(
        "Absence report sent successfully to",
        student.ausbilder_email
      );
      showAbsenceForm.value = false;

      // In a real app, you might want to refresh the student data
      // or show a success notification
      console.log(
        `Abwesenheit für ${absenceData.workingDays} Schultage erfolgreich gemeldet und per E-Mail versandt`
      );
    } else {
      console.error("Failed to send absence report:", emailResult.message);
    }
  } catch (error) {
    console.error("Error submitting absence:", error);
  }
};

const startEditing = () => {
  if (selectedStudent.value) {
    isEditing.value = true;
    editForm.value = {
      ausbilder_email: selectedStudent.value.ausbilder_email,
    };
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  editForm.value = {
    ausbilder_email: "",
  };
};

const saveChanges = async () => {
  if (!selectedStudent.value) return;

  saving.value = true;
  try {
    const result = await apiService.updateStudent(selectedStudent.value.id, {
      ausbilder_email: editForm.value.ausbilder_email,
    });

    if (result.success) {
      // Update the local student data
      selectedStudent.value.ausbilder_email = editForm.value.ausbilder_email;

      // Update in the students array
      const studentIndex = students.value.findIndex(
        (s) => s.id === selectedStudent.value?.id
      );
      if (studentIndex !== -1 && students.value[studentIndex]) {
        students.value[studentIndex].ausbilder_email =
          editForm.value.ausbilder_email;
      }

      isEditing.value = false;
      console.log("Student updated successfully");
    } else {
      console.error("Failed to update student:", result.message);
    }
  } catch (error) {
    console.error("Error updating student:", error);
  } finally {
    saving.value = false;
  }
};

const confirmDeleteStudent = async () => {
  if (!selectedStudent.value) return;

  try {
    console.log("Deleting student:", selectedStudent.value.id);

    // Call API service to delete the student
    const result = await apiService.deleteStudent(selectedStudent.value.id);

    if (result.success) {
      // Remove from local array
      const index = students.value.findIndex(
        (s) => s.id === selectedStudent.value!.id
      );
      if (index !== -1) {
        students.value.splice(index, 1);
      }

      // Close sidebar and modal
      selectedStudent.value = null;
      showDeleteConfirmation.value = false;

      console.log("Student deleted successfully");
    } else {
      console.error("Failed to delete student:", result.message);
      alert("Fehler beim Löschen des Schülers: " + result.message);
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    alert("Ein Fehler ist beim Löschen aufgetreten.");
  }
};

const closeAddStudentForm = () => {
  showAddStudentForm.value = false;
  // Reset form
  addStudentForm.value = {
    name: "",
    email: "",
    dateOfBirth: "",
    classId: "",
    companyName: "",
    ausbilderEmail: "",
  };
};

const handleAddStudent = async () => {
  addingStudent.value = true;

  try {
    // Prepare data for student invitation
    const invitationData = {
      name: addStudentForm.value.name,
      email: addStudentForm.value.email,
      dateOfBirth: addStudentForm.value.dateOfBirth,
      role: "student" as const,
      classId: addStudentForm.value.classId,
      companyName: addStudentForm.value.companyName,
      ausbilderEmail: addStudentForm.value.ausbilderEmail,
    };

    // Call the API service to invite the student (no password yet)
    const result = await apiService.inviteStudent({
      first_name: invitationData.name.split(" ")[0] || "Unknown",
      last_name:
        invitationData.name.split(" ").slice(1).join(" ") ||
        invitationData.name.split(" ")[0] ||
        "Unknown",
      email: invitationData.email,
      birthday: invitationData.dateOfBirth,
      role: "student",
      class_id: invitationData.classId,
      company_name: invitationData.companyName,
      ausbilder_email: invitationData.ausbilderEmail,
    });

    if (result.success) {
      // Also add to localStorage for immediate UI update
      const storedUsers = localStorage.getItem("attendanceMockUsers");
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const newUser = {
        id: result.user?.id || crypto.randomUUID(),
        name: invitationData.name,
        email: invitationData.email,
        role: "student",
        classId: invitationData.classId,
        dateOfBirth: invitationData.dateOfBirth,
        companyName: invitationData.companyName,
        ausbilderEmail: invitationData.ausbilderEmail,
        status: "invited", // Student hasn't set password yet
      };

      users.push(newUser);
      localStorage.setItem("attendanceMockUsers", JSON.stringify(users));

      // Generate invitation link
      const invitationLink = `${window.location.origin}/setup-password?token=${result.invitationToken}`;

      // Send actual email invitation
      console.log("📧 Sending invitation email...");
      const emailResult = await emailService.sendStudentInvitation({
        studentEmail: invitationData.email,
        studentName: invitationData.name,
        teacherName: authStore.user?.name || "Lehrkraft",
        schoolName: "Berufsschule ITECH",
        invitationToken: result.invitationToken || "",
        invitationLink: invitationLink,
      });

      closeAddStudentForm();

      // Refresh the student list
      await loadStudents();

      // Show success message based on email result
      if (emailResult.success) {
        alert(
          `✅ Schüler erfolgreich eingeladen!\n\n📧 E-Mail wurde versendet an:\n${invitationData.email}\n\nDer Schüler kann nun sein Passwort einrichten.`
        );
      } else {
        alert(
          `⚠️ Schüler erstellt, aber E-Mail-Versand fehlgeschlagen:\n${emailResult.error}\n\nEinladungslink: ${invitationLink}`
        );
      }
    } else {
      alert("Fehler beim Hinzufügen des Schülers: " + result.message);
    }
  } catch (error) {
    console.error("Error adding student:", error);
    alert("Ein Fehler ist beim Hinzufügen aufgetreten.");
  } finally {
    addingStudent.value = false;
  }
};

const loadStudents = async () => {
  try {
    // Fetch students from API service (includes newly registered students)
    const databaseStudents = await apiService.getStudents();

    // Transform database format to StudentTable format
    students.value = databaseStudents.map((dbStudent) => ({
      id: dbStudent.id || "unknown",
      first_name: dbStudent.first_name,
      last_name: dbStudent.last_name,
      class_name: dbStudent.class_id || "Unknown",
      is_of_age: calculateAge(dbStudent.birthday) >= 18,
      company_name: dbStudent.company_name || "Unbekanntes Unternehmen",
      ausbilder_email: dbStudent.ausbilder_email || "",
      total_absence_days: 0, // Will be calculated from actual absence data
      pending_absences: 0, // Will be calculated from actual absence data
      recent_absences: [], // Will be populated from actual absence data
    }));

    console.log(`Loaded ${students.value.length} students from database`);
  } catch (error) {
    console.error("Error loading students:", error);
    // Fallback to mock data if API fails
    students.value = [
      {
        id: "1",
        first_name: "Max",
        last_name: "Mustermann",
        class_name: "IT4L",
        is_of_age: true,
        company_name: "TechCorp GmbH",
        ausbilder_email: "supervisor@techcorp.de",
        total_absence_days: 5,
        pending_absences: 0,
        recent_absences: [],
      },
      {
        id: "2",
        first_name: "Anna",
        last_name: "Weber",
        class_name: "IT4L",
        is_of_age: true,
        company_name: "InnoSoft AG",
        ausbilder_email: "training@innosoft.de",
        total_absence_days: 2,
        pending_absences: 1,
        recent_absences: [],
      },
    ];
  }
};

// Helper function to calculate age from birthday
const calculateAge = (birthday: string): number => {
  try {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } catch {
    return 18; // Default to adult if we can't parse the date
  }
};

onMounted(() => {
  loadStudents();

  // Set up auto-refresh to update when localStorage changes (new students registered)
  const handleStorageChange = () => {
    loadStudents();
  };

  // Listen for storage changes from other tabs/windows
  window.addEventListener("storage", handleStorageChange);

  // Set up periodic refresh every 30 seconds to catch local changes
  const refreshInterval = setInterval(() => {
    loadStudents();
  }, 30000);

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener("storage", handleStorageChange);
    clearInterval(refreshInterval);
  });
});
</script>

<style scoped>
/* Fix dropdown positioning to appear below the select element */
select {
  position: relative;
  z-index: 10;
}

/* Ensure dropdown options appear below the select */
select:focus {
  z-index: 20;
}

/* Additional fix for webkit browsers */
select option {
  position: relative;
}
</style>
