import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET checkout settings (admin)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let settings = await prisma.checkoutSettings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.checkoutSettings.create({
                data: {},
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching checkout settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checkout settings' },
            { status: 500 }
        );
    }
}

// POST/PUT update checkout settings
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Get existing settings or create new
        let settings = await prisma.checkoutSettings.findFirst();

        if (settings) {
            // Update existing
            settings = await prisma.checkoutSettings.update({
                where: { id: settings.id },
                data: {
                    // Basic settings
                    showPhone: data.showPhone,
                    showCompany: data.showCompany,
                    showAddressLine2: data.showAddressLine2,
                    requirePhone: data.requirePhone,
                    thankYouMessage: data.thankYouMessage,
                    checkoutBanner: data.checkoutBanner,
                    checkoutBannerType: data.checkoutBannerType,
                    enableGuestCheckout: data.enableGuestCheckout,
                    enableOrderNotes: data.enableOrderNotes,
                    orderNotesLabel: data.orderNotesLabel,
                    freeShippingThreshold: data.freeShippingThreshold,
                    defaultShippingCost: data.defaultShippingCost,

                    // Phase 1: Branding & Visual
                    logoUrl: data.logoUrl,
                    primaryColor: data.primaryColor,
                    secondaryColor: data.secondaryColor,
                    buttonStyle: data.buttonStyle,
                    fontFamily: data.fontFamily,
                    pageWidth: data.pageWidth,

                    // Layout Options
                    checkoutLayout: data.checkoutLayout,
                    progressStyle: data.progressStyle,
                    orderSummaryPosition: data.orderSummaryPosition,

                    // Phase 2: Field Customization
                    fieldLabels: data.fieldLabels,
                    fieldPlaceholders: data.fieldPlaceholders,
                    fieldOrder: data.fieldOrder,

                    // Additional Fields
                    showDeliveryInstructions: data.showDeliveryInstructions,
                    deliveryInstructionsLabel: data.deliveryInstructionsLabel,
                    showAlternativePhone: data.showAlternativePhone,
                    showGiftMessage: data.showGiftMessage,
                    giftMessageLabel: data.giftMessageLabel,
                    showDeliveryDate: data.showDeliveryDate,

                    // Custom Fields
                    customFields: data.customFields,

                    // Phase 4: Trust & Security
                    trustBadges: data.trustBadges,
                    showSecuritySeals: data.showSecuritySeals,
                    moneyBackGuarantee: data.moneyBackGuarantee,
                    customerServiceDisplay: data.customerServiceDisplay,
                    customerServiceText: data.customerServiceText,
                    customerServicePhone: data.customerServicePhone,
                    customerServiceEmail: data.customerServiceEmail,

                    // Social Proof
                    showOrderCount: data.showOrderCount,
                    orderCountText: data.orderCountText,
                    showRecentPurchases: data.showRecentPurchases,
                    recentPurchaseDelay: data.recentPurchaseDelay,
                    showTestimonials: data.showTestimonials,
                    testimonials: data.testimonials,
                    showTrustRating: data.showTrustRating,
                    trustRatingScore: data.trustRatingScore,
                    trustRatingCount: data.trustRatingCount,

                    // Phase 5: Marketing & Conversion
                    promotionalBanners: data.promotionalBanners,
                    showCountdownTimer: data.showCountdownTimer,
                    countdownEndDate: data.countdownEndDate,
                    countdownText: data.countdownText,
                    showFreeShippingBar: data.showFreeShippingBar,
                    freeShippingBarText: data.freeShippingBarText,
                    showUpsells: data.showUpsells,
                    upsellProducts: data.upsellProducts,
                    upsellTitle: data.upsellTitle,
                    upsellPosition: data.upsellPosition,

                    // Urgency Elements
                    showLowStock: data.showLowStock,
                    lowStockThreshold: data.lowStockThreshold,
                    lowStockText: data.lowStockText,
                    scarcityMessage: data.scarcityMessage,
                    urgencyBadgeStyle: data.urgencyBadgeStyle,

                    // Incentives
                    discountFieldPosition: data.discountFieldPosition,
                    showLoyaltyPoints: data.showLoyaltyPoints,
                    loyaltyPointsText: data.loyaltyPointsText,
                    showGiftWithPurchase: data.showGiftWithPurchase,
                    giftThreshold: data.giftThreshold,
                    giftDescription: data.giftDescription,
                    referralDiscountEnabled: data.referralDiscountEnabled,
                    referralDiscountText: data.referralDiscountText,
                },
            });
        } else {
            // Create new
            settings = await prisma.checkoutSettings.create({
                data,
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error updating checkout settings:', error);
        return NextResponse.json(
            { error: 'Failed to update checkout settings' },
            { status: 500 }
        );
    }
}

// DELETE reset checkout settings to default
export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !['ADMIN', 'SUPERADMIN', 'MANAGER'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get existing settings
        const existingSettings = await prisma.checkoutSettings.findFirst();

        if (!existingSettings) {
            // If no settings exist, create default ones
            const settings = await prisma.checkoutSettings.create({
                data: {},
            });
            return NextResponse.json(settings);
        }

        // Reset all premium settings to null/false/empty while keeping basic settings
        const resetSettings = await prisma.checkoutSettings.update({
            where: { id: existingSettings.id },
            data: {
                // Reset Phase 1: Branding & Visual to defaults
                logoUrl: null,
                primaryColor: null,
                secondaryColor: null,
                buttonStyle: 'rounded',
                fontFamily: 'system',
                pageWidth: 'normal',
                checkoutLayout: 'single',
                progressStyle: 'steps',
                orderSummaryPosition: 'right',

                // Reset Phase 2: Field Customization
                fieldLabels: null,
                fieldPlaceholders: null,
                fieldOrder: null,
                showDeliveryInstructions: false,
                deliveryInstructionsLabel: null,
                showAlternativePhone: false,
                showGiftMessage: false,
                giftMessageLabel: null,
                showDeliveryDate: false,
                customFields: null,

                // Reset Phase 4: Trust & Security
                trustBadges: null,
                showSecuritySeals: false,
                moneyBackGuarantee: null,
                customerServiceDisplay: false,
                customerServiceText: null,
                customerServicePhone: null,
                customerServiceEmail: null,
                showOrderCount: false,
                orderCountText: null,
                showRecentPurchases: false,
                recentPurchaseDelay: 5000,
                showTestimonials: false,
                testimonials: null,
                showTrustRating: false,
                trustRatingScore: null,
                trustRatingCount: null,

                // Reset Phase 5: Marketing & Conversion
                promotionalBanners: null,
                showCountdownTimer: false,
                countdownEndDate: null,
                countdownText: null,
                showFreeShippingBar: false,
                freeShippingBarText: null,
                showUpsells: false,
                upsellProducts: null,
                upsellTitle: null,
                upsellPosition: 'sidebar',
                showLowStock: false,
                lowStockThreshold: 5,
                lowStockText: null,
                scarcityMessage: null,
                urgencyBadgeStyle: 'warning',
                discountFieldPosition: 'sidebar',
                showLoyaltyPoints: false,
                loyaltyPointsText: null,
                showGiftWithPurchase: false,
                giftThreshold: null,
                giftDescription: null,
                referralDiscountEnabled: false,
                referralDiscountText: null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Checkout settings reset to default successfully',
            settings: resetSettings,
        });
    } catch (error) {
        console.error('Error resetting checkout settings:', error);
        return NextResponse.json(
            { error: 'Failed to reset checkout settings' },
            { status: 500 }
        );
    }
}
