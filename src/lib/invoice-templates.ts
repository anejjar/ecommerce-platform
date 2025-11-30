// Invoice Template Library
// Predefined professional invoice templates

export interface InvoiceTemplateConfig {
    id: string;
    name: string;
    description: string;
    isSystem: boolean;
    config: {
        layout: {
            header: {
                showLogo: boolean;
                logoPosition: 'left' | 'center' | 'right';
                showCompanyInfo: boolean;
                companyInfoPosition: 'left' | 'right';
            };
            body: {
                showBillingAddress: boolean;
                showShippingAddress: boolean;
                addressLayout: 'side-by-side' | 'stacked';
                showInvoiceDetails: boolean;
            };
            footer: {
                showFooter: boolean;
                showTerms: boolean;
                showNotes: boolean;
            };
        };
        styling: {
            primaryColor: string;
            secondaryColor: string;
            accentColor: string;
            fontFamily: string;
            fontSize: number;
            headerStyle: 'minimal' | 'bold' | 'gradient';
            tableStyle: 'striped' | 'grid' | 'minimal';
        };
        sections: {
            showQRCode: boolean;
            showPaymentLink: boolean;
            showTaxBreakdown: boolean;
            showDiscountDetails: boolean;
        };
    };
}

export const defaultInvoiceTemplates: InvoiceTemplateConfig[] = [
    {
        id: 'classic-professional',
        name: 'Classic Professional',
        description: 'Traditional professional invoice with clean layout',
        isSystem: true,
        config: {
            layout: {
                header: {
                    showLogo: true,
                    logoPosition: 'left',
                    showCompanyInfo: true,
                    companyInfoPosition: 'right',
                },
                body: {
                    showBillingAddress: true,
                    showShippingAddress: true,
                    addressLayout: 'side-by-side',
                    showInvoiceDetails: true,
                },
                footer: {
                    showFooter: true,
                    showTerms: true,
                    showNotes: true,
                },
            },
            styling: {
                primaryColor: '#000000',
                secondaryColor: '#666666',
                accentColor: '#3182ce',
                fontFamily: 'Helvetica',
                fontSize: 10,
                headerStyle: 'bold',
                tableStyle: 'striped',
            },
            sections: {
                showQRCode: false,
                showPaymentLink: true,
                showTaxBreakdown: true,
                showDiscountDetails: true,
            },
        },
    },
    {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'Clean minimalist design focused on clarity',
        isSystem: true,
        config: {
            layout: {
                header: {
                    showLogo: false,
                    logoPosition: 'left',
                    showCompanyInfo: true,
                    companyInfoPosition: 'left',
                },
                body: {
                    showBillingAddress: true,
                    showShippingAddress: false,
                    addressLayout: 'stacked',
                    showInvoiceDetails: true,
                },
                footer: {
                    showFooter: true,
                    showTerms: false,
                    showNotes: false,
                },
            },
            styling: {
                primaryColor: '#000000',
                secondaryColor: '#666666',
                accentColor: '#000000',
                fontFamily: 'Helvetica',
                fontSize: 9,
                headerStyle: 'minimal',
                tableStyle: 'minimal',
            },
            sections: {
                showQRCode: false,
                showPaymentLink: false,
                showTaxBreakdown: false,
                showDiscountDetails: false,
            },
        },
    },
    {
        id: 'colorful-branded',
        name: 'Colorful Branded',
        description: 'Vibrant design with accent colors and branding',
        isSystem: true,
        config: {
            layout: {
                header: {
                    showLogo: true,
                    logoPosition: 'center',
                    showCompanyInfo: true,
                    companyInfoPosition: 'center',
                },
                body: {
                    showBillingAddress: true,
                    showShippingAddress: true,
                    addressLayout: 'side-by-side',
                    showInvoiceDetails: true,
                },
                footer: {
                    showFooter: true,
                    showTerms: true,
                    showNotes: true,
                },
            },
            styling: {
                primaryColor: '#6366f1',
                secondaryColor: '#8b5cf6',
                accentColor: '#ec4899',
                fontFamily: 'Helvetica',
                fontSize: 10,
                headerStyle: 'gradient',
                tableStyle: 'striped',
            },
            sections: {
                showQRCode: true,
                showPaymentLink: true,
                showTaxBreakdown: true,
                showDiscountDetails: true,
            },
        },
    },
    {
        id: 'elegant-corporate',
        name: 'Elegant Corporate',
        description: 'Sophisticated corporate design with professional styling',
        isSystem: true,
        config: {
            layout: {
                header: {
                    showLogo: true,
                    logoPosition: 'left',
                    showCompanyInfo: true,
                    companyInfoPosition: 'right',
                },
                body: {
                    showBillingAddress: true,
                    showShippingAddress: true,
                    addressLayout: 'side-by-side',
                    showInvoiceDetails: true,
                },
                footer: {
                    showFooter: true,
                    showTerms: true,
                    showNotes: true,
                },
            },
            styling: {
                primaryColor: '#1a202c',
                secondaryColor: '#4a5568',
                accentColor: '#2d3748',
                fontFamily: 'Times',
                fontSize: 11,
                headerStyle: 'bold',
                tableStyle: 'grid',
            },
            sections: {
                showQRCode: false,
                showPaymentLink: true,
                showTaxBreakdown: true,
                showDiscountDetails: true,
            },
        },
    },
    {
        id: 'receipt-style',
        name: 'Receipt Style',
        description: 'Compact receipt-style invoice perfect for quick transactions',
        isSystem: true,
        config: {
            layout: {
                header: {
                    showLogo: true,
                    logoPosition: 'center',
                    showCompanyInfo: true,
                    companyInfoPosition: 'center',
                },
                body: {
                    showBillingAddress: false,
                    showShippingAddress: false,
                    addressLayout: 'stacked',
                    showInvoiceDetails: true,
                },
                footer: {
                    showFooter: true,
                    showTerms: false,
                    showNotes: false,
                },
            },
            styling: {
                primaryColor: '#000000',
                secondaryColor: '#333333',
                accentColor: '#000000',
                fontFamily: 'Courier',
                fontSize: 9,
                headerStyle: 'minimal',
                tableStyle: 'minimal',
            },
            sections: {
                showQRCode: false,
                showPaymentLink: false,
                showTaxBreakdown: false,
                showDiscountDetails: false,
            },
        },
    },
];

// Helper to get template by ID
export function getTemplateById(id: string): InvoiceTemplateConfig | undefined {
    return defaultInvoiceTemplates.find(t => t.id === id);
}

// Helper to get all system templates
export function getSystemTemplates(): InvoiceTemplateConfig[] {
    return defaultInvoiceTemplates.filter(t => t.isSystem);
}

