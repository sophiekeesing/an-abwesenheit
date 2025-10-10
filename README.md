# 🎓 FehlzeitPro - Attendance Management System

Eine moderne, vollständig funktionsfähige Anwendung zur Verwaltung von Fehlzeiten und Abwesenheitsmeldungen für Berufsschulen mit automatischem E-Mail-System und echter Datenbankpersistierung.

## 🌟 Key Features

### 🔐 **Sicheres Benutzermanagement**

- **Rollenbasierte Authentifizierung** (Lehrer/Schüler)
- **E-Mail-Einladungssystem** für neue Schüler
- **Sichere Passwort-Hashing** mit bcrypt
- **SQLite-Datenbank** für persistente Datenspeicherung
- **Automatische Passwort-Einrichtung** über E-Mail-Links

### 📧 **Automatisches E-Mail-System**

- **Gmail SMTP Integration** (kostenlos - 500 E-Mails/Tag)
- **Personalisierte Einladungsemails** mit Lehrernamen
- **Professionelle HTML-E-Mail-Templates**
- **Automatische Benachrichtigungen** an Ausbilder bei Fehlzeiten

### 🎯 **Intelligente Dashboards**

#### 👨‍🏫 **Lehrer-Dashboard**

- **Schülerverwaltung** mit E-Mail-Einladungen
- **Klassenweise Fehlzeiten-Übersicht**
- **Genehmigung/Ablehnung** von Abwesenheitsanträgen
- **Schüler hinzufügen** mit automatischer E-Mail-Einladung
- **Echtzeitstatistiken** und Filter

#### 🎓 **Schüler-Dashboard**

- **Persönliche Fehlzeiten-Übersicht**
- **Abwesenheitsmeldungen einreichen**
- **Dokument-Upload** für AU-Bescheinigungen
- **Status-Tracking** (Ausstehend/Genehmigt/Abgelehnt)
- **Persönliche Statistiken**

### 🛠️ **Moderne Technologien**

- **Vue 3** mit Composition API und TypeScript
- **Tailwind CSS** für responsives Design
- **SQLite-Datenbank** mit automatischer Initialisierung
- **Express.js Backend** mit RESTful API
- **Sichere Authentifizierung** und Session-Management

---

## 🚀 Setup Instructions

### **Voraussetzungen**

- Node.js (v16 oder höher)
- npm oder yarn
- Git

### **1️⃣ Repository klonen**

```bash
git clone https://github.com/yourusername/an-abwesenheit.git
cd an-abwesenheit
```

### **2️⃣ Frontend-Abhängigkeiten installieren**

```bash
npm install
```

### **3️⃣ Backend-Abhängigkeiten installieren**

```bash
cd email-backend
npm install
cd ..
```

### **4️⃣ System starten**

#### **Option A: Automatischer Start (Empfohlen)**

```bash
chmod +x start-all.sh
./start-all.sh
```

#### **Option B: Manueller Start**

```bash
# Terminal 1 - Backend starten
cd email-backend
node server.js

# Terminal 2 - Frontend starten
cd ..
npm run dev
```

### **5️⃣ Anwendung öffnen**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

---

## � Standard-Zugangsdaten

### **👨‍🏫 Lehrer-Account**

- **E-Mail**: `mueller@school.de`
- **Passwort**: `password123`
- **Berechtigung**: Alle Klassen (IT4L, IT4O, IT4K)

### **🎓 Test-Schüler-Accounts**

- **E-Mail**: `max.mustermann@student.de` / **Passwort**: `password123`
- **E-Mail**: `anna.schmidt@student.de` / **Passwort**: `password123`

---

## � Verwendung

### **Als Lehrer:**

1. **Anmelden** mit Lehrer-Zugangsdaten
2. **Schüler hinzufügen**:
   - Klick auf "Schüler hinzufügen"
   - E-Mail-Adresse eingeben
   - **Automatische Einladungsmail** wird versendet
3. **Fehlzeiten verwalten**:
   - Ausstehende Anträge genehmigen/ablehnen
   - Kommentare hinzufügen
   - Klassenweise filtern

### **Als Schüler:**

1. **Einladungsmail** vom Lehrer erhalten
2. **Passwort einrichten** über E-Mail-Link
3. **Automatische Anmeldung** zum Schüler-Dashboard
4. **Abwesenheit melden**:
   - Zeitraum auswählen
   - Grund eingeben
   - Optional: AU-Bescheinigung hochladen
5. **Status verfolgen** in der persönlichen Übersicht

---

## 🗄️ Datenbank

### **SQLite-Datenbank**

- **Automatische Erstellung** bei erstem Start
- **Speicherort**: `email-backend/attendance.db`
- **Sichere Passwort-Hashing** mit bcrypt
- **Vollständige Datenintegrität**

### **Tabellen-Schema**

```sql
-- Benutzer (Lehrer und Schüler)
users (id, first_name, last_name, email, password_hash, role, status, ...)

-- Klassen
classes (id, class_name, description, teacher_id, ...)

-- Fehlzeiten
absences (id, student_id, start_date, end_date, reason, status, ...)
```

---

## � E-Mail-Konfiguration

### **Gmail SMTP (Kostenloses Limit: 500 E-Mails/Tag)**

- **Konfiguriert**: `itech.school.attendance@gmail.com`
- **Funktionen**:
  - ✅ Einladungsemails für neue Schüler
  - ✅ Passwort-Setup-Links
  - ✅ Fehlzeiten-Benachrichtigungen an Ausbilder
  - ✅ Personalisierte Nachrichten mit Lehrernamen

