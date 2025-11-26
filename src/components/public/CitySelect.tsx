'use client';

import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface City {
    id: string;
    name: string;
    regionId: string;
}

interface CitySelectProps {
    value: string;
    onChange: (value: string) => void;
    regionId: string | null;
    label?: string;
    required?: boolean;
}

export function CitySelect({
    value,
    onChange,
    regionId,
    label = 'City',
    required = false,
}: CitySelectProps) {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!regionId) {
            setCities([]);
            return;
        }

        async function fetchCities() {
            setLoading(true);
            try {
                const response = await fetch(`/api/cities?regionId=${regionId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCities(data);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCities();
    }, [regionId]);

    if (!regionId) {
        return (
            <div className="space-y-2">
                {label && <Label>{label}</Label>}
                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm text-muted-foreground flex items-center">
                    Please select a region first
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-2">
                {label && <Label>{label}</Label>}
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading cities...</span>
                </div>
            </div>
        );
    }

    if (cities.length === 0) {
        return (
            <div className="space-y-2">
                {label && <Label>{label}</Label>}
                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm text-muted-foreground flex items-center">
                    No cities available for this region
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor="city">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="city">
                    <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                    {cities.map((city) => (
                        <SelectItem key={city.id} value={city.name}>
                            {city.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
