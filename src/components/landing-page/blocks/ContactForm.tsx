'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle2, AlertCircle, Mail, Phone, User, MessageSquare, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContactFormProps {
    config: {
        heading?: string;
        subheading?: string;
        description?: string;
        buttonText?: string;
        successMessage?: string;
        backgroundColor?: string;
        showHoneypot?: boolean;
        fields?: Array<{
            name: string;
            label: string;
            type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'number';
            required?: boolean;
            placeholder?: string;
            helpText?: string;
            minLength?: number;
            maxLength?: number;
            pattern?: string;
            options?: Array<{ value: string; label: string }>;
            rows?: number;
        }>;
    };
}

export const ContactForm: React.FC<ContactFormProps> = ({ config }) => {
    const {
        heading = 'Get in touch',
        subheading,
        description = 'Fill out the form below and we\'ll get back to you as soon as possible.',
        buttonText = 'Send Message',
        successMessage = 'Thank you for contacting us. We\'ll get back to you as soon as possible.',
        backgroundColor,
        showHoneypot = true,
        fields = [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: true },
        ],
    } = config;

    const [formData, setFormData] = useState<Record<string, string | boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const honeypotRef = useRef<HTMLInputElement>(null);

    // Validate a single field
    const validateField = (field: typeof fields[0], value: string | boolean): string | null => {
        const stringValue = typeof value === 'string' ? value.trim() : '';
        const boolValue = typeof value === 'boolean' ? value : false;

        // Required validation
        if (field.required) {
            if (field.type === 'checkbox') {
                if (!boolValue) {
                    return `${field.label} is required`;
                }
            } else {
                if (!stringValue) {
                    return `${field.label} is required`;
                }
            }
        }

        // Skip further validation if field is empty and not required
        if (!stringValue && !field.required) {
            return null;
        }

        // Type-specific validation
        if (field.type === 'email' && stringValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(stringValue)) {
                return 'Please enter a valid email address';
            }
        }

        if (field.type === 'tel' && stringValue) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(stringValue)) {
                return 'Please enter a valid phone number';
            }
        }

        // Length validation
        if (field.minLength && stringValue.length < field.minLength) {
            return `${field.label} must be at least ${field.minLength} characters`;
        }

        if (field.maxLength && stringValue.length > field.maxLength) {
            return `${field.label} must not exceed ${field.maxLength} characters`;
        }

        // Pattern validation
        if (field.pattern && stringValue) {
            try {
                const regex = new RegExp(field.pattern);
                if (!regex.test(stringValue)) {
                    return field.helpText || `${field.label} format is invalid`;
                }
            } catch (e) {
                console.error('Invalid regex pattern:', field.pattern);
            }
        }

        return null;
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        fields.forEach(field => {
            const value = formData[field.name];
            const error = validateField(field, value as string | boolean);
            if (error) {
                newErrors[field.name] = error;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Honeypot spam protection
        if (showHoneypot && honeypotRef.current?.value) {
            // Bot detected - silently fail
            return;
        }

        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {};
        fields.forEach(field => {
            allTouched[field.name] = true;
        });
        setTouched(allTouched);

        // Validate form
        if (!validateForm()) {
            const firstError = Object.values(errors)[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fields: fields.map(field => ({
                        name: field.name,
                        label: field.label,
                        value: typeof formData[field.name] === 'boolean' 
                            ? formData[field.name] 
                            : (formData[field.name] || ''),
                    })),
                    source: 'landing-page',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setFormData({});
                setErrors({});
                setTouched({});
                toast.success('Thank you! Your message has been sent successfully.');
            } else {
                toast.error(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (name: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (field: typeof fields[0]) => {
        setTouched(prev => ({ ...prev, [field.name]: true }));
        const value = formData[field.name];
        const error = validateField(field, value as string | boolean);
        if (error) {
            setErrors(prev => ({ ...prev, [field.name]: error }));
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setFormData({});
        setErrors({});
        setTouched({});
    };

    const getFieldIcon = (type: string) => {
        switch (type) {
            case 'email': return Mail;
            case 'tel': return Phone;
            case 'text': return User;
            case 'textarea': return MessageSquare;
            default: return null;
        }
    };

    return (
        <section 
            className="py-24" 
            style={backgroundColor ? { backgroundColor } : undefined}
        >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    {subheading && (
                        <p className="text-primary font-semibold mb-2 text-sm uppercase tracking-wide">
                            {subheading}
                        </p>
                    )}
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
                    {description && (
                        <p className="text-lg text-gray-600">{description}</p>
                    )}
                </div>

                {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-900 mb-2">Message Sent!</h3>
                        <p className="text-green-700 mb-6">{successMessage}</p>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Send Another Message
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Honeypot field for spam protection */}
                        {showHoneypot && (
                            <input
                                ref={honeypotRef}
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                className="absolute opacity-0 pointer-events-none"
                                aria-hidden="true"
                            />
                        )}

                        {fields.map((field, index) => {
                            const Icon = getFieldIcon(field.type);
                            const hasError = touched[field.name] && errors[field.name];
                            const value = formData[field.name] || '';
                            const charCount = typeof value === 'string' ? value.length : 0;

                            return (
                                <div key={`field-${field.name || index}-${index}`} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor={field.name} className="flex items-center gap-1">
                                            {Icon && <Icon className="h-4 w-4 text-gray-500" />}
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </Label>
                                        {field.maxLength && typeof value === 'string' && (
                                            <span className={cn(
                                                "text-xs",
                                                charCount > field.maxLength ? "text-red-500" : "text-gray-500"
                                            )}>
                                                {charCount}/{field.maxLength}
                                            </span>
                                        )}
                                    </div>

                                    {field.type === 'textarea' ? (
                                        <div className="relative">
                                            <Textarea
                                                id={field.name}
                                                name={field.name}
                                                value={typeof value === 'string' ? value : ''}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                onBlur={() => handleBlur(field)}
                                                required={field.required}
                                                rows={field.rows || 5}
                                                disabled={isSubmitting}
                                                placeholder={field.placeholder}
                                                className={cn(
                                                    hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                )}
                                            />
                                        </div>
                                    ) : field.type === 'select' ? (
                                        <Select
                                            value={typeof value === 'string' && value ? value : undefined}
                                            onValueChange={(val) => handleChange(field.name, val)}
                                            disabled={isSubmitting}
                                            required={field.required}
                                        >
                                            <SelectTrigger className={cn(
                                                hasError && "border-red-500 focus:border-red-500"
                                            )}>
                                                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {field.options && field.options.length > 0 ? (
                                                    field.options
                                                        .filter(option => option && option.value && String(option.value).trim() !== '')
                                                        .map((option, optionIndex) => {
                                                            const optionValue = String(option.value);
                                                            const optionKey = `field-${index}-${field.name}-opt-${optionIndex}-${optionValue}`;
                                                            return (
                                                                <SelectItem 
                                                                    key={optionKey}
                                                                    value={optionValue}
                                                                >
                                                                    {option.label || optionValue}
                                                                </SelectItem>
                                                            );
                                                        })
                                                ) : (
                                                    <SelectItem value="no-options" disabled>
                                                        No options available
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === 'checkbox' ? (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id={field.name}
                                                checked={typeof value === 'boolean' ? value : false}
                                                onCheckedChange={(checked) => handleChange(field.name, checked as boolean)}
                                                onBlur={() => handleBlur(field)}
                                                disabled={isSubmitting}
                                                required={field.required}
                                            />
                                            <Label htmlFor={field.name} className="font-normal cursor-pointer">
                                                {field.helpText || field.label}
                                            </Label>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            {Icon && (
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                            )}
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type === 'tel' ? 'tel' : field.type}
                                                value={typeof value === 'string' ? value : ''}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                onBlur={() => handleBlur(field)}
                                                required={field.required}
                                                disabled={isSubmitting}
                                                placeholder={field.placeholder}
                                                minLength={field.minLength}
                                                maxLength={field.maxLength}
                                                pattern={field.pattern}
                                                className={cn(
                                                    Icon && "pl-10",
                                                    hasError && "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                )}
                                            />
                                        </div>
                                    )}

                                    {hasError && (
                                        <div className="flex items-center gap-1 text-sm text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>{errors[field.name]}</span>
                                        </div>
                                    )}

                                    {field.helpText && !hasError && (
                                        <p className="text-xs text-gray-500">{field.helpText}</p>
                                    )}
                                </div>
                            );
                        })}

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                            size="lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                buttonText
                            )}
                        </Button>
                    </form>
                )}
            </div>
        </section>
    );
};
