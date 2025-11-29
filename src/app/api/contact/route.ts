import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getClientIp } from '@/lib/activity-log';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fields, source } = body;

        if (!fields || !Array.isArray(fields) || fields.length === 0) {
            return NextResponse.json(
                { error: 'Form fields are required' },
                { status: 400 }
            );
        }

        // Extract email from fields
        const emailField = fields.find((f: any) => f.name === 'email');
        const email = emailField?.value;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Get client IP
        const clientIp = getClientIp(req);

        // Format email content
        const fieldRows = fields
            .map((field: any) => {
                const value = field.value || '(not provided)';
                return `<tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: 600;">${field.label}:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${value}</td>
                </tr>`;
            })
            .join('');

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    ${fieldRows}
                </table>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
                    <p><strong>Source:</strong> ${source || 'Unknown'}</p>
                    <p><strong>IP Address:</strong> ${clientIp}</p>
                    <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
                </div>
            </div>
        `;

        // Send email notification (you may need to configure admin email)
        const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
        
        try {
            await sendEmail({
                to: adminEmail,
                subject: `New Contact Form Submission from ${email}`,
                html: emailHtml,
                replyTo: email,
            });
        } catch (emailError) {
            console.error('Failed to send contact form email:', emailError);
            // Don't fail the request if email fails - still return success
        }

        // TODO: Store submission in database if you add a ContactSubmission model
        // For now, we just send the email

        return NextResponse.json({
            message: 'Contact form submitted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to process contact form submission' },
            { status: 500 }
        );
    }
}

