import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { apiService, type DatabaseUser } from "@/services/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "student";
  dateOfBirth?: string; // Date of birth for registration
  classId?: string; // For students - which class they belong to
  classes?: string[]; // For teachers - which classes they teach
  companyName?: string; // For students - their company/training company
  ausbilderEmail?: string; // For students - their trainer's email
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const isLoggedIn = computed(() => user.value !== null);
  const isTeacher = computed(() => user.value?.role === "teacher");
  const isStudent = computed(() => user.value?.role === "student");

  // Mock user database - load from localStorage and merge with defaults
  const getStoredUsers = (): User[] => {
    try {
      const stored = localStorage.getItem("attendanceMockUsers");
      const storedUsers = stored ? JSON.parse(stored) : [];

      // Default users that should always be available
      const defaultUsers = [
        {
          id: "1",
          name: "Thomas Müller",
          email: "mueller@school.de",
          role: "teacher" as const,
          classes: ["IT4L", "IT4O", "IT4K"],
        },
        {
          id: "2",
          name: "Max Mustermann",
          email: "max.mustermann@student.de",
          role: "student" as const,
          classId: "IT4L",
          companyName: "TechCorp GmbH",
          ausbilderEmail: "supervisor@techcorp.de",
        },
        {
          id: "3",
          name: "Anna Schmidt",
          email: "anna.schmidt@student.de",
          role: "student" as const,
          classId: "IT4O",
          companyName: "InnoSoft AG",
          ausbilderEmail: "training@innosoft.de",
        },
        {
          id: "4",
          name: "Sandra Meyer",
          email: "sandra.meyer@teacher.de",
          role: "teacher" as const,
          classes: ["IT4L", "IT4O", "IT4K"],
        },
      ];

      // Merge stored users with defaults, avoiding duplicates
      const allUsers: User[] = [...defaultUsers];
      if (Array.isArray(storedUsers)) {
        storedUsers.forEach((storedUser: User) => {
          if (!allUsers.find((u) => u.email === storedUser.email)) {
            allUsers.push(storedUser);
          }
        });
      }

      return allUsers;
    } catch {
      return [
        {
          id: "1",
          name: "Thomas Müller",
          email: "mueller@school.de",
          role: "teacher",
          classes: ["IT4L", "IT4O", "IT4K"],
        },
        {
          id: "2",
          name: "Max Mustermann",
          email: "max.mustermann@student.de",
          role: "student",
          classId: "IT4L",
        },
        {
          id: "3",
          name: "Anna Schmidt",
          email: "anna.schmidt@student.de",
          role: "student",
          classId: "IT4O",
        },
        {
          id: "4",
          name: "Sandra Meyer",
          email: "sandra.meyer@teacher.de",
          role: "teacher",
          classes: ["IT4L", "IT4O", "IT4K"],
        },
      ];
    }
  };

  const mockUsers = ref<User[]>(getStoredUsers());

  const saveMockUsers = () => {
    localStorage.setItem(
      "attendanceMockUsers",
      JSON.stringify(mockUsers.value)
    );
  };

  // Simple password storage for mock system - load from localStorage
  const getStoredPasswords = (): Record<string, string> => {
    try {
      const stored = localStorage.getItem("attendancePasswords");
      return stored
        ? JSON.parse(stored)
        : {
            "mueller@school.de": "password123",
            "max.mustermann@student.de": "password123",
            "anna.schmidt@student.de": "password123",
            "sandra.meyer@teaacher.de": "password123",
          };
    } catch {
      return {
        "mueller@school.de": "password123",
        "max.mustermann@student.de": "password123",
        "anna.schmidt@student.de": "password123",
        "sandra.meyer@teaacher.de": "password123",
      };
    }
  };

  const userPasswords = ref<Record<string, string>>(getStoredPasswords());

  const savePasswords = () => {
    localStorage.setItem(
      "attendancePasswords",
      JSON.stringify(userPasswords.value)
    );
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    const foundUser = mockUsers.value.find((u) => u.email === email);
    const storedPassword = userPasswords.value[email];

    if (foundUser && storedPassword && password === storedPassword) {
      user.value = foundUser;
      localStorage.setItem("attendanceUser", JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    dateOfBirth: string;
    role: "student" | "teacher";
    classId?: string;
    companyName?: string;
    ausbilderEmail?: string;
    classes?: string[];
  }): Promise<{ success: boolean; message: string }> => {
    // Check if email already exists in mock users
    const existingUser = mockUsers.value.find(
      (u) => u.email === userData.email
    );
    if (existingUser) {
      return { success: false, message: "E-Mail-Adresse bereits registriert" };
    }

    try {
      // Prepare data for database insertion
      const nameParts = userData.name.trim().split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || firstName;

      const databaseUser: DatabaseUser = {
        first_name: firstName,
        last_name: lastName,
        email: userData.email,
        birthday: userData.dateOfBirth,
        role: userData.role,
        class_id: userData.role === "student" ? userData.classId : undefined,
        // For students, set the company name and ausbilder email if provided
        company_name:
          userData.role === "student" ? userData.companyName || "" : undefined,
        ausbilder_email:
          userData.role === "student" ? userData.ausbilderEmail : undefined,
      };

      // Save to database
      const dbResult = await apiService.registerUser(databaseUser);
      if (!dbResult.success) {
        return { success: false, message: dbResult.message };
      }

      // Create user object for frontend
      const newUser: User = {
        id: dbResult.user?.id || (mockUsers.value.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        dateOfBirth: userData.dateOfBirth,
        classId: userData.role === "student" ? userData.classId : undefined,
        classes: userData.role === "teacher" ? userData.classes : undefined,
        companyName:
          userData.role === "student" ? userData.companyName : undefined,
        ausbilderEmail:
          userData.role === "student" ? userData.ausbilderEmail : undefined,
      };

      // Add to mock users array (for frontend consistency)
      mockUsers.value.push(newUser);
      saveMockUsers(); // Persist to localStorage

      // Store the password for future logins
      userPasswords.value[userData.email] = userData.password;
      savePasswords(); // Persist to localStorage

      // Auto-login the new user
      user.value = newUser;
      localStorage.setItem("attendanceUser", JSON.stringify(newUser));

      return {
        success: true,
        message:
          "Registrierung erfolgreich - Benutzer wurde zur Datenbank hinzugefügt",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Fehler bei der Registrierung" };
    }
  };

  const updateUserClass = (classId: string) => {
    if (user.value) {
      const userIndex = mockUsers.value.findIndex(
        (u) => u.id === user.value!.id
      );
      if (userIndex !== -1 && mockUsers.value[userIndex]) {
        mockUsers.value[userIndex].classId = classId;
        user.value.classId = classId;
        localStorage.setItem("attendanceUser", JSON.stringify(user.value));
        saveMockUsers(); // Persist changes
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
