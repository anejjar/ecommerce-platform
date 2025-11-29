import React from 'react';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface RichTextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
    label,
    value,
    onChange,
    placeholder,
    required,
    error
}) => {
    return (
        <div className="space-y-2">
            <Label>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className={error ? 'border border-red-500 rounded-md' : 'border rounded-md'}>
                <RichTextEditor
                    content={value || ''}
                    onChange={onChange}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

