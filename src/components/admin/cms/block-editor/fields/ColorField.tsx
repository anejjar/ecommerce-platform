import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    error?: string;
}

export const ColorField: React.FC<ColorFieldProps> = ({
    label,
    value,
    onChange,
    required,
    error
}) => {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 shadow-sm shrink-0">
                    <input
                        type="color"
                        value={value || '#000000'}
                        onChange={(e) => onChange(e.target.value)}
                        className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                    />
                </div>
                <Input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#000000"
                    className={`font-mono ${error ? 'border-red-500' : ''}`}
                    maxLength={9}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
