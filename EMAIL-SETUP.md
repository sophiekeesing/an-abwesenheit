# 📧 Email Setup Guide - FREE Gmail SMTP

Your attendance system is now configured to send real emails using Gmail SMTP! Here's how to set it up:

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Gmail Account

1. Go to [gmail.com](https://gmail.com)
2. Create account: `your-school-system@gmail.com`
3. Choose a strong password

### Step 2: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process with your phone

### Step 3: Generate App Password

1. Still in Google Account Security
2. Click "App passwords"
3. Select "Mail" as the app type
4. Copy the 16-character password (something like: `abcd efgh ijkl mnop`)

### Step 4: Update Your .env File

Edit `/Users/Sophie.Keesing/Desktop/an-abwesenheit/.env`:

```env
# Replace with your actual Gmail account
VITE_GMAIL_USER=your-school-system@gmail.com

# Replace with your 16-character App Password (no spaces)
VITE_GMAIL_APP_PASSWORD=abcdefghijklmnop

# Your school's "From" email address
VITE_FROM_EMAIL=noreply@your-school.de

# Your school name
VITE_SCHOOL_NAME=Ihre Berufsschule
```

### Step 5: Test Email Sending

1. Start your app: `npm run dev`
2. Go to Teacher Dashboard
3. Add a new student with a real email address
4. Check if the invitation email is sent!

## 🎯 Benefits of This Setup

✅ **Completely FREE** - Gmail allows 500 emails/day  
✅ **Professional** - Emails appear to come from `noreply@your-school.de`  
✅ **Reliable** - Uses Google's email infrastructure  
✅ **Secure** - Uses App Passwords, not your main Gmail password

## 🔧 Optional: Professional Email Domain

To make emails appear to come from your school domain:

1. Add this DNS TXT record to your domain:

   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. This allows Gmail to send emails "on behalf of" your domain

## 🚨 Troubleshooting

**"Authentication failed"**: Check your app password is correct (16 characters, no spaces)

**"Access denied"**: Make sure 2-Factor Authentication is enabled

**"Less secure app access"**: You don't need this with App Passwords

## 💰 Cost Breakdown

- Gmail account: **FREE**
- 500 emails/day: **FREE**
- Professional appearance: **FREE**
- **Total cost: €0.00 forever!** 🎉

---

Need help? Check the detailed implementation in `email-setup-free.js` or contact your developer!
