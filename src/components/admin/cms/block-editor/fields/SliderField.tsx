import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SliderFieldProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
}

export const SliderField: React.FC<SliderFieldProps> = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = ''
}) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label>{label}</Label>
                <span className="text-sm text-muted-foreground font-mono">
                    {value}{unit}
                </span>
            </div>
            <Slider
                value={[value || min]}
                min={min}
                max={max}
                step={step}
                onValueChange={(vals) => onChange(vals[0])}
            />
        </div>
    );
};