### **E-Mail-Template Features**

- **Responsive HTML-Design**
- **Professionelle Formatierung**
- **Klare Call-to-Action-Buttons**
- **Automatische Personalisierung**

---

## 🏗️ Projektstruktur

```
📁 an-abwesenheit/
├── 📁 src/                     # Vue.js Frontend
│   ├── 📁 components/          # Wiederverwendbare Komponenten
│   │   ├── DatePicker.vue      # Intelligente Datumsauswahl
│   │   ├── FileUpload.vue      # Drag & Drop Upload
│   │   ├── LoginForm.vue       # Anmeldeformular
│   │   └── StudentTable.vue    # Schülerverwaltung
│   ├── 📁 stores/              # Pinia State Management
│   │   ├── auth.ts            # Authentifizierung
│   │   ├── attendance.ts      # Fehlzeiten-Logik
│   │   └── theme.ts           # Dark/Light Mode
│   ├── 📁 views/              # Hauptseiten
│   │   ├── StudentDashboard.vue
│   │   ├── TeacherDashboard.vue
│   │   └── PasswordSetupView.vue
│   └── 📁 services/           # API-Services
│       ├── api.ts             # Backend-Kommunikation
│       └── email.ts           # E-Mail-Service
├── 📁 email-backend/          # Express.js Backend
│   ├── server.js              # Haupt-Server
│   ├── database.js            # SQLite-Operations
│   ├── attendance.db          # SQLite-Datenbank (auto-generiert)
│   └── package.json           # Backend-Abhängigkeiten
├── start-all.sh              # Ein-Klick-Startup-Script
└── README.md                 # Diese Datei
```

---

## 🔧 API-Endpunkte

### **Benutzerverwaltung**

- `POST /api/users/register` - Benutzer erstellen
- `POST /api/users/set-password` - Passwort setzen
- `POST /api/users/authenticate` - Anmeldung
- `GET /api/students` - Schüler abrufen

### **E-Mail-System**

- `POST /api/send-invitation` - Einladungsmail senden
- `POST /api/send-absence-email` - Fehlzeiten-Benachrichtigung

### **System**

- `GET /api/health` - Server-Status prüfen

---

## 🛡️ Sicherheitsfeatures

### **Authentifizierung**

- ✅ **Sichere Passwort-Hashing** mit bcrypt
- ✅ **Token-basierte Einladungen** mit Ablaufzeit
- ✅ **Rollenbasierte Zugriffskontrolle**
- ✅ **Session-Management**

### **Datenvalidierung**

- ✅ **Input-Sanitization** auf Frontend und Backend
- ✅ **SQL-Injection-Schutz** durch Prepared Statements
- ✅ **CORS-Konfiguration** für sichere API-Aufrufe
- ✅ **Dateiupload-Validierung** (Typ und Größe)

---

## 🎨 UI/UX Features

### **Responsive Design**

- ✅ **Mobile-optimiert** für alle Bildschirmgrößen
- ✅ **Dark/Light Mode** mit automatischer Browser-Erkennung
- ✅ **Accessibility-freundlich** (ARIA-Labels, Keyboard-Navigation)
- ✅ **Intuitive Benutzerführung**

### **Moderne Komponenten**

- ✅ **Drag & Drop Datei-Upload**
- ✅ **Intelligente Datumswahl** mit Validierung
- ✅ **Real-time Formvalidierung**
- ✅ **Toast-Benachrichtigungen**

---

## 🚦 Status-System

### **Benutzer-Status**

- `invited` → Eingeladen, aber noch kein Passwort gesetzt
- `active` → Vollständig registriert und aktiv
- `inactive` → Account deaktiviert

### **Fehlzeiten-Status**

- `pending` → Wartet auf Genehmigung
- `approved` → Vom Lehrer genehmigt
- `rejected` → Vom Lehrer abgelehnt

---

## 🔄 Entwicklung

### **Build für Produktion**

```bash
npm run build
```

### **Tests ausführen**

```bash
npm run test
```

### **Code-Qualität prüfen**

```bash
npm run lint
```

### **Datenbank zurücksetzen**

```bash
rm email-backend/attendance.db
# Datenbank wird beim nächsten Start neu erstellt
```

---

## 📊 Systemanforderungen

### **Minimum**

- Node.js 16+
- 4GB RAM
- 1GB freier Speicherplatz

### **Empfohlen**

- Node.js 18+
- 8GB RAM
- 5GB freier Speicherplatz

---

## 🤝 Beitragen

1. Fork des Repositories erstellen
2. Feature-Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.

---

## 🆘 Support

Bei Fragen oder Problemen:

1. **Issues** auf GitHub erstellen
2. **Dokumentation** in diesem README konsultieren
3. **Server-Logs** in der Konsole prüfen
4. **Health Check** aufrufen: http://localhost:3001/api/health

---

## 🎯 Nächste Schritte

### **Geplante Features**

- 📱 Mobile App (React Native)
- 📊 Erweiterte Statistiken und Reports
- 🔗 Integration mit Schulverwaltungssoftware
- 📋 Bulk-Import von Schülerdaten
- 🌍 Mehrsprachige Unterstützung

---

**Entwickelt mit ❤️ für moderne Berufsschulen**

_Ein vollständiges Fehlzeiten-Management-System mit realer Datenbankpersistierung, automatischem E-Mail-System und professionellem Design._
