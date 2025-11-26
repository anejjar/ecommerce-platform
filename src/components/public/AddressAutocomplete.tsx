'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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

interface AddressData {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface AddressAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onAddressSelect: (address: AddressData) => void;
    label?: string;
    required?: boolean;
}

export function AddressAutocomplete({
    value,
    onChange,
    onAddressSelect,
    label = 'Address',
    required = false,
}: AddressAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchAddress = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            // Using Nominatim API with Morocco country code
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(query)}&` +
                `countrycodes=ma&` + // Morocco country code
                `format=json&` +
                `addressdetails=1&` +
                `limit=5`,
                {
                    headers: {
                        'User-Agent': 'EcommercePlatform/1.0', // Required by Nominatim
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
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

        // Debounce API calls (1 second to respect rate limits)
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

        // Extract city (can be in different fields)
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
    };

    return (
        <div className="space-y-2" ref={wrapperRef}>
            {label && (
                <Label htmlFor="address">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <div className="relative">
                <Input
                    id="address"
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Start typing your address..."
                    required={required}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                type="button"
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => handleSelectSuggestion(suggestion)}
                            >
                                {suggestion.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
                Start typing to see address suggestions
            </p>
        </div>
    );
}
