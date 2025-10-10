# Email Backend Server

Simple Node.js server that sends student invitation emails using Gmail SMTP.

## 🚀 Quick Start

```bash
cd email-backend
npm install
npm start
```

Server will run on: **http://localhost:3001**

## 📧 Email Configuration

- **Gmail Account**: `itech.school.attendance@gmail.com`
- **App Password**: `vvdmqiqdwkvypbzm`
- **Daily Limit**: 500 emails (FREE)

## 🔗 API Endpoints

### Health Check

```
GET http://localhost:3001/api/health
```

### Send Invitation Email

```
POST http://localhost:3001/api/send-invitation

Body:
{
  "studentEmail": "student@example.com",
  "studentName": "Max Mustermann",
  "teacherName": "Frau Schmidt",
  "schoolName": "Berufsschule ITECH",
  "invitationLink": "https://yourapp.com/setup-password?token=abc123"
}
```

## 🔧 How It Works

1. Frontend sends invitation request to backend
2. Backend uses nodemailer + Gmail SMTP to send real emails
3. Student receives professional invitation email
4. Student clicks link to set up password

## 💰 Cost

**FREE** - Gmail allows 500 emails/day at no cost!

## 🛡️ Security

- Uses Gmail App Passwords (not regular password)
- CORS enabled for frontend communication
- Input validation on all requests
