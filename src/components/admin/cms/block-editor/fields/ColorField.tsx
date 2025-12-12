import React from 'react';
import { ColorPicker } from '@/components/ui/color-picker';
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
            <ColorPicker
                value={value || '#000000'}
                onChange={onChange}
                showPresets={true}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
