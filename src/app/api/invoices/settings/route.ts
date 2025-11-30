import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await prisma.invoiceSettings.findFirst();

        if (!settings) {
            // Create default settings
            settings = await prisma.invoiceSettings.create({
                data: {
                    invoiceNumberPrefix: 'INV',
                    invoiceNumberFormat: '{{prefix}}-{{number}}',
                    nextInvoiceNumber: 1,
                    defaultDueDays: 30,
                    primaryColor: '#000000',
                    secondaryColor: '#666666',
                    accentColor: '#3182ce',
                    fontFamily: 'Helvetica',
                    fontSize: 10,
                    autoSendOnCreate: false,
                    sendCopyToAdmin: false,
                    taxLabel: 'Tax',
                    showTaxBreakdown: true,
                    showPaymentLink: true,
                    showQRCode: false,
                    enableSignatures: false,
                    multiLanguage: false,
                    defaultLanguage: 'en',
                    showFooter: true,
                    currency: 'USD',
                    currencySymbol: '$',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching invoice settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice settings' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        let settings = await prisma.invoiceSettings.findFirst();

        if (!settings) {
            // Create if doesn't exist
            settings = await prisma.invoiceSettings.create({
                data: {
                    ...body,
                },
            });
        } else {
            // Update existing
            settings = await prisma.invoiceSettings.update({
                where: { id: settings.id },
                data: {
                    ...body,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating invoice settings:', error);
        return NextResponse.json(
            { error: 'Failed to update invoice settings' },
            { status: 500 }
        );
    }
}

