import React from 'react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    required?: boolean;
    placeholder?: string;
    error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    required,
    placeholder = 'Select an option',
    error
}) => {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={error ? 'border-red-500' : ''}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};
