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

// Unified Email Template Wrapper
// Modern, responsive design with consistent styling across all emails
export const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    
    /* Base styles */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      background-color: #f9fafb;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Container */
    .email-wrapper {
      width: 100%;
      background-color: #f9fafb;
      padding: 20px 0;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    /* Header */
    .email-header {
      background: linear-gradient(135deg, #3b82f6 0%, #667eea 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .email-header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: bold;
      line-height: 1.2;
    }
    
    .email-header p {
      color: #ffffff;
      margin: 10px 0 0 0;
      font-size: 16px;
      opacity: 0.95;
    }
    
    /* Content */
    .email-content {
      padding: 40px 30px;
      color: #1f2937;
      font-size: 16px;
      line-height: 1.6;
    }
    
    @media only screen and (max-width: 600px) {
      .email-content {
        padding: 30px 20px;
      }
      .email-header {
        padding: 30px 20px;
      }
    }
    
    /* Typography */
    .email-content h1 {
      color: #1f2937;
      font-size: 28px;
      font-weight: bold;
      margin: 0 0 20px 0;
      line-height: 1.2;
    }
    
    .email-content h2 {
      color: #1f2937;
      font-size: 24px;
      font-weight: bold;
      margin: 30px 0 20px 0;
      line-height: 1.3;
    }
    
    .email-content h3 {
      color: #1f2937;
      font-size: 18px;
      font-weight: bold;
      margin: 25px 0 15px 0;
      line-height: 1.4;
    }
    
    .email-content p {
      color: #1f2937;
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    
    .email-content ul, .email-content ol {
      margin: 15px 0;
      padding-left: 25px;
      color: #1f2937;
    }
    
    .email-content li {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    /* Buttons */
    .email-button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #3b82f6 0%, #667eea 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    
    .email-button:hover {
      background: linear-gradient(135deg, #2563eb 0%, #5a67d8 100%);
    }
    
    .email-button-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
    
    .email-button-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    .email-button-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    
    .email-button-center {
      text-align: center;
      margin: 30px 0;
    }
    
    /* Cards and Boxes */
    .email-card {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .email-card-primary {
      background-color: #eff6ff;
      border: 1px solid #3b82f6;
      border-left: 4px solid #3b82f6;
    }
    
    .email-card-success {
      background-color: #f0fdf4;
      border: 1px solid #10b981;
      border-left: 4px solid #10b981;
    }
    
    .email-card-warning {
      background-color: #fffbeb;
      border: 1px solid #f59e0b;
      border-left: 4px solid #f59e0b;
    }
    
    .email-card-error {
      background-color: #fef2f2;
      border: 1px solid #ef4444;
      border-left: 4px solid #ef4444;
    }
    
    /* Order Details */
    .order-details {
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    
    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 15px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .order-item:last-child {
      border-bottom: none;
    }
    
    .order-item-name {
      flex: 1;
      color: #1f2937;
      font-weight: 600;
      font-size: 16px;
    }
    
    .order-item-details {
      color: #6b7280;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .order-item-price {
      text-align: right;
      color: #1f2937;
      font-weight: bold;
      font-size: 16px;
    }
    
    .order-totals {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    
    .order-total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      color: #6b7280;
      font-size: 14px;
    }
    
    .order-total-row.total {
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
      padding-top: 15px;
      margin-top: 10px;
      border-top: 2px solid #3b82f6;
    }
    
    .order-total-amount {
      color: #3b82f6;
      font-weight: bold;
    }
    
    /* Highlight Boxes */
    .highlight-box {
      background: linear-gradient(135deg, #3b82f6 0%, #667eea 100%);
      color: #ffffff;
      padding: 25px;
      border-radius: 8px;
      margin: 25px 0;
      text-align: center;
    }
    
    .highlight-box h2, .highlight-box h3 {
      color: #ffffff;
      margin: 0 0 10px 0;
    }
    
    .highlight-box p {
      color: #ffffff;
      opacity: 0.95;
      margin: 5px 0;
    }
    
    .highlight-box-large {
      font-size: 32px;
      font-weight: bold;
      margin: 15px 0;
    }
    
    /* Tracking Number */
    .tracking-number {
      background-color: #eff6ff;
      border: 2px solid #3b82f6;
      border-radius: 6px;
      padding: 15px 20px;
      margin: 20px 0;
      text-align: center;
    }
    
    .tracking-number-label {
      color: #1e40af;
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .tracking-number-value {
      color: #1e40af;
      font-size: 20px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 2px;
    }
    
    /* Discount Code */
    .discount-code {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px dashed #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      text-align: center;
    }
    
    .discount-code-label {
      color: #92400e;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .discount-code-value {
      color: #b45309;
      font-size: 28px;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 3px;
      margin: 10px 0;
    }
    
    /* Footer */
    .email-footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .email-footer p {
      color: #6b7280;
      font-size: 14px;
      margin: 8px 0;
      line-height: 1.5;
    }
    
    .email-footer a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    .email-footer a:hover {
      text-decoration: underline;
    }
    
    .email-footer-copyright {
      color: #9ca3af;
      font-size: 12px;
      margin-top: 15px;
    }
    
    /* Utility Classes */
    .text-center {
      text-align: center;
    }
    
    .text-muted {
      color: #6b7280;
    }
    
    .text-small {
      font-size: 14px;
    }
    
    .mb-0 {
      margin-bottom: 0;
    }
    
    .mt-0 {
      margin-top: 0;
    }
    
    .spacer {
      height: 20px;
    }
    
    .spacer-large {
      height: 30px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0;
      }
      .email-header, .email-content, .email-footer {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .order-item {
        flex-direction: column;
      }
      .order-item-price {
        text-align: left;
        margin-top: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <h1>Your Store Name</h1>
      </div>
      <div class="email-content">
        ${content}
      </div>
      <div class="email-footer">
        <p><strong>Thank you for shopping with us!</strong></p>
        <p>If you have any questions, please contact us at <a href="mailto:support@yourstore.com">support@yourstore.com</a></p>
        <p class="email-footer-copyright">&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
      </div>
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
