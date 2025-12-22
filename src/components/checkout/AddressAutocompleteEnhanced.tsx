'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, X, Search } from 'lucide-react';
import { AddressData } from '@/types/checkout-settings';

interface NominatimResult {
  place_id: number;
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressAutocompleteEnhancedProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressData) => void;
  onMapPickerClick?: () => void;
  label?: string;
  required?: boolean;
  showMapButton?: boolean;
  recentAddresses?: AddressData[];
  error?: string;
  disabled?: boolean;
  minChars?: number;
  showIcon?: boolean;
}

export function AddressAutocompleteEnhanced({
  value,
  onChange,
  onAddressSelect,
  onMapPickerClick,
  label = 'Address',
  required = false,
  showMapButton = false,
  recentAddresses = [],
  error,
  disabled = false,
  minChars = 3,
  showIcon = true,
}: AddressAutocompleteEnhancedProps) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search address with debouncing
  const searchAddress = async (query: string) => {
    if (query.length < minChars) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `countrycodes=ma&` +
          `format=json&` +
          `addressdetails=1&` +
          `limit=5`,
        {
          headers: {
            'User-Agent': 'EcommercePlatform/1.0',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(newValue);
    }, 1000);
  };

  const handleSelectSuggestion = (result: NominatimResult) => {
    const { address } = result;

    // Build full address string
    const addressParts = [];
    if (address.house_number) addressParts.push(address.house_number);
    if (address.road) addressParts.push(address.road);
    const fullAddress = addressParts.join(' ') || result.display_name.split(',')[0];

    // Extract city
    const city = address.city || address.town || address.village || '';

    // Update form with parsed address
    onAddressSelect({
      address: fullAddress,
      city: city,
      state: address.state || '',
      zip: address.postcode || '',
      country: address.country || 'Morocco',
    });

    onChange(fullAddress);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleSelectRecent = (recentAddress: AddressData) => {
    onChange(recentAddress.address);
    onAddressSelect(recentAddress);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'ArrowDown' && value.length >= minChars) {
        setShowSuggestions(true);
      }
      return;
    }

    const totalItems = (recentAddresses.length > 0 ? recentAddresses.length : 0) + suggestions.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (recentAddresses.length > 0 && selectedIndex < recentAddresses.length) {
            handleSelectRecent(recentAddresses[selectedIndex]);
          } else {
            const suggestionIndex = selectedIndex - recentAddresses.length;
            if (suggestions[suggestionIndex]) {
              handleSelectSuggestion(suggestions[suggestionIndex]);
            }
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      {label && (
        <Label htmlFor="address-autocomplete">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        {/* Input with Icons */}
        <div className="relative">
          {showIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </div>
          )}

          <Input
            ref={inputRef}
            id="address-autocomplete"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (value.length >= minChars || recentAddresses.length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder={`Start typing your address (min ${minChars} characters)...`}
            required={required}
            disabled={disabled}
            className={`${showIcon ? 'pl-10' : ''} ${value ? 'pr-10' : ''} ${
              error ? 'border-red-500' : ''
            }`}
            autoComplete="off"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (recentAddresses.length > 0 || suggestions.length > 0) && (
          <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-auto">
            {/* Recent Addresses */}
            {recentAddresses.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                  Recent Addresses
                </div>
                {recentAddresses.map((address, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    className={`w-full px-4 py-3 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none transition-colors ${
                      selectedIndex === index ? 'bg-accent' : ''
                    }`}
                    onClick={() => handleSelectRecent(address)}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{address.address}</p>
                        {address.city && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {address.city}
                            {address.state && `, ${address.state}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
                {suggestions.length > 0 && <div className="border-t my-1" />}
              </div>
            )}

            {/* Search Results */}
            {suggestions.length > 0 && (
              <div>
                {recentAddresses.length === 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                    Search Results
                  </div>
                )}
                {suggestions.map((suggestion, index) => {
                  const globalIndex = recentAddresses.length + index;
                  return (
                    <button
                      key={suggestion.place_id}
                      type="button"
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-accent focus:bg-accent focus:outline-none transition-colors ${
                        selectedIndex === globalIndex ? 'bg-accent' : ''
                      }`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p>{suggestion.display_name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {showSuggestions &&
          !loading &&
          value.length >= minChars &&
          suggestions.length === 0 &&
          recentAddresses.length === 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No addresses found</p>
                <p className="text-xs mt-1">Try a different search or use the map picker</p>
              </div>
            </div>
          )}
      </div>

      {/* Map Picker Button */}
      {showMapButton && onMapPickerClick && (
        <Button
          type="button"
          variant="outline"
          onClick={onMapPickerClick}
          className="w-full"
          disabled={disabled}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Choose location on map
        </Button>
      )}

      {/* Helper Text or Error */}
      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Start typing to see address suggestions. Use arrow keys to navigate.
        </p>
      )}
    </div>
  );
}
