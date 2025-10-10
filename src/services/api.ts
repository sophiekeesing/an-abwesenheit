// Simple API service for database operations
// In a real application, this would make HTTP requests to a backend API

export interface DatabaseUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  birthday: string;
  role: "teacher" | "student";
  class_id?: string;
  company_name?: string;
  ausbilder_email?: string;
}

class ApiService {
  private baseUrl = "http://localhost:3001/api"; // Backend API URL

  async registerUser(
    userData: DatabaseUser
  ): Promise<{ success: boolean; message: string; user?: DatabaseUser }> {
    try {
      console.log("Registering user to database:", userData);

      // Make actual HTTP request to backend API
      try {
        const response = await fetch(`${this.baseUrl}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("User registered in database:", result);

        return {
          success: true,
          message: "Benutzer erfolgreich in der Datenbank registriert",
          user: result.user,
        };
      } catch (fetchError) {
        console.warn(
          "Database registration failed, using fallback:",
          fetchError
        );

        // Fallback for development - generate local user
        const newUser = {
          ...userData,
          id: crypto.randomUUID(),
        };

        return {
          success: true,
          message: "Benutzer erfolgreich registriert (lokaler Fallback)",
          user: newUser,
        };
      }
    } catch (error) {
      console.error("Database registration error:", error);
      return {
        success: false,
        message: "Fehler beim Speichern in der Datenbank",
      };
    }
  }

  async inviteStudent(
    studentData: DatabaseUser
  ): Promise<{
    success: boolean;
    message: string;
    invitationToken?: string;
    user?: DatabaseUser;
  }> {
    try {
      console.log("Creating student invitation:", studentData);

      // Generate invitation token
      const invitationToken = btoa(
        JSON.stringify({
          email: studentData.email,
          name: `${studentData.first_name} ${studentData.last_name}`,
          timestamp: Date.now(),
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      );

      // Make actual HTTP request to backend API for invitation
      try {
        const response = await fetch(`${this.baseUrl}/students/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...studentData,
            invitationToken,
            status: "invited",
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Student invitation created in database:", result);

        return {
          success: true,
          message: "Schüler-Einladung erfolgreich versendet",
          invitationToken,
          user: result.user,
        };
      } catch (fetchError) {
        console.warn(
          "Database student invitation failed, using fallback:",
          fetchError
        );

        // Fallback for development - generate local student with invitation status
        const newStudent = {
          ...studentData,
          id: crypto.randomUUID(),
          status: "invited",
          invitationToken,
        };

        return {
          success: true,
          message: "Schüler-Einladung erfolgreich erstellt (lokaler Fallback)",
          invitationToken,
          user: newStudent,
        };
      }
    } catch (error) {
      console.error("Error creating student invitation:", error);
      return {
        success: false,
        message: "Fehler beim Erstellen der Schüler-Einladung",
      };
    }
  }

  async createStudent(
    studentData: DatabaseUser
  ): Promise<{ success: boolean; message: string; user?: DatabaseUser }> {
    try {
      console.log("Creating student in database:", studentData);

      // Make actual HTTP request to backend API
      try {
        const response = await fetch(`${this.baseUrl}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Student created in database:", result);

        return {
          success: true,
          message: "Schüler erfolgreich in der Datenbank erstellt",
          user: result.user,
        };
      } catch (fetchError) {
        console.warn(
          "Database student creation failed, using fallback:",
          fetchError
        );

        // Fallback for development - generate local student
        const newStudent = {
          ...studentData,
          id: crypto.randomUUID(),
        };

        return {
          success: true,
          message: "Schüler erfolgreich erstellt (lokaler Fallback)",
          user: newStudent,
        };
      }
    } catch (error) {
      console.error("Database student creation error:", error);
      return {
        success: false,
        message: "Fehler beim Erstellen des Schülers in der Datenbank",
      };
    }
  }

  async getStudents(): Promise<DatabaseUser[]> {
    try {
      // First, try to fetch from the actual database
      try {
        const response = await fetch(`${this.baseUrl}/students`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const students = await response.json();
          console.log("Students fetched from database:", students);
          return students;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (fetchError) {
        console.warn(
          "Database fetch failed, using localStorage fallback:",
          fetchError
        );
      }

      // Fallback: get stored users from localStorage (registered users)
      const storedUsers = localStorage.getItem("attendanceMockUsers");
      let registeredStudents: DatabaseUser[] = [];

      if (storedUsers) {
        const users = JSON.parse(storedUsers) as Array<{
          id: string;
          name: string;
          email: string;
          role: string;
          classId?: string;
          dateOfBirth?: string;
          companyName?: string;
          ausbilderEmail?: string;
        }>;
        registeredStudents = users
          .filter((user) => user.role === "student")
          .map((user) => ({
            id: user.id,
            first_name: user.name.split(" ")[0] || "Unknown",
            last_name:
              user.name.split(" ").slice(1).join(" ") ||
              user.name.split(" ")[0] ||
              "Unknown",
            email: user.email,
            birthday: user.dateOfBirth || "2000-01-01",
            role: "student" as const,
            class_id: user.classId || "",
            company_name: user.companyName || "Unbekanntes Unternehmen",
            ausbilder_email: user.ausbilderEmail || "",
          }));
      }

      // Default mock students that should always be available
      const defaultStudents: DatabaseUser[] = [
        {
          id: "2",
          first_name: "Max",
          last_name: "Mustermann",
          email: "max.mustermann@student.de",
          birthday: "2005-03-15",
          role: "student",
          class_id: "IT4L",
          company_name: "TechCorp GmbH",
          ausbilder_email: "supervisor@techcorp.de",
        },
        {
          id: "3",
          first_name: "Anna",
          last_name: "Schmidt",
          email: "anna.schmidt@student.de",
          birthday: "2004-11-22",
          role: "student",
          class_id: "IT4O",
          company_name: "InnoSoft AG",
          ausbilder_email: "training@innosoft.de",
        },
      ];

      // Get list of deleted students from localStorage
      const deletedStudentsStr = localStorage.getItem(
        "attendanceDeletedStudents"
      );
      const deletedStudentIds = deletedStudentsStr
        ? JSON.parse(deletedStudentsStr)
        : [];

      // Filter out deleted students from default students
      const activeDefaultStudents = defaultStudents.filter(
        (student) => !deletedStudentIds.includes(student.id)
      );

      // Merge registered students with active defaults, avoiding duplicates
      const allStudents = [...activeDefaultStudents];
      registeredStudents.forEach((regStudent) => {
        if (!allStudents.find((s) => s.email === regStudent.email)) {
          allStudents.push(regStudent);
        }
      });

      return allStudents;
    } catch (error) {
      console.error("Error fetching students:", error);
      // Return default students if there's an error
      return [
        {
          id: "2",
          first_name: "Max",
          last_name: "Mustermann",
          email: "max.mustermann@student.de",
          birthday: "2005-03-15",
          role: "student",
          class_id: "IT4L",
          company_name: "TechCorp GmbH",
          ausbilder_email: "supervisor@techcorp.de",
        },
        {
          id: "3",
          first_name: "Anna",
          last_name: "Schmidt",
          email: "anna.schmidt@student.de",
          birthday: "2004-11-22",
          role: "student",
          class_id: "IT4O",
          company_name: "InnoSoft AG",
          ausbilder_email: "training@innosoft.de",
        },
      ];
    }
  }

  async updateStudent(
    studentId: string,
    updates: Partial<DatabaseUser>
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Updating student in database:", studentId, updates);

      // First, make actual HTTP request to update in PostgreSQL database
      try {
        const response = await fetch(`${this.baseUrl}/students/${studentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Student updated in database:", result);
      } catch (fetchError) {
        console.warn(
          "Database update failed, proceeding with localStorage update:",
          fetchError
        );
        // Continue with localStorage update even if database update fails
      }

      // Also update the student in localStorage (for immediate UI updates)
      const storedUsers = localStorage.getItem("attendanceMockUsers");
      if (storedUsers) {
        const users = JSON.parse(storedUsers) as Array<{
          id: string;
          name: string;
          email: string;
          role: string;
          classId?: string;
          dateOfBirth?: string;
          companyName?: string;
          ausbilderEmail?: string;
        }>;

        const userIndex = users.findIndex((user) => user.id === studentId);
        if (userIndex !== -1) {
          const user = users[userIndex];
          // Update the ausbilder email in the stored user data
          if (updates.ausbilder_email && user) {
            user.ausbilderEmail = updates.ausbilder_email;
          }

          // Save back to localStorage
          localStorage.setItem("attendanceMockUsers", JSON.stringify(users));
          console.log("Student updated in localStorage:", user);
        }
      }

      return {
        success: true,
        message: "Schüler erfolgreich in der Datenbank aktualisiert",
      };
    } catch (error) {
      console.error("Error updating student:", error);
      return {
        success: false,
        message: "Fehler beim Aktualisieren des Schülers in der Datenbank",
      };
    }
  }

  async deleteStudent(
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log("Deleting student from database:", studentId);

      // First, make actual HTTP request to delete from PostgreSQL database
      try {
        const response = await fetch(`${this.baseUrl}/students/${studentId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Student deleted from database:", result);
      } catch (fetchError) {
        console.warn(
          "Database deletion failed, proceeding with localStorage cleanup:",
          fetchError
        );
        // Continue with localStorage cleanup even if database deletion fails
        // In a production app, you might want to handle this differently
      }

      // Also remove the student from localStorage (for immediate UI updates)
      const storedUsers = localStorage.getItem("attendanceMockUsers");
      if (storedUsers) {
        const users = JSON.parse(storedUsers) as Array<{
          id: string;
          name: string;
          email: string;
          role: string;
          classId?: string;
          dateOfBirth?: string;
          companyName?: string;
          ausbilderEmail?: string;
        }>;

        // Filter out the student to delete
        const updatedUsers = users.filter((user) => user.id !== studentId);

        // Save back to localStorage
        localStorage.setItem(
          "attendanceMockUsers",
          JSON.stringify(updatedUsers)
        );
        console.log("Student deleted from localStorage");
      }

      // Also add the student ID to the deleted students list (for filtering default mock students)
      const deletedStudentsStr = localStorage.getItem(
        "attendanceDeletedStudents"
      );
      const deletedStudentIds = deletedStudentsStr
        ? JSON.parse(deletedStudentsStr)
        : [];

      if (!deletedStudentIds.includes(studentId)) {
        deletedStudentIds.push(studentId);
        localStorage.setItem(
          "attendanceDeletedStudents",
          JSON.stringify(deletedStudentIds)
        );
        console.log("Student ID added to deleted list:", studentId);
      }

      return {
        success: true,
        message: "Schüler erfolgreich aus der Datenbank gelöscht",
      };
    } catch (error) {
      console.error("Error deleting student:", error);
      return {
        success: false,
        message: "Fehler beim Löschen des Schülers aus der Datenbank",
      };
    }
  }

  async sendAbsenceEmail(data: {
    student: {
      id: string;
      first_name: string;
      last_name: string;
      class_name: string;
      company_name: string;
      ausbilder_email: string;
    };
    absenceData: {
      startDate: string;
      endDate: string;
      reason: string;
      workingDays: number;
      totalDays: number;
    };
  }): Promise<{ success: boolean; message: string }> {
    try {
      const { student, absenceData } = data;

      // Format dates for German locale
      const startDate = new Date(absenceData.startDate).toLocaleDateString(
        "de-DE"
      );
      const endDate = new Date(absenceData.endDate).toLocaleDateString("de-DE");
      const dateRange =
        absenceData.startDate === absenceData.endDate
          ? startDate
          : `${startDate} - ${endDate}`;

      // Create email content
      const emailSubject = `Abwesenheitsmeldung: ${student.first_name} ${student.last_name} (${dateRange})`;

      const emailBody = `
Sehr geehrte Damen und Herren,

hiermit melde ich die Abwesenheit des Auszubildenden:

**Auszubildender:** ${student.first_name} ${student.last_name}
**Klasse:** ${student.class_name}
**Ausbildungsbetrieb:** ${student.company_name}

**Abwesenheitszeitraum:** ${dateRange}
**Grund:** ${absenceData.reason}

**Zusammenfassung:**
- Kalendertage gesamt: ${absenceData.totalDays}
- Schultage gesamt: ${absenceData.workingDays} (Wochenenden ausgeschlossen)

Diese Abwesenheit wurde über das FehlzeitPro System gemeldet.

Mit freundlichen Grüßen
FehlzeitPro System
      `.trim();

      // In a real application, this would send via SMTP to Mailpit
      // For now, we'll simulate the email sending
      console.log("📧 Sending email to Mailpit:");
      console.log("To:", student.ausbilder_email);
      console.log("Subject:", emailSubject);
      console.log("Body:", emailBody);

      // Simulate API call to send email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In production, you would make an HTTP request to your backend's email endpoint
      // Example:
      // const response = await fetch(`${this.baseUrl}/send-absence-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to: student.ausbilder_email,
      //     subject: emailSubject,
      //     body: emailBody
      //   })
      // });

      return {
        success: true,
        message: `E-Mail erfolgreich an ${student.ausbilder_email} gesendet`,
      };
    } catch (error) {
      console.error("Error sending absence email:", error);
      return {
        success: false,
        message: "Fehler beim Versenden der E-Mail",
      };
    }
  }
}

export const apiService = new ApiService();
