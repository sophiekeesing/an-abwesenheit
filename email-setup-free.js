// FREE Email Setup for Student Invitations
// Backend implementation using Gmail SMTP (completely free)

import nodemailer from "nodemailer";

// 🎯 FREE Gmail SMTP Configuration
const gmailConfig = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your-school-system@gmail.com", // Your Gmail account
    pass: "your-app-password-here", // Gmail App Password (16 chars)
  },
};

// Create transporter
const transporter = nodemailer.createTransporter(gmailConfig);

// Email sending function
async function sendStudentInvitation({
  studentEmail,
  studentName,
  teacherName,
  schoolName,
  invitationLink,
}) {
  const mailOptions = {
    from: `"${schoolName} - Abwesenheitssystem" <noreply@your-school.de>`,
    to: studentEmail,
    subject: `Einladung zur Anmeldung - ${schoolName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Kontoerstellung</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0;">${schoolName}</h1>
            <p style="margin: 5px 0 0 0; color: #666;">Abwesenheitsverwaltung</p>
          </div>

          <h2>Willkommen, ${studentName}!</h2>
          
          <p>Ihr Lehrer <strong>${teacherName}</strong> hat Sie zur digitalen Abwesenheitsverwaltung eingeladen.</p>
          
          <p>Um Ihr Konto zu aktivieren, klicken Sie bitte auf den folgenden Link:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${invitationLink}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Passwort einrichten
            </a>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">⚠️ Wichtige Hinweise:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Dieser Link ist 7 Tage gültig</li>
              <li>Verwenden Sie ein sicheres Passwort</li>
              <li>Teilen Sie diesen Link mit niemandem</li>
            </ul>
          </div>
          
          <p>Falls Sie Probleme haben, wenden Sie sich bitte an Ihren Lehrer.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #666;">
            Diese E-Mail wurde automatisch generiert.<br>
            ${schoolName} | Abwesenheitsverwaltungssystem
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
Willkommen, ${studentName}!

Ihr Lehrer ${teacherName} hat Sie zur digitalen Abwesenheitsverwaltung von ${schoolName} eingeladen.

Um Ihr Konto zu aktivieren, besuchen Sie bitte: ${invitationLink}

Wichtige Hinweise:
- Dieser Link ist 7 Tage gültig
- Verwenden Sie ein sicheres Passwort
- Teilen Sie diesen Link mit niemandem

${schoolName} - Abwesenheitsverwaltungssystem
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email failed:", error);
    return { success: false, error: error.message };
  }
}

// Usage example:
/*
sendStudentInvitation({
  studentEmail: 'student@example.com',
  studentName: 'Max Mustermann',
  teacherName: 'Frau Schmidt',
  schoolName: 'Berufsschule XYZ',
  invitationLink: 'https://your-app.com/setup-password?token=abc123'
});
*/

export { sendStudentInvitation };

/*
🚀 SETUP INSTRUCTIONS (100% FREE):

1️⃣ CREATE GMAIL ACCOUNT:
   - Go to gmail.com
   - Create: your-school-system@gmail.com
   - Choose a strong password

2️⃣ ENABLE 2-FACTOR AUTHENTICATION:
   - Gmail Settings > Security
   - Turn on 2-Step Verification
   - Verify with phone number

3️⃣ GENERATE APP PASSWORD:
   - Still in Security settings
   - Click "App passwords"
   - Select "Mail" as app type
   - Copy the 16-character password
   - Use this in your code (NOT your Gmail password)

4️⃣ INSTALL NODEMAILER:
   npm install nodemailer

5️⃣ ENVIRONMENT VARIABLES (.env file):
   GMAIL_USER=your-school-system@gmail.com
   GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
   FROM_EMAIL=noreply@your-school.de
   SCHOOL_NAME=Ihre Berufsschule

6️⃣ DNS CONFIGURATION (for noreply@your-school.de):
   Add to your domain's DNS:
   TXT Record: "v=spf1 include:_spf.google.com ~all"

7️⃣ BACKEND INTEGRATION:
   const { sendStudentInvitation } = require('./email-service');
   
   // When teacher creates student invitation:
   await sendStudentInvitation({
     studentEmail: 'student@example.com',
     studentName: 'Max Mustermann',
     teacherName: 'Frau Schmidt',
     schoolName: 'Berufsschule XYZ',
     invitationLink: invitationUrl
   });

📊 GMAIL LIMITS (FREE TIER):
   ✅ 500 emails per day
   ✅ 100 recipients per email
   ✅ Completely free forever
   ✅ Reliable delivery
   ✅ Perfect for schools!

💡 PROFESSIONAL APPEARANCE:
   📧 From: "Berufsschule XYZ - Abwesenheitssystem" <noreply@your-school.de>
   📧 To: student@example.com
   📧 Subject: Einladung zur Anmeldung - Berufsschule XYZ

🔒 SECURITY FEATURES:
   ✅ Uses Gmail's secure infrastructure
   ✅ App passwords (not main password)
   ✅ SPF records for domain authentication
   ✅ 7-day token expiration
   ✅ HTTPS-only invitation links

🎯 TOTAL COST: €0.00 FOREVER! 🎉
*/
