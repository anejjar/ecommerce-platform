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

interface Region {
    id: string;
    name: string;
}

interface RegionSelectProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    required?: boolean;
}

export function RegionSelect({
    value,
    onChange,
    label = 'Region',
    required = false,
}: RegionSelectProps) {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRegions() {
            try {
                const response = await fetch('/api/regions');
                if (response.ok) {
                    const data = await response.json();
                    setRegions(data);
                }
            } catch (error) {
                console.error('Error fetching regions:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchRegions();
    }, []);

    if (loading) {
        return (
            <div className="space-y-2">
                {label && <Label>{label}</Label>}
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading regions...</span>
                </div>
            </div>
        );
    }

    if (regions.length === 0) {
        return (
            <div className="space-y-2">
                {label && <Label>{label}</Label>}
                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm text-muted-foreground flex items-center">
                    No regions available
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor="region">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger id="region">
                    <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                    {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                            {region.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
