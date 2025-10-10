import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginView from "@/views/LoginView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import DashboardView from "@/views/DashboardView.vue";
import TeacherDashboard from "@/views/TeacherDashboard.vue";
import StudentDashboard from "@/views/StudentDashboard.vue";
import PasswordSetupView from "@/views/PasswordSetupView.vue";
import PrivacyView from "@/views/PrivacyView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: RegistrationView,
      meta: { requiresGuest: true },
    },
    {
      path: "/setup-password",
      name: "password-setup",
      component: PasswordSetupView,
      // Allow access even if logged in - for student account activation
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/teacher",
      name: "teacher",
      component: TeacherDashboard,
      meta: { requiresAuth: true, requiresRole: "teacher" },
    },
    {
      path: "/student",
      name: "student",
      component: StudentDashboard,
      meta: { requiresAuth: true, requiresRole: "student" },
    },
    {
      path: "/datenschutz",
      name: "privacy",
      component: PrivacyView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next("/login");
    return;
  }

  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    next("/dashboard");
    return;
  }

  // Check role-based access
  if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    next("/dashboard");
    return;
  }

  next();
});

export default router;
