// Invoice Types

export enum InvoiceType {
  STANDARD = 'STANDARD',
  PROFORMA = 'PROFORMA',
  CREDIT_NOTE = 'CREDIT_NOTE',
  QUOTE = 'QUOTE',
  RECURRING = 'RECURRING',
  RECEIPT = 'RECEIPT',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export interface InvoiceAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface InvoiceItem {
  id?: string;
  productId?: string;
  variantId?: string;
  description: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  discount: number;
  total: number;
  customFields?: Record<string, any>;
  position?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  status: InvoiceStatus;
  invoiceDate: Date | string;
  dueDate?: Date | string;
  sentAt?: Date | string;
  viewedAt?: Date | string;
  paidAt?: Date | string;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  customerCompany?: string;
  billingAddress?: InvoiceAddress | any;
  shippingAddress?: InvoiceAddress | any;
  orderId?: string;
  subtotal: number;
  tax: number;
  taxRate?: number;
  shipping: number;
  discount: number;
  discountType?: string;
  total: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  currencySymbol: string;
  templateId?: string;
  customFields?: Record<string, any>;
  termsAndConditions?: string;
  notes?: string;
  footerText?: string;
  paymentMethod?: string;
  paymentInstructions?: string;
  paymentLink?: string;
  isRecurring?: boolean;
  recurringId?: string;
  qrCodeUrl?: string;
  signatureUrl?: string;
  signedAt?: Date | string;
  signedBy?: string;
  createdById?: string;
  updatedById?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  items?: InvoiceItem[];
  payments?: InvoicePayment[];
  history?: InvoiceHistory[];
}

export interface InvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date | string;
  paymentMethod: string;
  transactionId?: string;
  referenceNumber?: string;
  status: string;
  notes?: string;
  recordedById?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InvoiceHistory {
  id: string;
  invoiceId: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  changedById?: string;
  createdAt: Date | string;
}

export interface InvoiceSettings {
  id: string;
  invoiceNumberPrefix: string;
  invoiceNumberFormat: string;
  nextInvoiceNumber: number;
  defaultTerms?: string;
  defaultNotes?: string;
  defaultDueDays: number;
  logoUrl?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyTaxId?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  defaultTemplateId?: string;
  emailSubjectTemplate?: string;
  emailBodyTemplate?: string;
  autoSendOnCreate: boolean;
  sendCopyToAdmin: boolean;
  adminEmail?: string;
  defaultTaxRate?: number;
  taxLabel: string;
  showTaxBreakdown: boolean;
  currency: string;
  currencySymbol: string;
  paymentMethods?: any;
  showPaymentLink: boolean;
  paymentGateway?: string;
  showQRCode: boolean;
  enableSignatures: boolean;
  customFields?: any;
  multiLanguage: boolean;
  defaultLanguage: string;
  headerText?: string;
  footerText?: string;
  showFooter: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  isSystem: boolean;
  config: any;
  previewImage?: string;
  usageCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface RecurringInvoice {
  id: string;
  name: string;
  description?: string;
  customerId?: string;
  customerEmail?: string;
  frequency: RecurringFrequency;
  interval: number;
  customInterval?: number;
  dayOfMonth?: number;
  dayOfWeek?: number;
  templateId?: string;
  invoiceSettings?: any;
  startDate: Date | string;
  endDate?: Date | string;
  nextRunDate?: Date | string;
  lastRunDate?: Date | string;
  isActive: boolean;
  autoSend: boolean;
  createdById?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  generatedInvoices?: Array<{
    id: string;
    invoiceNumber: string;
    status: string;
    total: number;
    createdAt: Date | string;
  }>;
}

