import React from 'react';
import { TextField } from './fields/TextField';
import { TextareaField } from './fields/TextareaField';
import { ImageField } from './fields/ImageField';
import { ColorField } from './fields/ColorField';
import { SelectField } from './fields/SelectField';
import { ToggleField } from './fields/ToggleField';
import { SliderField } from './fields/SliderField';
import { RepeaterField } from './fields/RepeaterField';
import { RichTextField } from './fields/RichTextField';
import { NumberField } from './fields/NumberField';
import { DateField } from './fields/DateField';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ConfigFormProps {
    schema: {
        fields?: any[];
        tabs?: Array<{
            id: string;
            label: string;
            icon?: string;
            fields: any[];
        }>;
        sections?: Array<{
            id: string;
            label: string;
            description?: string;
            fields: any[];
            collapsible?: boolean;
            defaultOpen?: boolean;
        }>;
    };
    data: any;
    onChange: (data: any) => void;
}

// Helper function to check if a field should be visible based on conditions
const shouldShowField = (field: any, data: any): boolean => {
    if (!field.condition) return true;

    const { field: conditionField, operator, value: conditionValue } = field.condition;
    const fieldValue = data?.[conditionField];

    switch (operator) {
        case 'equals':
            return fieldValue === conditionValue;
        case 'notEquals':
            return fieldValue !== conditionValue;
        case 'contains':
            return String(fieldValue || '').includes(String(conditionValue || ''));
        case 'notContains':
            return !String(fieldValue || '').includes(String(conditionValue || ''));
        case 'greaterThan':
            return Number(fieldValue) > Number(conditionValue);
        case 'lessThan':
            return Number(fieldValue) < Number(conditionValue);
        case 'isEmpty':
            return !fieldValue || fieldValue === '';
        case 'isNotEmpty':
            return fieldValue && fieldValue !== '';
        case 'in':
            return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
        case 'notIn':
            return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue);
        default:
            return true;
    }
};

