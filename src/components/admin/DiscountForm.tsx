'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const discountSchema = z.object({
    code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    value: z.number().min(0.01, 'Value must be greater than 0'),
    minOrderAmount: z.number().positive().optional(),
    maxUses: z.number().int().positive().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isActive: z.boolean(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

export function DiscountForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<DiscountFormValues>({
        resolver: zodResolver(discountSchema),
        defaultValues: {
            type: 'PERCENTAGE',
            isActive: true,
            startDate: new Date().toISOString().split('T')[0],
        },
    });

    const type = watch('type');

    const onSubmit = async (data: DiscountFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/discounts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    startDate: new Date(data.startDate).toISOString(),
                    endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create discount');
            }

            router.push('/admin/discounts');
            router.refresh();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Create Discount Code</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                placeholder="SUMMER2024"
                                {...register('code')}
                                className={errors.code ? 'border-red-500' : ''}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-500">{errors.code.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                {...register('type')}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="value">Value</Label>
                            <Input
                                id="value"
                                type="number"
                                step="0.01"
                                placeholder={type === 'PERCENTAGE' ? '10' : '5.00'}
                                {...register('value', { valueAsNumber: true })}
                                className={errors.value ? 'border-red-500' : ''}
                            />
                            {errors.value && (
                                <p className="text-sm text-red-500">{errors.value.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minOrderAmount">Min Order Amount (Optional)</Label>
                            <Input
                                id="minOrderAmount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('minOrderAmount', {
                                    setValueAs: (v) => v === '' ? undefined : parseFloat(v)
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                            <Input
                                id="maxUses"
                                type="number"
                                placeholder="100"
                                {...register('maxUses', {
                                    setValueAs: (v) => v === '' ? undefined : parseInt(v)
                                })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                {...register('startDate')}
                                className={errors.startDate ? 'border-red-500' : ''}
                            />
                            {errors.startDate && (
                                <p className="text-sm text-red-500">{errors.startDate.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date (Optional)</Label>
                            <Input
                                id="endDate"
                                type="date"
                                {...register('endDate')}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isActive"
                            {...register('isActive')}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Discount
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
