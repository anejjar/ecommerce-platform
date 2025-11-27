import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ToggleFieldProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    description?: string;
}

export const ToggleField: React.FC<ToggleFieldProps> = ({
    label,
    value,
    onChange,
    description
}) => {
    return (
        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label className="text-base">{label}</Label>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <Switch
                checked={value}
                onCheckedChange={onChange}
            />
        </div>
    );
};
