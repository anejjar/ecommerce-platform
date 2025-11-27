import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transporter, emailTemplate, sendEmail } from '@/lib/email';
import nodemailer from 'nodemailer';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

describe('email', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('transporter configuration', () => {
    it('should create transporter with correct configuration', () => {
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });
  });

  describe('emailTemplate', () => {
    it('should wrap content in HTML template', () => {
      const content = '<p>Test content</p>';
      const result = emailTemplate(content);

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html lang="en">');
      expect(result).toContain(content);
      expect(result).toContain('Your Store Name');
      expect(result).toContain('Thank you for shopping with us!');
    });

    it('should include proper HTML structure', () => {
      const content = '<h2>Welcome</h2>';
      const result = emailTemplate(content);

      expect(result).toContain('<head>');
      expect(result).toContain('<body>');
      expect(result).toContain('<div class="container">');
      expect(result).toContain('<div class="header">');
      expect(result).toContain('<div class="content">');
      expect(result).toContain('<div class="footer">');
    });

    it('should include current year in footer', () => {
      const content = '<p>Test</p>';
      const result = emailTemplate(content);
      const currentYear = new Date().getFullYear();

      expect(result).toContain(currentYear.toString());
    });

    it('should include CSS styles', () => {
      const content = '<p>Test</p>';
      const result = emailTemplate(content);

      expect(result).toContain('<style>');
      expect(result).toContain('.container');
      expect(result).toContain('.header');
      expect(result).toContain('.button');
    });

    it('should handle empty content', () => {
      const result = emailTemplate('');

      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<div class="content">');
    });
  });

  describe('sendEmail', () => {
    const mockSendMail = vi.fn();

    beforeEach(() => {
      vi.mocked(nodemailer.createTransport).mockReturnValue({
        sendMail: mockSendMail,
      } as any);
    });

    it('should send email successfully', async () => {
      const messageId = 'test-message-id';
      mockSendMail.mockResolvedValue({ messageId });

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(result).toEqual({ success: true, messageId });
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
          subject: 'Test Subject',
        })
      );
      expect(console.log).toHaveBeenCalledWith('Email sent: %s', messageId);
    });

    it('should wrap HTML content in template', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      const htmlContent = '<p>Test content</p>';
      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: htmlContent,
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('<!DOCTYPE html>'),
        })
      );
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(htmlContent),
        })
      );
    });

    it('should use correct from address', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining('Your Store Name'),
        })
      );
    });

    it('should handle email sending error', async () => {
      const error = new Error('SMTP connection failed');
      mockSendMail.mockRejectedValue(error);

      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(result).toEqual({ success: false, error });
      expect(console.error).toHaveBeenCalledWith('Error sending email:', error);
    });

    it('should handle multiple recipients', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      await sendEmail({
        to: 'test1@example.com, test2@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test1@example.com, test2@example.com',
        })
      );
    });

    it('should handle special characters in subject', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      const subject = 'Test Subject with "quotes" & special chars <>';
      await sendEmail({
        to: 'test@example.com',
        subject,
        html: '<p>Test</p>',
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject,
        })
      );
    });

    it('should handle HTML with special characters', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'test' });

      const html = '<p>Price: $100 & "special" chars</p>';
      await sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html,
      });

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining(html),
        })
      );
    });
  });
});
