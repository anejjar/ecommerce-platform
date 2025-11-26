// Checkout Settings Types

export interface CheckoutSettings {
  id: string;

  // Field visibility toggles
  showPhone: boolean;
  showCompany: boolean;
  showAddressLine2: boolean;
  requirePhone: boolean;

  // Custom messages
  thankYouMessage: string | null;
  checkoutBanner: string | null;
  checkoutBannerType: string | null;

  // Additional customizations
  enableGuestCheckout: boolean;
  enableOrderNotes: boolean;
  orderNotesLabel: string | null;

  // Shipping options
  freeShippingThreshold: number | null;
  defaultShippingCost: number;

  // PHASE 1: Visual & Branding
  logoUrl: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  buttonStyle: 'rounded' | 'square' | 'pill';
  fontFamily: 'system' | 'inter' | 'roboto' | 'opensans';
  pageWidth: 'narrow' | 'normal' | 'wide';

  // Layout Options
  checkoutLayout: 'single' | 'multi-step';
  progressStyle: 'steps' | 'bar' | 'none';
  orderSummaryPosition: 'right' | 'top' | 'collapsible';

  // PHASE 2: Field Customization
  fieldLabels: FieldLabels | null;
  fieldPlaceholders: FieldPlaceholders | null;
  fieldOrder: string[] | null;

  // Additional Standard Fields
  showDeliveryInstructions: boolean;
  deliveryInstructionsLabel: string | null;
  showAlternativePhone: boolean;
  showGiftMessage: boolean;
  giftMessageLabel: string | null;
  showDeliveryDate: boolean;

  // Custom Fields
  customFields: CustomField[] | null;

  // PHASE 4: Trust & Security
  trustBadges: TrustBadge[] | null;
  showSecuritySeals: boolean;
  moneyBackGuarantee: string | null;
  customerServiceDisplay: boolean;
  customerServiceText: string | null;
  customerServicePhone: string | null;
  customerServiceEmail: string | null;

  // Social Proof
  showOrderCount: boolean;
  orderCountText: string | null;
  showRecentPurchases: boolean;
  recentPurchaseDelay: number | null;
  showTestimonials: boolean;
  testimonials: Testimonial[] | null;
  showTrustRating: boolean;
  trustRatingScore: number | null;
  trustRatingCount: number | null;

  // PHASE 5: Marketing & Conversion
  promotionalBanners: PromotionalBanner[] | null;
  showCountdownTimer: boolean;
  countdownEndDate: Date | null;
  countdownText: string | null;
  showFreeShippingBar: boolean;
  freeShippingBarText: string | null;
  showUpsells: boolean;
  upsellProducts: string[] | null;
  upsellTitle: string | null;
  upsellPosition: 'cart' | 'below-form' | 'modal';

  // Urgency Elements
  showLowStock: boolean;
  lowStockThreshold: number | null;
  lowStockText: string | null;
  scarcityMessage: string | null;
  urgencyBadgeStyle: 'warning' | 'danger' | 'info';

  // Incentives
  discountFieldPosition: 'top' | 'bottom' | 'floating';
  showLoyaltyPoints: boolean;
  loyaltyPointsText: string | null;
  showGiftWithPurchase: boolean;
  giftThreshold: number | null;
  giftDescription: string | null;
  referralDiscountEnabled: boolean;
  referralDiscountText: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface FieldLabels {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  alternativePhone?: string;
  orderNotes?: string;
  deliveryInstructions?: string;
  giftMessage?: string;
  deliveryDate?: string;
}

export interface FieldPlaceholders {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  alternativePhone?: string;
  orderNotes?: string;
  deliveryInstructions?: string;
  giftMessage?: string;
  deliveryDate?: string;
}

export interface CustomField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select type
  position?: number;
}

export const DEFAULT_FIELD_ORDER = [
  'email',
  'firstName',
  'lastName',
  'company',
  'phone',
  'alternativePhone',
  'address',
  'address2',
  'city',
  'state',
  'country',
  'deliveryDate',
  'deliveryInstructions',
  'giftMessage',
  'orderNotes',
];

export const FIELD_DISPLAY_NAMES: Record<string, string> = {
  email: 'Email Address',
  firstName: 'First Name',
  lastName: 'Last Name',
  company: 'Company',
  phone: 'Phone Number',
  alternativePhone: 'Alternative Phone',
  address: 'Address',
  address2: 'Address Line 2',
  city: 'City',
  state: 'Region',
  country: 'Country',
  deliveryDate: 'Delivery Date',
  deliveryInstructions: 'Delivery Instructions',
  giftMessage: 'Gift Message',
  orderNotes: 'Order Notes',
};

// Phase 4 & 5 Types

export interface TrustBadge {
  id: string;
  url: string;
  alt: string;
  position: 'header' | 'footer' | 'sidebar' | 'payment';
  link?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number; // 1-5
  image?: string;
  location?: string;
  date?: string;
}

export interface PromotionalBanner {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  startDate?: Date;
  endDate?: Date;
  position: 'top' | 'middle' | 'bottom';
  link?: string;
  linkText?: string;
}
