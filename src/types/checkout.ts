// Checkout Types

export enum OrderSource {
  WEBSITE = 'WEBSITE',
  WHATSAPP = 'WHATSAPP',
  POS = 'POS',
  ADMIN = 'ADMIN',
}

export interface WhatsAppOrderData {
  timestamp: string;
  customerPhone: string;
  messagePreview: string;
  conversionSource: 'button_click' | 'manual';
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface AddressInputConfig {
  method: 'autocomplete' | 'dropdown';
  requireRegion: boolean;
  requireCity: boolean;
}
