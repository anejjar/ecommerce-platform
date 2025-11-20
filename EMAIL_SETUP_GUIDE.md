# 📧 Email Testing Guide - Local Development

## How to View Emails in Local Development

Since you're developing locally, emails won't actually be sent to real email addresses. Here are your options:

---

## ✅ Option 1: Use Ethereal Email (RECOMMENDED for Testing)

**Ethereal** is a fake SMTP service that captures emails without sending them. Perfect for development!

### Setup:
1. Go to https://ethereal.email/
2. Click "Create Ethereal Account" - it will generate test credentials
3. Copy the credentials and update your `.env` file:

```env
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<ethereal-username>
EMAIL_PASSWORD=<ethereal-password>
EMAIL_FROM=<ethereal-email>
```

### View Emails:
1. Trigger an email (e.g., place an order, reset password)
2. Go to https://ethereal.email/messages
3. Log in with your Ethereal credentials
4. See all captured emails with full HTML preview!

**Pros:**
- ✅ No configuration needed
- ✅ Web interface to view emails
- ✅ See HTML rendering
- ✅ Free and instant setup

---

## ✅ Option 2: Use MailHog (Local Email Server)

**MailHog** runs a local SMTP server and provides a web UI to view emails.

### Setup:
1. Download MailHog:
   - Windows: https://github.com/mailhog/MailHog/releases/latest
   - Download `MailHog_windows_amd64.exe`

2. Run MailHog:
   ```bash
   # Double-click the .exe or run in terminal:
   MailHog_windows_amd64.exe
   ```

3. Update `.env`:
   ```env
   EMAIL_HOST=localhost
   EMAIL_PORT=1025
   EMAIL_SECURE=false
   EMAIL_USER=
   EMAIL_PASSWORD=
   EMAIL_FROM=noreply@yourstore.local
   ```

### View Emails:
1. Open http://localhost:8025 in your browser
2. Trigger an email in your app
3. Refresh MailHog web UI - email will appear!

**Pros:**
- ✅ Fully local (no internet needed)
- ✅ Web UI to view emails
- ✅ Fast and reliable

---

## ✅ Option 3: Use Gmail (For Real Email Testing)

**Note:** This sends actual emails! Only use if you want to test with real email addresses.

### Setup:
1. Enable 2-Step Verification on your Google Account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Generate a new App Password
   - Copy the 16-character password

3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=<your-16-char-app-password>
   EMAIL_FROM=your-email@gmail.com
   ```

### View Emails:
- Check your actual Gmail inbox!

**Pros:**
- ✅ Real email testing
- ✅ Test email deliverability

**Cons:**
- ❌ Requires Google account setup
- ❌ May hit sending limits
- ❌ Emails go to real inboxes (spam risk)

---

## ✅ Option 4: Console Logging (Simplest)

For quick debugging, you can log emails to the console instead of sending them.

### Setup:
Update `src/lib/email.ts`:

```typescript
// Add this at the top of sendEmail function:
if (process.env.NODE_ENV === 'development') {
  console.log('📧 EMAIL WOULD BE SENT:');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  return { success: true, messageId: 'dev-mode' };
}
```

### View Emails:
- Check your terminal/console where Next.js is running
- Emails will be logged instead of sent

**Pros:**
- ✅ Zero setup
- ✅ See email content immediately

**Cons:**
- ❌ No HTML preview
- ❌ Hard to read in console

---

## 🎯 Recommended Setup for Your Project

I recommend **Ethereal Email** because:
- ✅ No installation required
- ✅ Beautiful web UI to view emails
- ✅ Supports HTML emails perfectly
- ✅ Free and instant
- ✅ Can share email preview links with others

---

## 📋 Emails Currently Implemented

Your application sends these emails:

1. **Order Confirmation** - Sent when order is placed
   - To: Customer email (or guest email)
   - Trigger: Complete checkout

2. **Order Shipped** - Sent when order status changes to SHIPPED
   - To: Customer email
   - Trigger: Admin changes order status to "Shipped"

3. **Order Delivered** - Sent when order status changes to DELIVERED
   - To: Customer email
   - Trigger: Admin changes order status to "Delivered"

4. **Welcome Email** - Sent to new accounts
   - To: New user's email
   - Trigger: Guest creates account during checkout or signs up

5. **Password Reset** - Sent when user requests password reset
   - To: User's email
   - Trigger: User clicks "Forgot Password" and submits email

---

## 🧪 Testing Emails

### Test Order Confirmation:
1. Add items to cart
2. Go to checkout
3. Fill in email address
4. Place order
5. Check your email inbox (Ethereal/MailHog/Gmail)

### Test Password Reset:
1. Go to Sign In page
2. Click "Forgot Password?"
3. Enter your email
4. Check email for reset link

### Test Welcome Email:
1. Add items to cart
2. Go to checkout as guest
3. Check "Create account"
4. Enter email and password
5. Place order
6. Check email for welcome message

### Test Order Status Emails:
1. Place an order
2. Go to Admin Panel → Orders
3. Click on the order
4. Change status to "Shipped" or "Delivered"
5. Check email for status update

---

## 🐛 Troubleshooting

### "Failed to send email" error:
- Check your `.env` file has correct email settings
- Verify EMAIL_HOST, EMAIL_PORT are correct
- For Gmail: Make sure you're using App Password, not regular password
- For Ethereal: Generate new credentials if old ones expired

### Emails not appearing:
- Check spam folder
- Verify recipient email address is correct
- Check console for error messages
- Try Ethereal Email for easier debugging

### HTML not rendering:
- Ethereal and MailHog show full HTML preview
- Gmail may clip very long emails
- Check browser console for errors

---

## 📝 Current Email Configuration

Your `.env` file should have these variables:

```env
# Email Configuration
EMAIL_HOST=smtp.ethereal.email  # or smtp.gmail.com or localhost
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@example.com

# App URL (needed for password reset links)
NEXTAUTH_URL=http://localhost:3000
```

---

## 🎨 Email Templates Location

All email templates are in:
- `src/lib/email-templates.ts`

Templates include:
- `orderConfirmationEmail()` - Transactional email for orders
- `orderShippedEmail()` - Shipping notification
- `orderDeliveredEmail()` - Delivery notification
- `welcomeEmail()` - New user welcome
- Password reset template (in API route)

---

## 🚀 Next Steps

1. **Choose** your preferred email testing method (Ethereal recommended)
2. **Update** your `.env` file with credentials
3. **Restart** your Next.js dev server
4. **Test** by placing an order or resetting a password
5. **View** the emails in your chosen inbox!

Need help? Check the console logs for detailed error messages.
