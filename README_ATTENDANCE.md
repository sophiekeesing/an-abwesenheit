# Anwesenheitstool (Attendance Tool)

Ein modernes, benutzerfreundliches Tool zur Verwaltung von Fehlzeiten und Abwesenheitsmeldungen für Schulen.

## 🚀 Features

### Authentifizierung

- ✅ Rollenbasierte Anmeldung (Lehrer/Schüler)
- ✅ Benutzerregistrierung für Schüler
- ✅ Sichere Session-Verwaltung
- ✅ Automatische Umleitung basierend auf Benutzerrolle

### Datumswahl und Zeitraumauswahl

- ✅ Intuitive Start- und Enddatumsauswahl
- ✅ Automatische Dauerberechnung
- ✅ Validierung der Datumseingaben

### Dokumentenupload

- ✅ Drag & Drop Upload für AU-Bescheinigungen
- ✅ Unterstützte Formate: PDF, JPG, PNG
- ✅ Dateigröße-Validierung (max. 5MB)
- ✅ Dateivorschau und -verwaltung

### Klassenauswahl

- ✅ Dynamische Klassenliste für Lehrer
- ✅ Automatische Klassenzuordnung für Schüler
- ✅ Filterung nach Klassen

### Fehlzeitenverwaltung

- ✅ Einreichen von Abwesenheitsmeldungen
- ✅ Bearbeitung von Fehlzeiten durch Lehrer
- ✅ Genehmigung/Ablehnung von Anträgen
- ✅ Kommentarfunktion für Lehrer

### Benutzeroberfläche

- ✅ Modernes, responsives Design
- ✅ Dark Mode Unterstützung
- ✅ Tailwind CSS für konsistentes Styling
- ✅ Accessibility-freundlich

### Rollenspezifische Dashboards

#### Lehrer-Dashboard

- ✅ Übersicht aller Klassen
- ✅ Ausstehende Genehmigungen
- ✅ Bearbeitung von Fehlzeiten
- ✅ Klassenweise Filterung

#### Schüler-Dashboard

- ✅ Persönliche Fehlzeiten-Übersicht
- ✅ Neue Abwesenheit melden
- ✅ Status-Tracking
- ✅ Statistiken

### Datenschutz

- ✅ Umfassende Datenschutzerklärung (DSGVO-konform)
- ✅ Deutsche Datenschutzbestimmungen
- ✅ Transparente Datenverarbeitung

## 🛠️ Technologie-Stack

- **Frontend**: Vue 3 mit Composition API
- **Styling**: Tailwind CSS
- **UI-Komponenten**: Headless UI
- **Icons**: Heroicons
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **TypeScript**: Vollständige Typisierung

## 📦 Installation

1. **Abhängigkeiten installieren:**

   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**

   ```bash
   npm run dev
   ```

3. **Anwendung öffnen:**
   Öffnen Sie [http://localhost:5173](http://localhost:5173) in Ihrem Browser

## 🔐 Demo-Zugangsdaten

### Lehrer

- **E-Mail**: mueller@school.de
- **Passwort**: password123
- **Berechtigung**: Alle Klassen (10A, 10B, 11C)

### Schüler

- **E-Mail**: max.mustermann@student.de
- **Passwort**: password123
- **Klasse**: 10A

- **E-Mail**: anna.schmidt@student.de
- **Passwort**: password123
- **Klasse**: 10A

## 🏗️ Build für Produktion

```bash
npm run build
```

Die fertigen Dateien finden Sie im `dist/` Ordner.

## 🧪 Tests ausführen

```bash
npm run test:unit
```

## 📝 Weitere Scripts

- `npm run type-check` - TypeScript Überprüfung
- `npm run lint` - ESLint Überprüfung
- `npm run format` - Code-Formatierung mit Prettier

## 📋 Projektstruktur

```
src/
├── components/          # Wiederverwendbare Komponenten
│   ├── DatePicker.vue   # Datums-Auswahl
│   ├── FileUpload.vue   # Datei-Upload
│   ├── LoginForm.vue    # Anmeldeformular
│   └── NavigationHeader.vue # Navigation
├── stores/              # Pinia Stores
│   ├── auth.ts          # Authentifizierung
│   ├── attendance.ts    # Fehlzeiten-Verwaltung
│   └── theme.ts         # Theme-Verwaltung
├── views/               # Seiten-Komponenten
│   ├── DashboardView.vue    # Haupt-Dashboard
│   ├── LoginView.vue        # Anmelde-Seite
│   ├── PrivacyView.vue      # Datenschutz
│   ├── StudentDashboard.vue # Schüler-Dashboard
│   └── TeacherDashboard.vue # Lehrer-Dashboard
└── router/              # Vue Router Konfiguration
```

## 🔒 Sicherheitshinweise

- In der Produktion sollten echte Authentifizierungsmechanismen implementiert werden
- Datei-Uploads sollten serverseitig validiert und gespeichert werden
- HTTPS sollte für alle Datenübertragungen verwendet werden
- Regelmäßige Sicherheitsupdates der Abhängigkeiten

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt worden.

## 🤝 Beitragen

1. Fork des Repositories
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📞 Support

Bei Fragen oder Problemen können Sie ein Issue im Repository erstellen.