// Render a single field
const renderField = (field: any, data: any, handleChange: (name: string, value: any) => void) => {
    if (!shouldShowField(field, data)) {
        return null;
    }

    const value = data?.[field.name];

    switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
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
                    error={field.error}
                />
            );
        case 'number':
            return (
                <NumberField
                    key={field.name}
                    label={field.label}
                    value={value}
                    onChange={(val) => handleChange(field.name, val)}
                    placeholder={field.placeholder}
                    required={field.required}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    unit={field.unit}
                    error={field.error}
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
                    placeholder={field.placeholder}
                />
            );
        case 'checkbox':
        case 'boolean':
            return (
                <ToggleField
                    key={field.name}
                    label={field.label}
                    value={value}
                    onChange={(val) => handleChange(field.name, val)}
                    description={field.description}
                />
            );
        case 'array':
            // Simple array field - allows adding/removing string items
            const arrayValue = Array.isArray(value) ? value : (value ? [value] : []);
            return (
                <div key={field.name} className="space-y-2">
                    <Label>{field.label}</Label>
                    {field.description && (
                        <p className="text-xs text-muted-foreground mb-2">{field.description}</p>
                    )}
                    <div className="space-y-2">
                        {arrayValue.map((item: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input
                                    value={typeof item === 'string' ? item : String(item)}
                                    onChange={(e) => {
                                        const newArray = [...arrayValue];
                                        newArray[index] = e.target.value;
                                        handleChange(field.name, newArray);
                                    }}
                                    placeholder={field.placeholder || 'Enter value'}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        const newArray = arrayValue.filter((_: any, i: number) => i !== index);
                                        handleChange(field.name, newArray);
                                    }}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleChange(field.name, [...arrayValue, '']);
                            }}
                            className="w-full"
                        >
                            + Add Item
                        </Button>
                    </div>
                </div>
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
            // Ensure value is always an array for repeater fields
            const repeaterValue = Array.isArray(value) ? value : (value ? [value] : []);
            return (
                <RepeaterField
                    key={field.name}
                    label={field.label}
                    value={repeaterValue}
                    onChange={(val) => handleChange(field.name, val)}
                    fields={field.fields}
                    itemLabel={field.itemLabel}
                />
            );
        case 'richtext':
        case 'richText':
            return (
                <RichTextField
                    key={field.name}
                    label={field.label}
                    value={value}
                    onChange={(val) => handleChange(field.name, val)}
                    placeholder={field.placeholder}
                    required={field.required}
                    error={field.error}
                />
            );
        case 'date':
        case 'datetime':
        case 'time':
            return (
                <DateField
                    key={field.name}
                    label={field.label}
                    value={value}
                    onChange={(val) => handleChange(field.name, val)}
                    placeholder={field.placeholder}
                    required={field.required}
                    type={field.type === 'datetime' ? 'datetime-local' : field.type === 'time' ? 'time' : 'date'}
                    error={field.error}
                />
            );
        case 'separator':
            return <Separator key={field.name} className="my-4" />;
        case 'heading':
            return (
                <div key={field.name} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">{field.label}</h3>
                    {field.description && (
                        <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                </div>
            );
        default:
            return (
                <div key={field.name} className="p-4 border border-red-200 bg-red-50 rounded text-red-600 text-sm">
                    Unknown field type: {field.type}
                </div>
            );
    }
};

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

    // Render fields in a flat list
    const renderFields = (fields: any[]) => {
        return (
            <div className="space-y-6">
                {fields.map((field) => renderField(field, data, handleChange))}
            </div>
        );
    };

    // Render fields organized in sections
    const renderSections = (sections: any[]) => {
        if (sections.some(s => s.collapsible)) {
            // Use accordion for collapsible sections
            return (
                <Accordion type="multiple" defaultValue={sections.filter(s => s.defaultOpen).map(s => s.id)} className="space-y-2">
                    {sections.map((section) => {
                        const visibleFields = section.fields.filter((f: any) => shouldShowField(f, data));
                        if (visibleFields.length === 0) return null;

                        return (
                            <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="text-left">
                                        <div className="font-semibold text-sm">{section.label}</div>
                                        {section.description && (
                                            <div className="text-xs text-muted-foreground font-normal mt-0.5">
                                                {section.description}
                                            </div>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-6 pt-2">
                                        {section.fields.map((field: any) => renderField(field, data, handleChange))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            );
        } else {
            // Use simple sections with separators
            return (
                <div className="space-y-8">
                    {sections.map((section, index) => {
                        const visibleFields = section.fields.filter((f: any) => shouldShowField(f, data));
                        if (visibleFields.length === 0) return null;

                        return (
                            <div key={section.id} className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-foreground">{section.label}</h3>
                                    {section.description && (
                                        <p className="text-xs text-muted-foreground">{section.description}</p>
                                    )}
                                </div>
                                <div className="space-y-6 pl-4 border-l-2 border-border">
                                    {section.fields.map((field: any) => renderField(field, data, handleChange))}
                                </div>
                                {index < sections.length - 1 && <Separator className="my-6" />}
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    // Render fields organized in tabs
    const renderTabs = (tabs: any[]) => {
        return (
            <Tabs defaultValue={tabs[0]?.id} className="w-full">
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {tabs.map((tab) => {
                    const visibleFields = tab.fields.filter((f: any) => shouldShowField(f, data));
                    if (visibleFields.length === 0) return null;

                    return (
                        <TabsContent key={tab.id} value={tab.id} className="mt-4 space-y-6">
                            {tab.fields.map((field: any) => renderField(field, data, handleChange))}
                        </TabsContent>
                    );
                })}
            </Tabs>
        );
    };

    if (!schema) {
        return (
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-amber-900 mb-1">
                            Configuration Schema Missing
                        </h4>
                        <p className="text-xs text-amber-800 mb-2">
                            This block template doesn't have a configuration schema defined. The block will still render, but you won't be able to customize its settings.
                        </p>
                        <p className="text-xs text-amber-700">
                            To enable configuration options, update the block template in the Templates section.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Priority: tabs > sections > fields
    if (schema.tabs && schema.tabs.length > 0) {
        return renderTabs(schema.tabs);
    }

    if (schema.sections && schema.sections.length > 0) {
        return renderSections(schema.sections);
    }

    if (schema.fields && schema.fields.length > 0) {
        return renderFields(schema.fields);
    }

    return (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">
                        No Configuration Fields
                    </h4>
                    <p className="text-xs text-amber-800">
                        This block template has a schema but no configuration fields are defined. The block will render with default settings.
                    </p>
                </div>
            </div>
        </div>
    );
};
