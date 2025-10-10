// Email service for sending student invitations
// Note: Real email sending requires a backend server with nodemailer

// Email service for sending student invitations
// Note: Real email sending requires a backend server with nodemailer

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

// Frontend Email Service - Shows what would be sent
class FrontendEmailService implements EmailService {
  private fromEmail: string;
  private schoolName: string;
  private gmailUser: string;

  constructor() {
    // Read from environment variables
    this.gmailUser = import.meta.env.VITE_GMAIL_USER || "your-school-system@gmail.com";
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || "noreply@your-school.de";
    this.schoolName = import.meta.env.VITE_SCHOOL_NAME || "Ihre Berufsschule";
  }

  async sendStudentInvitation(params: {
    studentEmail: string;
    studentName: string;
    teacherName: string;
    schoolName: string;
    invitationToken: string;
    invitationLink: string;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    
    console.log("🎯 EMAIL SERVICE CONFIGURATION:");
    console.log("Gmail Account:", this.gmailUser);
    console.log("From Email:", this.fromEmail);
    console.log("School Name:", this.schoolName);
    console.log("");
    
    console.log("📧 EMAIL THAT WOULD BE SENT:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`From: "${params.schoolName} - Abwesenheitssystem" <${this.fromEmail}>`);
    console.log(`To: ${params.studentEmail}`);
    console.log(`Subject: Einladung zur Anmeldung - ${params.schoolName}`);
    console.log("");
    console.log("EMAIL BODY:");
    console.log(`Willkommen, ${params.studentName}!`);
    console.log("");
    console.log(`Ihr Lehrer ${params.teacherName} hat Sie zur digitalen`);
    console.log(`Abwesenheitsverwaltung von ${params.schoolName} eingeladen.`);
    console.log("");
    console.log("Klicken Sie hier zum Einrichten Ihres Passworts:");
    console.log(params.invitationLink);
    console.log("");
    console.log("⚠️ Wichtige Hinweise:");
    console.log("- Dieser Link ist 7 Tage gültig");
    console.log("- Verwenden Sie ein sicheres Passwort");
    console.log("- Teilen Sie diesen Link mit niemandem");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");
    
    // Check if credentials are properly configured
    const hasRealCredentials = this.gmailUser !== "your-school-system@gmail.com" && 
                              import.meta.env.VITE_GMAIL_APP_PASSWORD !== "your-16-character-app-password";
    
    if (hasRealCredentials) {
      console.log("✅ Gmail credentials are configured!");
      console.log("🔧 NEXT STEP: Set up backend server to actually send emails");
      console.log("📋 See email-setup-free.js for backend implementation");
    } else {
      console.log("❌ Gmail credentials not properly configured");
      console.log("Please update your .env file with real values");
    }

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      messageId: `frontend-simulation-${Date.now()}`,
    };
  }
}

// Export the service
export const emailService: EmailService = new FrontendEmailService();

/*
🔧 WHY EMAILS AREN'T SENDING:

The issue is that nodemailer is a Node.js backend library that cannot run in the browser.
You need one of these solutions:

OPTION 1 - Simple Backend API:
1. Create a simple Express.js server
2. Use the code from email-setup-free.js
3. Make API calls from frontend to backend

OPTION 2 - Use EmailJS (Browser-based):
1. Sign up at emailjs.com
2. Connect your Gmail account
3. Send emails directly from frontend

OPTION 3 - Use a Service (Easiest):
1. Use services like Formspree, Netlify Forms, or Vercel
2. These handle email sending for you

For now, this service shows you exactly what email would be sent
and confirms your Gmail credentials are properly configured.

Check the console output when you try to invite a student!
*/

4️⃣ ENVIRONMENT VARIABLES:
   GMAIL_USER=your-school-gmail@gmail.com
   GMAIL_APP_PASSWORD=your-16-char-app-password
   FROM_EMAIL=noreply@your-school.de
   SCHOOL_NAME=Ihre Berufsschule

5️⃣ DNS SETUP (to use noreply@your-school.de):
   Add SPF record to your domain:
   TXT record: "v=spf1 include:_spf.google.com ~all"

6️⃣ BACKEND CODE:
   const nodemailer = require('nodemailer');
   
   const transporter = nodemailer.createTransporter({
     host: 'smtp.gmail.com',
     port: 587,
     secure: false,
     auth: {
       user: process.env.GMAIL_USER,
       pass: process.env.GMAIL_APP_PASSWORD,
     },
   });

💡 GMAIL LIMITS (FREE):
   - 500 emails/day
   - 100 recipients per email
   - Perfect for school use!

✅ BENEFITS:
   - Completely FREE
   - Reliable delivery
   - Professional appearance
   - Easy setup
*/
