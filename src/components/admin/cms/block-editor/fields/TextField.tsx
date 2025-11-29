import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    type?: 'text' | 'email' | 'url' | 'number';
    maxLength?: number;
    error?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required,
    type = 'text',
    maxLength,
    error
}) => {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                maxLength={maxLength}
                className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
