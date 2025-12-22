'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FieldVisibilityConfig,
  DEFAULT_FIELD_VISIBILITY,
  CheckoutSettings,
} from '@/types/checkout-settings';
import { RegionSelect } from '@/components/public/RegionSelect';
import { CitySelect } from '@/components/public/CitySelect';
import { AddressAutocompleteEnhanced } from '@/components/checkout/AddressAutocompleteEnhanced';

interface CheckoutFieldRendererProps {
  fieldConfig: FieldVisibilityConfig | null;
  formData: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  checkoutSettings: CheckoutSettings | null;
  getError?: (field: string) => string | undefined;
  getFieldLabel?: (field: string) => string;
  getFieldPlaceholder?: (field: string) => string;
  buttonClass?: string;
  onMapPickerClick?: () => void; // NEW: Handler for map picker
  showMapButton?: boolean; // NEW: Show map picker button
}

export function CheckoutFieldRenderer({
  fieldConfig,
  formData,
  onChange,
  errors,
  checkoutSettings,
  getError,
  getFieldLabel,
  getFieldPlaceholder,
  buttonClass = '',
  onMapPickerClick,
  showMapButton = false,
}: CheckoutFieldRendererProps) {
  // Use provided config or fallback to defaults
  const config = fieldConfig || DEFAULT_FIELD_VISIBILITY;

  // Helper function to check if field should be visible
  const isVisible = (fieldName: string): boolean => {
    return config[fieldName]?.visible ?? true;
  };

  // Helper function to check if field is required
  const isRequired = (fieldName: string): boolean => {
    return config[fieldName]?.required ?? false;
  };

  // Get label for field
  const getLabel = (fieldName: string): string => {
    if (getFieldLabel) return getFieldLabel(fieldName);

    const labels: Record<string, string> = {
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
      postalCode: 'Postal Code',
      deliveryDate: 'Preferred Delivery Date',
      deliveryInstructions: 'Delivery Instructions',
      giftMessage: 'Gift Message',
      orderNotes: 'Order Notes',
    };
    return labels[fieldName] || fieldName;
  };

  // Get placeholder for field
  const getPlaceholder = (fieldName: string): string => {
    if (getFieldPlaceholder) return getFieldPlaceholder(fieldName);

    const placeholders: Record<string, string> = {
      email: 'your.email@example.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Company name (optional)',
      phone: '+212 6XX XXX XXX',
      alternativePhone: '+212 6XX XXX XXX',
      address: 'Street address',
      address2: 'Apartment, suite, unit, etc. (optional)',
      city: 'City',
      state: 'Region',
      postalCode: '12345',
      deliveryDate: 'Select date',
      deliveryInstructions: 'Any special instructions for delivery',
      giftMessage: 'Your gift message',
      orderNotes: 'Notes about your order',
    };
    return placeholders[fieldName] || '';
  };

  // Get error for field
  const getFieldError = (fieldName: string): string | undefined => {
    if (getError) return getError(fieldName);
    return errors[fieldName];
  };

  // Handle address selection from autocomplete
  const handleAddressSelect = (addressData: any) => {
    onChange('address', addressData.address);
    onChange('city', addressData.city);
    onChange('state', addressData.state);
    onChange('postalCode', addressData.zip);
  };

  return (
    <div className="space-y-4">
      {/* Email */}
      {isVisible('email') && (
        <div>
          <Label htmlFor="email">
            {getLabel('email')}
            {isRequired('email') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder={getPlaceholder('email')}
            required={isRequired('email')}
            className={`mt-2 ${getFieldError('email') ? 'border-red-500' : ''} ${buttonClass}`}
            inputMode="email"
          />
          {getFieldError('email') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('email')}</p>
          )}
        </div>
      )}

      {/* First Name */}
      {isVisible('firstName') && (
        <div>
          <Label htmlFor="firstName">
            {getLabel('firstName')}
            {isRequired('firstName') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="firstName"
            value={formData.firstName || ''}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder={getPlaceholder('firstName')}
            required={isRequired('firstName')}
            className={`mt-2 ${getFieldError('firstName') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('firstName') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('firstName')}</p>
          )}
        </div>
      )}

      {/* Last Name */}
      {isVisible('lastName') && (
        <div>
          <Label htmlFor="lastName">
            {getLabel('lastName')}
            {isRequired('lastName') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="lastName"
            value={formData.lastName || ''}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder={getPlaceholder('lastName')}
            required={isRequired('lastName')}
            className={`mt-2 ${getFieldError('lastName') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('lastName') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('lastName')}</p>
          )}
        </div>
      )}

      {/* Company */}
      {isVisible('company') && (
        <div>
          <Label htmlFor="company">
            {getLabel('company')}
            {isRequired('company') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="company"
            value={formData.company || ''}
            onChange={(e) => onChange('company', e.target.value)}
            placeholder={getPlaceholder('company')}
            required={isRequired('company')}
            className={`mt-2 ${getFieldError('company') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('company') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('company')}</p>
          )}
        </div>
      )}

      {/* Phone */}
      {isVisible('phone') && (
        <div>
          <Label htmlFor="phone">
            {getLabel('phone')}
            {isRequired('phone') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder={getPlaceholder('phone')}
            required={isRequired('phone')}
            className={`mt-2 ${getFieldError('phone') ? 'border-red-500' : ''} ${buttonClass}`}
            inputMode="tel"
          />
          {getFieldError('phone') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('phone')}</p>
          )}
        </div>
      )}

      {/* Alternative Phone */}
      {isVisible('alternativePhone') && (
        <div>
          <Label htmlFor="alternativePhone">
            {getLabel('alternativePhone')}
            {isRequired('alternativePhone') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="alternativePhone"
            type="tel"
            value={formData.alternativePhone || ''}
            onChange={(e) => onChange('alternativePhone', e.target.value)}
            placeholder={getPlaceholder('alternativePhone')}
            required={isRequired('alternativePhone')}
            className={`mt-2 ${getFieldError('alternativePhone') ? 'border-red-500' : ''} ${buttonClass}`}
            inputMode="tel"
          />
          {getFieldError('alternativePhone') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('alternativePhone')}</p>
          )}
        </div>
      )}

      {/* Address - Use autocomplete or dropdown based on settings */}
      {isVisible('address') && checkoutSettings?.addressInputMethod === 'autocomplete' ? (
        <AddressAutocompleteEnhanced
          value={formData.address || ''}
          onChange={(value) => onChange('address', value)}
          onAddressSelect={handleAddressSelect}
          label={getLabel('address')}
          required={isRequired('address')}
          onMapPickerClick={onMapPickerClick}
          showMapButton={showMapButton}
          minChars={checkoutSettings?.addressAutocompleteMinChars || 3}
          showIcon={checkoutSettings?.showAddressAutocompleteIcon ?? true}
          error={getFieldError('address')}
        />
      ) : isVisible('address') ? (
        <div>
          <Label htmlFor="address">
            {getLabel('address')}
            {isRequired('address') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder={getPlaceholder('address')}
            required={isRequired('address')}
            className={`mt-2 ${getFieldError('address') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('address') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('address')}</p>
          )}
        </div>
      ) : null}

      {/* Address Line 2 */}
      {isVisible('address2') && (
        <div>
          <Label htmlFor="address2">
            {getLabel('address2')}
            {isRequired('address2') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="address2"
            value={formData.address2 || ''}
            onChange={(e) => onChange('address2', e.target.value)}
            placeholder={getPlaceholder('address2')}
            required={isRequired('address2')}
            className={`mt-2 ${getFieldError('address2') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('address2') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('address2')}</p>
          )}
        </div>
      )}

      {/* City - Use dropdown if not in autocomplete mode */}
      {isVisible('city') && checkoutSettings?.addressInputMethod === 'dropdown' ? (
        <>
          {isVisible('state') && (
            <RegionSelect
              value={formData.state || ''}
              onChange={(value) => onChange('state', value)}
              label={getLabel('state')}
              required={isRequired('state')}
            />
          )}
          <CitySelect
            regionId={formData.state || ''}
            value={formData.city || ''}
            onChange={(value) => onChange('city', value)}
            label={getLabel('city')}
            required={isRequired('city')}
          />
        </>
      ) : isVisible('city') ? (
        <div>
          <Label htmlFor="city">
            {getLabel('city')}
            {isRequired('city') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="city"
            value={formData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder={getPlaceholder('city')}
            required={isRequired('city')}
            className={`mt-2 ${getFieldError('city') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('city') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('city')}</p>
          )}
        </div>
      ) : null}

      {/* State - Only show if in autocomplete mode and not already shown with city */}
      {isVisible('state') && checkoutSettings?.addressInputMethod === 'autocomplete' && (
        <div>
          <Label htmlFor="state">
            {getLabel('state')}
            {isRequired('state') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="state"
            value={formData.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder={getPlaceholder('state')}
            required={isRequired('state')}
            className={`mt-2 ${getFieldError('state') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('state') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('state')}</p>
          )}
        </div>
      )}

      {/* Postal Code */}
      {isVisible('postalCode') && (
        <div>
          <Label htmlFor="postalCode">
            {getLabel('postalCode')}
            {isRequired('postalCode') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="postalCode"
            value={formData.postalCode || ''}
            onChange={(e) => onChange('postalCode', e.target.value)}
            placeholder={getPlaceholder('postalCode')}
            required={isRequired('postalCode')}
            className={`mt-2 ${getFieldError('postalCode') ? 'border-red-500' : ''} ${buttonClass}`}
            inputMode="numeric"
          />
          {getFieldError('postalCode') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('postalCode')}</p>
          )}
        </div>
      )}

      {/* Delivery Date */}
      {isVisible('deliveryDate') && (
        <div>
          <Label htmlFor="deliveryDate">
            {getLabel('deliveryDate')}
            {isRequired('deliveryDate') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id="deliveryDate"
            type="date"
            value={formData.deliveryDate || ''}
            onChange={(e) => onChange('deliveryDate', e.target.value)}
            required={isRequired('deliveryDate')}
            className={`mt-2 ${getFieldError('deliveryDate') ? 'border-red-500' : ''} ${buttonClass}`}
          />
          {getFieldError('deliveryDate') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('deliveryDate')}</p>
          )}
        </div>
      )}

      {/* Delivery Instructions */}
      {isVisible('deliveryInstructions') && (
        <div>
          <Label htmlFor="deliveryInstructions">
            {getLabel('deliveryInstructions')}
            {isRequired('deliveryInstructions') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id="deliveryInstructions"
            value={formData.deliveryInstructions || ''}
            onChange={(e) => onChange('deliveryInstructions', e.target.value)}
            placeholder={getPlaceholder('deliveryInstructions')}
            required={isRequired('deliveryInstructions')}
            rows={3}
            className={`mt-2 ${getFieldError('deliveryInstructions') ? 'border-red-500' : ''}`}
          />
          {getFieldError('deliveryInstructions') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('deliveryInstructions')}</p>
          )}
        </div>
      )}

      {/* Gift Message */}
      {isVisible('giftMessage') && (
        <div>
          <Label htmlFor="giftMessage">
            {getLabel('giftMessage')}
            {isRequired('giftMessage') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id="giftMessage"
            value={formData.giftMessage || ''}
            onChange={(e) => onChange('giftMessage', e.target.value)}
            placeholder={getPlaceholder('giftMessage')}
            required={isRequired('giftMessage')}
            rows={3}
            className={`mt-2 ${getFieldError('giftMessage') ? 'border-red-500' : ''}`}
          />
          {getFieldError('giftMessage') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('giftMessage')}</p>
          )}
        </div>
      )}

      {/* Order Notes */}
      {isVisible('orderNotes') && (
        <div>
          <Label htmlFor="orderNotes">
            {getLabel('orderNotes')}
            {isRequired('orderNotes') && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id="orderNotes"
            value={formData.orderNotes || ''}
            onChange={(e) => onChange('orderNotes', e.target.value)}
            placeholder={getPlaceholder('orderNotes')}
            required={isRequired('orderNotes')}
            rows={4}
            className={`mt-2 ${getFieldError('orderNotes') ? 'border-red-500' : ''}`}
          />
          {getFieldError('orderNotes') && (
            <p className="text-sm text-red-600 mt-1">{getFieldError('orderNotes')}</p>
          )}
        </div>
      )}
    </div>
  );
}
