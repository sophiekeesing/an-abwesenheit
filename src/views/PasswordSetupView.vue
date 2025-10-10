<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <div
          class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center"
        >
          <svg
            class="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
        </div>
      </div>
      <h2
        class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
      >
        Passwort einrichten
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Erstellen Sie Ihr Passwort um Ihr Konto zu aktivieren
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
      >
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Überprüfe Einladung...
          </p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center">
          <div
            class="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mx-auto"
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
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Ungültiger Link
          </h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ error }}
          </p>
          <router-link
            to="/login"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Zur Anmeldung
          </router-link>
        </div>

        <!-- Success State -->
        <div v-else-if="success" class="text-center">
          <div
            class="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto"
          >
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Passwort erfolgreich eingerichtet!
          </h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
          </p>
          <button
            @click="loginStudent"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Jetzt anmelden
          </button>
        </div>

        <!-- Password Setup Form -->
        <form v-else @submit.prevent="handlePasswordSetup" class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Willkommen, {{ studentInfo?.name }}!
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Ihr Lehrer hat Sie zur Plattform eingeladen. Bitte erstellen Sie
              ein sicheres Passwort für Ihr Konto.
            </p>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Passwort
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                name="password"
                type="password"
                required
                minlength="8"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Mindestens 8 Zeichen"
              />
            </div>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Passwort bestätigen
            </label>
            <div class="mt-1">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Passwort wiederholen"
              />
            </div>
            <p
              v-if="passwordMismatch"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              Passwörter stimmen nicht überein
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Passwort-Anforderungen:
            </h4>
            <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li class="flex items-center">
                <span
                  :class="
                    password.length >= 8
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  "
                >
                  {{ password.length >= 8 ? "✓" : "○" }}
                </span>
                <span class="ml-2">Mindestens 8 Zeichen</span>
              </li>
              <li class="flex items-center">
                <span
                  :class="
                    /[A-Z]/.test(password)
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  "
                >
                  {{ /[A-Z]/.test(password) ? "✓" : "○" }}
                </span>
                <span class="ml-2">Ein Großbuchstabe</span>
              </li>
              <li class="flex items-center">
                <span
                  :class="
                    /[a-z]/.test(password)
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  "
                >
                  {{ /[a-z]/.test(password) ? "✓" : "○" }}
                </span>
                <span class="ml-2">Ein Kleinbuchstabe</span>
              </li>
              <li class="flex items-center">
                <span
                  :class="
                    /[0-9]/.test(password)
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  "
                >
                  {{ /[0-9]/.test(password) ? "✓" : "○" }}
                </span>
                <span class="ml-2">Eine Zahl</span>
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              :disabled="!isPasswordValid || submitting"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">Einrichten...</span>
              <span v-else>Passwort einrichten</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { apiService } from "@/services/api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref("");
const success = ref(false);
const submitting = ref(false);
const password = ref("");
const confirmPassword = ref("");
const studentInfo = ref<{ name: string; email: string } | null>(null);

const passwordMismatch = computed(() => {
  return confirmPassword.value && password.value !== confirmPassword.value;
});

const isPasswordValid = computed(() => {
  return (
    password.value.length >= 8 &&
    /[A-Z]/.test(password.value) &&
    /[a-z]/.test(password.value) &&
    /[0-9]/.test(password.value) &&
    password.value === confirmPassword.value
  );
});

const handlePasswordSetup = async () => {
  if (!isPasswordValid.value) {
    return;
  }

  submitting.value = true;

  try {
    console.log(
      "🔐 Setting password in database for:",
      studentInfo.value?.email
    );

    // Set password in the real database
    const result = await apiService.setUserPassword(
      studentInfo.value?.email || "",
      password.value
    );

    if (!result.success) {
      error.value = result.message || "Fehler beim Einrichten des Passworts";
      return;
    }

    console.log("✅ Password saved to database successfully");

    // Also update localStorage for immediate frontend compatibility
    const storedPasswords = localStorage.getItem("attendancePasswords");
    const passwords = storedPasswords ? JSON.parse(storedPasswords) : {};
    passwords[studentInfo.value?.email || ""] = password.value;
    localStorage.setItem("attendancePasswords", JSON.stringify(passwords));

    // Update auth store's password cache
    authStore.setUserPassword(studentInfo.value?.email || "", password.value);
    console.log("🔑 Password saved for:", studentInfo.value?.email);

    // Update user in localStorage (for frontend consistency)
    const storedUsers = localStorage.getItem("attendanceMockUsers");
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const userIndex = users.findIndex(
      (user: { email: string }) => user.email === studentInfo.value?.email
    );

    if (userIndex !== -1) {
      users[userIndex].status = "active";
      users[userIndex].role = "student";
      users[userIndex].name = studentInfo.value?.name || users[userIndex].name;
      console.log("📝 Updated existing user:", users[userIndex]);
    } else {
      const newStudent = {
        id: (users.length + 1).toString(),
        name: studentInfo.value?.name || "Student",
        email: studentInfo.value?.email || "",
        role: "student",
        status: "active",
        classId: "IT4L",
        companyName: "",
        ausbilderEmail: "",
      };
      users.push(newStudent);
      console.log("👤 Created new student user:", newStudent);
    }

    localStorage.setItem("attendanceMockUsers", JSON.stringify(users));
    console.log("💾 All users in localStorage:", users);

    success.value = true;
  } catch (err) {
    console.error("❌ Password setup failed:", err);
    error.value = "Ein Fehler ist beim Einrichten des Passworts aufgetreten.";
  } finally {
    submitting.value = false;
  }
};

const loginStudent = async () => {
  if (!studentInfo.value?.email || !password.value) {
    router.push("/login");
    return;
  }

  try {
    // Refresh auth store password cache to pick up newly set password
    authStore.refreshPasswords();

    console.log("🔑 Attempting login for:", studentInfo.value.email);
    const loginSuccess = await authStore.login(
      studentInfo.value.email,
      password.value
    );

    if (loginSuccess) {
      console.log("✅ Login successful, user role:", authStore.user?.role);
      console.log("👤 Logged in user:", authStore.user);

      // Double-check the user role and redirect accordingly
      if (authStore.user?.role === "student") {
        console.log("🎓 Redirecting to student dashboard");
        router.push("/student");
      } else if (authStore.user?.role === "teacher") {
        console.log("🏫 User is teacher, redirecting to teacher dashboard");
        router.push("/teacher");
      } else {
        console.log("❓ Unknown role, redirecting to general dashboard");
        router.push("/dashboard");
      }
    } else {
      console.log("❌ Login failed, redirecting to login page");
      router.push("/login");
    }
  } catch (error) {
    console.error("Auto-login failed:", error);
    router.push("/login");
  }
};

onMounted(async () => {
  try {
    const token = route.query.token as string;

    if (!token) {
      error.value = "Fehlender Einladungstoken. Bitte überprüfen Sie den Link.";
      loading.value = false;
      return;
    }

    // TODO: Validate token with API
    // For now, extract email from token (mock implementation)
    try {
      const decoded = JSON.parse(atob(token));
      studentInfo.value = {
        name: decoded.name || "Student",
        email: decoded.email,
      };
    } catch {
      error.value =
        "Ungültiger Einladungstoken. Bitte wenden Sie sich an Ihren Lehrer.";
      loading.value = false;
      return;
    }

    loading.value = false;
  } catch {
    error.value = "Ein Fehler ist beim Laden der Einladung aufgetreten.";
    loading.value = false;
  }
});
</script>
