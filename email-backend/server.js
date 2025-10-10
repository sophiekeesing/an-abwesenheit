// Simple Email Backend Server for Attendance System
// Sends emails using Gmail SMTP - FREE solution
// Now includes SQLite database for user management

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const { initializeDatabase, userOperations } = require("./database");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase()
  .then(() => {
    console.log("🗄️ Database ready");
  })
  .catch((err) => {
    console.error("❌ Database initialization failed:", err);
  });

// Gmail SMTP configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "itech.school.attendance@gmail.com", // Your Gmail account
      pass: "vvdmqiqdwkvypbzm", // Your App Password
    },
  });
};

// Email sending endpoint
app.post("/api/send-invitation", async (req, res) => {
  try {
    const {
      studentEmail,
      studentName,
      teacherName,
      schoolName,
      invitationLink,
    } = req.body;

    // Validate required fields
    if (
      !studentEmail ||
      !studentName ||
      !teacherName ||
      !schoolName ||
      !invitationLink
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    console.log("📧 Sending invitation email...");
    console.log("To:", studentEmail);
    console.log("Student:", studentName);
    console.log("Teacher:", teacherName);
    console.log("School:", schoolName);

    const transporter = createTransporter();

    // Email template
    const mailOptions = {
      from: `"${schoolName} - Abwesenheitssystem" <itech.school.attendance@gmail.com>`,
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
            
            <p>Um Ihr Konto zu aktivieren, klicken Sie bitte auf den folgenden Link und erstellen Sie Ihr Passwort:</p>
            
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
            
            <p>Falls Sie Probleme haben, wenden Sie sich bitte an Ihren Lehrer oder die IT-Abteilung.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #666;">
              Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.<br>
              ${schoolName} | Abwesenheitsverwaltungssystem
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
Willkommen, ${studentName}!

Ihr Lehrer ${teacherName} hat Sie zur digitalen Abwesenheitsverwaltung von ${schoolName} eingeladen.

Um Ihr Konto zu aktivieren, besuchen Sie bitte den folgenden Link:
${invitationLink}

Wichtige Hinweise:
- Dieser Link ist 7 Tage gültig
- Verwenden Sie ein sicheres Passwort
- Teilen Sie diesen Link mit niemandem

Falls Sie Probleme haben, wenden Sie sich bitte an Ihren Lehrer.

${schoolName}
Abwesenheitsverwaltungssystem
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    res.json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    res.status(500).json({
      success: false,
      error: error.message || "Failed to send email",
    });
  }
});

// ================================
// DATABASE ENDPOINTS
// ================================

// User registration endpoint
app.post("/api/users/register", async (req, res) => {
  try {
    console.log("🔄 Registering new user:", req.body);

    const userData = req.body;

    // Validate required fields
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.email ||
      !userData.birthday ||
      !userData.role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: first_name, last_name, email, birthday, role",
      });
    }

    // Check if user already exists
    const existingUser = await userOperations.getUserByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = await userOperations.createUser(userData);
    console.log("✅ User created successfully:", newUser);

    res.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ User registration failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Set user password (for invitation completion)
app.post("/api/users/set-password", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const success = await userOperations.setUserPassword(email, password);

    if (success) {
      console.log("✅ Password set successfully for:", email);
      res.json({
        success: true,
        message: "Password set successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("❌ Password setting failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// User authentication endpoint
app.post("/api/users/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userOperations.authenticateUser(email, password);

    if (user) {
      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user;
      console.log("✅ User authenticated successfully:", email);

      res.json({
        success: true,
        message: "Authentication successful",
        user: userWithoutPassword,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.error("❌ Authentication failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get all students endpoint
app.get("/api/students", async (req, res) => {
  try {
    const students = await userOperations.getAllStudents();
    console.log(`📋 Retrieved ${students.length} students`);

    res.json({
      success: true,
      students: students,
    });
  } catch (error) {
    console.error("❌ Failed to get students:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Email Backend",
    timestamp: new Date().toISOString(),
    gmail: "itech.school.attendance@gmail.com",
  });
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Email Backend Server Started!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`📧 Gmail account: itech.school.attendance@gmail.com`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `📮 Send email: POST http://localhost:${PORT}/api/send-invitation`
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("💡 Ready to send student invitations!");
  console.log("");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🔄 Server shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🔄 Server shutting down gracefully...");
  process.exit(0);
});
