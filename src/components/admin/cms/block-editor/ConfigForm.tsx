import React from 'react';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { ImageField } from './fields/ImageField';
import { ColorField } from './fields/ColorField';
import { SelectField } from './fields/SelectField';
import { ToggleField } from './fields/ToggleField';
import { SliderField } from './fields/SliderField';
import { RepeaterField } from './fields/RepeaterField';

interface ConfigFormProps {
    schema: {
        fields: any[];
    };
    data: any;
    onChange: (data: any) => void;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({
    schema,
    data,
    onChange
}) => {
    const handleChange = (fieldName: string, value: any) => {
        onChange({
            ...data,
            [fieldName]: value
        });
    };

    if (!schema || !schema.fields) {
        return <div className="text-muted-foreground p-4">No configuration fields defined.</div>;
    }

    return (
        <div className="space-y-6">
            {schema.fields.map((field: any) => {
                const value = data?.[field.name];

                switch (field.type) {
                    case 'text':
                    case 'email':
                    case 'url':
                    case 'number':
                        return (
                            <TextField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                placeholder={field.placeholder}
                                required={field.required}
                                type={field.type}
                                maxLength={field.maxLength}
                            />
                        );
                    case 'textarea':
                        return (
                            <TextareaField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                placeholder={field.placeholder}
                                required={field.required}
                                rows={field.rows}
                                maxLength={field.maxLength}
                            />
                        );
                    case 'image':
                        return (
                            <ImageField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                required={field.required}
                                recommended={field.recommended}
                            />
                        );
                    case 'color':
                        return (
                            <ColorField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                required={field.required}
                            />
                        );
                    case 'select':
                        return (
                            <SelectField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                options={field.options}
                                required={field.required}
                            />
                        );
                    case 'checkbox':
                        return (
                            <ToggleField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                description={field.description}
                            />
                        );
                    case 'slider':
                        return (
                            <SliderField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                unit={field.unit}
                            />
                        );
                    case 'repeater':
                        return (
                            <RepeaterField
                                key={field.name}
                                label={field.label}
                                value={value}
                                onChange={(val) => handleChange(field.name, val)}
                                fields={field.fields}
                                itemLabel={field.itemLabel}
                            />
                        );
                    default:
                        return (
                            <div key={field.name} className="p-4 border border-red-200 bg-red-50 rounded text-red-600">
                                Unknown field type: {field.type}
                            </div>
                        );
                }
            })}
        </div>
    );
};
