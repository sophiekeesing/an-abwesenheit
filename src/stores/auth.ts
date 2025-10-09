import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  dateOfBirth?: string; // Date of birth for registration
  classId?: string; // For students - which class they belong to
  classes?: string[]; // For teachers - which classes they teach
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);
  const isTeacher = computed(() => user.value?.role === "teacher");
  const isStudent = computed(() => user.value?.role === "student");

  // Mock users for development
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Herr Mueller",
      email: "mueller@school.de",
      role: "teacher",
      classes: ["IT4L", "IT4O", "IT4K"],
    },
    {
      id: "2",
      name: "Max Mustermann",
      email: "max.mustermann@student.de",
      role: "student",
      dateOfBirth: "2005-03-15",
      classId: "IT4L",
    },
    {
      id: "3",
      name: "Anna Schmidt",
      email: "anna.schmidt@student.de",
      role: "student",
      dateOfBirth: "2005-07-22",
      classId: "IT4O",
    },
    {
      id: "4",
      name: "Frau Meyer",
      email: "sandra.meyer@teaacher.de",
      role: "teacher",
      classes: ["IT4L", "IT4O", "IT4K"],
    },
  ];

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = mockUsers.find((u) => u.email === email);

    if (foundUser && password === "password123") {
      user.value = foundUser;
      localStorage.setItem("attendanceUser", JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (userData: {
    name: string;
    email: string;
    dateOfBirth: string;
    role: "student" | "teacher";
    classId?: string;
    classes?: string[];
  }): Promise<{ success: boolean; message: string }> => {
    // Check if email already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: "E-Mail-Adresse bereits registriert" };
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      dateOfBirth: userData.dateOfBirth,
      classId: userData.role === "student" ? userData.classId : undefined,
      classes: userData.role === "teacher" ? userData.classes : undefined,
    };

    // Add to mock users array
    mockUsers.push(newUser);

    // Auto-login the new user
    user.value = newUser;
    localStorage.setItem("attendanceUser", JSON.stringify(newUser));

    return { success: true, message: "Registrierung erfolgreich" };
  };

  const updateUserClass = (classId: string) => {
    if (user.value && user.value.role === "student") {
      user.value.classId = classId;
      localStorage.setItem("attendanceUser", JSON.stringify(user.value));

      // Update in mock users array
      const userIndex = mockUsers.findIndex((u) => u.id === user.value!.id);
      if (userIndex !== -1 && mockUsers[userIndex]) {
        mockUsers[userIndex].classId = classId;
      }
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("attendanceUser");
  };

  const restoreSession = () => {
    const savedUser = localStorage.getItem("attendanceUser");
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (error) {
        console.error("Failed to restore user session:", error);
        localStorage.removeItem("attendanceUser");
      }
    }
  };

  return {
    user,
    isLoggedIn,
    isTeacher,
    isStudent,
    login,
    register,
    logout,
    restoreSession,
    updateUserClass,
  };
});
