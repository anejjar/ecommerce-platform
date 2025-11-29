import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NumberFieldProps {
    label: string;
    value: number | string;
    onChange: (value: number) => void;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    error?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required,
    min,
    max,
    step,
    unit,
    error
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numValue = parseFloat(e.target.value);
        if (!isNaN(numValue)) {
            onChange(numValue);
        } else if (e.target.value === '') {
            onChange(0);
        }
    };

    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={value || ''}
                    onChange={handleChange}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    className={error ? 'border-red-500' : ''}
                />
                {unit && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{unit}</span>
                )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

