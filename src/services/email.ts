// Email service for sending student invitations
// Now uses backend API for real email sending via Gmail SMTP

export interface EmailService {
  sendStudentInvitation(params: {
    studentEmail: string;
    studentName: string;
    teacherName: string;
    schoolName: string;
    invitationToken: string;
    invitationLink: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Production Email Service - Calls backend API
class ApiEmailService implements EmailService {
  private backendUrl = "http://localhost:3001";

  async sendStudentInvitation(params: {
    studentEmail: string;
    studentName: string;
    teacherName: string;
    schoolName: string;
    invitationToken: string;
    invitationLink: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log("📧 SENDING EMAIL VIA BACKEND API");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`To: ${params.studentEmail}`);
    console.log(`Student: ${params.studentName}`);
    console.log(`Teacher: ${params.teacherName}`);
    console.log(`School: ${params.schoolName}`);
    console.log(`Link: ${params.invitationLink}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    try {
      const response = await fetch(`${this.backendUrl}/api/send-invitation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentEmail: params.studentEmail,
          studentName: params.studentName,
          teacherName: params.teacherName,
          schoolName: params.schoolName,
          invitationLink: params.invitationLink,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("✅ EMAIL SENT SUCCESSFULLY!");
        console.log("Message ID:", result.messageId);
        console.log("Via Gmail SMTP: itech.school.attendance@gmail.com");

        return {
          success: true,
          messageId: result.messageId,
        };
      } else {
        console.error("❌ Backend API error:", result.error);
        return {
          success: false,
          error: result.error || "Backend API error",
        };
      }
    } catch (error) {
      console.error("❌ Failed to connect to email backend:", error);

      // Check if backend is running
      try {
        const healthCheck = await fetch(`${this.backendUrl}/api/health`);
        if (!healthCheck.ok) {
          return {
            success: false,
            error:
              "Email backend is not responding. Please start the email server.",
          };
        }
      } catch {
        return {
          success: false,
          error:
            "Email backend is not running. Please start: cd email-backend && npm start",
        };
      }

      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

// Export the service
export const emailService: EmailService = new ApiEmailService();

/*
🎉 EMAIL BACKEND IS NOW READY!

HOW TO USE:
1. Start the backend: cd email-backend && npm start
2. Backend runs on http://localhost:3001
3. Frontend will automatically send emails via the backend API
4. Real emails will be sent using Gmail SMTP!

WHAT HAPPENS NOW:
✅ Frontend calls backend API
✅ Backend uses nodemailer + Gmail SMTP  
✅ Real emails sent to students
✅ Completely FREE (500 emails/day)

TROUBLESHOOTING:
- If you see "backend not running" error, start: cd email-backend && npm start
- Check backend console for email sending logs
- Gmail account: itech.school.attendance@gmail.com
*/
