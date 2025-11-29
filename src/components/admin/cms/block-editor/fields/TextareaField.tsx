import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextareaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    error?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required,
    rows = 3,
    maxLength,
    error
}) => {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
                className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
