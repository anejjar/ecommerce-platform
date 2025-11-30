import nodemailer from 'nodemailer';

// Create email transporter
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template wrapper
export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #3b82f6;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #3b82f6;
      margin: 0;
      font-size: 28px;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3b82f6;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .order-details {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .total {
      font-size: 18px;
      font-weight: bold;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Store Name</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>If you have any questions, please contact us at support@yourstore.com</p>
      <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Send email helper
export async function sendEmail({
  to,
  subject,
  html,
  attachments,
  from,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  from?: string;
  replyTo?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: from || `"Your Store Name" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html: emailTemplate(html),
      attachments,
      replyTo,
    });

    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
