'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
}

interface CheckoutProgressProps {
  currentStep: number;
  steps: string[];
}

export function CheckoutProgress({ currentStep, steps }: CheckoutProgressProps) {
  const stepItems: CheckoutStep[] = steps.map((step, index) => ({
    id: step,
    label: step,
    completed: index < currentStep,
    active: index === currentStep,
  }));

  return (
    <div className="w-full py-6 md:py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
          <div
            className="h-full bg-amber-600 transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {stepItems.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            {/* Step Circle */}
            <div
              className={cn(
                'relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-300',
                step.completed
                  ? 'bg-amber-600 text-white shadow-lg scale-110'
                  : step.active
                  ? 'bg-amber-600 text-white shadow-lg ring-4 ring-amber-200 scale-110'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {step.completed ? (
                <Check className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Step Label */}
            <div className="mt-3 text-center max-w-[100px] md:max-w-none">
              <p
                className={cn(
                  'text-xs md:text-sm font-medium transition-colors',
                  step.active || step.completed
                    ? 'text-amber-900 font-semibold'
                    : 'text-gray-500'
                )}
              >
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

