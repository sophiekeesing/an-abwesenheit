// Database setup and initialization
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const path = require("path");

// Create database connection
const dbPath = path.join(__dirname, "attendance.db");
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          birthday TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('student', 'teacher')),
          class_id TEXT,
          company_name TEXT,
          ausbilder_email TEXT,
          status TEXT DEFAULT 'invited' CHECK(status IN ('invited', 'active', 'inactive')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Classes table
      db.run(`
        CREATE TABLE IF NOT EXISTS classes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          class_name TEXT UNIQUE NOT NULL,
          description TEXT,
          teacher_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacher_id) REFERENCES users (id)
        )
      `);

      // Absences table
      db.run(`
        CREATE TABLE IF NOT EXISTS absences (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id INTEGER NOT NULL,
          class_id TEXT NOT NULL,
          start_date TEXT NOT NULL,
          end_date TEXT NOT NULL,
          reason TEXT NOT NULL,
          document_path TEXT,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
          teacher_notes TEXT,
          working_days INTEGER DEFAULT 0,
          total_days INTEGER DEFAULT 0,
          submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          reviewed_at DATETIME,
          reviewed_by INTEGER,
          FOREIGN KEY (student_id) REFERENCES users (id),
          FOREIGN KEY (reviewed_by) REFERENCES users (id)
        )
      `);

      // Insert default classes
      db.run(`
        INSERT OR IGNORE INTO classes (class_name, description) VALUES
        ('IT4L', 'IT-Klasse 4L'),
        ('IT4O', 'IT-Klasse 4O'),
        ('IT4K', 'IT-Klasse 4K')
      `);

      // Insert default teacher (Thomas Müller)
      const defaultTeacherHash = bcrypt.hashSync("password123", 10);
      db.run(
        `
        INSERT OR IGNORE INTO users (first_name, last_name, email, password_hash, birthday, role, status) VALUES
        ('Thomas', 'Müller', 'mueller@school.de', ?, '1980-01-01', 'teacher', 'active')
      `,
        [defaultTeacherHash]
      );

      console.log("✅ Database initialized successfully");
      resolve();
    });
  });
};

// User operations
const userOperations = {
  // Create new user
  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      const {
        first_name,
        last_name,
        email,
        birthday,
        role,
        class_id,
        company_name,
        ausbilder_email,
      } = userData;

      db.run(
        `INSERT INTO users (first_name, last_name, email, birthday, role, class_id, company_name, ausbilder_email, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'invited')`,
        [
          first_name,
          last_name,
          email,
          birthday,
          role,
          class_id,
          company_name,
          ausbilder_email,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              first_name,
              last_name,
              email,
              birthday,
              role,
              class_id,
              company_name,
              ausbilder_email,
              status: "invited",
            });
          }
        }
      );
    });
  },

  // Set user password (for invitation completion)
  setUserPassword: (email, password) => {
    return new Promise((resolve, reject) => {
      const passwordHash = bcrypt.hashSync(password, 10);

      db.run(
        `UPDATE users SET password_hash = ?, status = 'active', updated_at = CURRENT_TIMESTAMP
         WHERE email = ?`,
        [passwordHash, email],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  },

  // Authenticate user
  authenticateUser: (email, password) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE email = ? AND status = 'active'`,
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(null);
          } else {
            const isValidPassword = bcrypt.compareSync(
              password,
              row.password_hash
            );
            resolve(isValidPassword ? row : null);
          }
        }
      );
    });
  },

  // Get user by email
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all students
  getAllStudents: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT u.*, c.class_name FROM users u 
         LEFT JOIN classes c ON u.class_id = c.class_name 
         WHERE u.role = 'student'
         ORDER BY u.last_name, u.first_name`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
};

module.exports = {
  db,
  initializeDatabase,
  userOperations,
};
