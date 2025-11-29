'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantOptionValue {
  id: string;
  value: string;
  position: number;
}

interface VariantOption {
  id: string;
  name: string;
  position: number;
  values: VariantOptionValue[];
}

interface Variant {
  id: string;
  stock: number;
  optionValues: string; // JSON array
}

interface VariantSelectorProps {
  options: VariantOption[];
  variants: Variant[];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionId: string, value: string) => void;
  disabled?: boolean;
}

export function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
  disabled = false,
}: VariantSelectorProps) {
  // Check if a variant is available for given option values
  const isVariantAvailable = (optionId: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionId]: value };
    
    // Check if all options are selected
    const allSelected = options.every(opt => testOptions[opt.id]);
    if (!allSelected) return true; // Allow selection if not all options are selected yet

    // Find matching variant
    const matchingVariant = variants.find((variant) => {
      const variantValues = JSON.parse(variant.optionValues);
      return options.every((option, index) => {
        const optionIndex = options.findIndex(opt => opt.id === option.id);
        return variantValues[optionIndex] === testOptions[option.id];
      });
    });

    return matchingVariant ? matchingVariant.stock > 0 : false;
  };

  // Get stock for current selection
  const getStockForSelection = (): number | null => {
    const allSelected = options.every(opt => selectedOptions[opt.id]);
    if (!allSelected) return null;

    const matchingVariant = variants.find((variant) => {
      const variantValues = JSON.parse(variant.optionValues);
      return options.every((option, index) => {
        const optionIndex = options.findIndex(opt => opt.id === option.id);
        return variantValues[optionIndex] === selectedOptions[option.id];
      });
    });

    return matchingVariant ? matchingVariant.stock : 0;
  };

  // Detect if option is likely a color
  const isColorOption = (optionName: string): boolean => {
    const colorKeywords = ['color', 'colour', 'couleur', 'farbe'];
    return colorKeywords.some(keyword => 
      optionName.toLowerCase().includes(keyword)
    );
  };

  // Detect if option is likely a size
  const isSizeOption = (optionName: string): boolean => {
    const sizeKeywords = ['size', 'taille', 'größe', 'dimension'];
    return sizeKeywords.some(keyword => 
      optionName.toLowerCase().includes(keyword)
    );
  };

  // Get color from value (if it's a hex color or named color)
  const getColorValue = (value: string): string | null => {
    // Check if it's a hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
      return value;
    }
    // Check if it's a named color (basic colors)
    const namedColors: Record<string, string> = {
      'red': '#ef4444',
      'blue': '#3b82f6',
      'green': '#22c55e',
      'yellow': '#eab308',
      'black': '#000000',
      'white': '#ffffff',
      'gray': '#6b7280',
      'grey': '#6b7280',
      'brown': '#a16207',
      'orange': '#f97316',
      'pink': '#ec4899',
      'purple': '#a855f7',
    };
    return namedColors[value.toLowerCase()] || null;
  };

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const isColor = isColorOption(option.name);
        const isSize = isSizeOption(option.name);
        const selectedValue = selectedOptions[option.id];

        return (
          <div key={option.id}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900">
                {option.name}
                {selectedValue && (
                  <span className="ml-2 text-gray-500 font-normal">
                    : {selectedValue}
                  </span>
                )}
              </label>
              {selectedValue && getStockForSelection() !== null && (
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  getStockForSelection()! > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                )}>
                  {getStockForSelection()! > 0 
                    ? `${getStockForSelection()} available`
                    : 'Out of stock'}
                </span>
              )}
            </div>

            <div className={cn(
              "flex flex-wrap gap-2",
              isColor ? "gap-3" : "gap-2"
            )}>
              {option.values
                .sort((a, b) => a.position - b.position)
                .map((value) => {
                  const isSelected = selectedValue === value.value;
                  const isAvailable = isVariantAvailable(option.id, value.value);
                  const colorValue = isColor ? getColorValue(value.value) : null;

                  if (isColor && colorValue) {
                    // Color swatch
                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => !disabled && isAvailable && onOptionChange(option.id, value.value)}
                        disabled={disabled || !isAvailable}
                        className={cn(
                          "relative w-12 h-12 rounded-full border-2 transition-all min-w-[48px] min-h-[48px]",
                          isSelected
                            ? "border-amber-600 ring-2 ring-amber-200 scale-110"
                            : "border-gray-300 hover:border-amber-400",
                          !isAvailable && "opacity-50 cursor-not-allowed grayscale",
                          disabled && "cursor-not-allowed"
                        )}
                        style={{ backgroundColor: colorValue }}
                        aria-label={`Select ${value.value}`}
                        aria-pressed={isSelected}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-gray-400 rotate-45" />
                          </div>
                        )}
                      </button>
                    );
                  } else if (isSize) {
                    // Size button
                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => !disabled && isAvailable && onOptionChange(option.id, value.value)}
                        disabled={disabled || !isAvailable}
                        className={cn(
                          "px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all min-w-[48px] min-h-[44px] flex items-center justify-center",
                          isSelected
                            ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-200"
                            : "border-gray-300 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50",
                          !isAvailable && "opacity-50 cursor-not-allowed line-through",
                          disabled && "cursor-not-allowed"
                        )}
                        aria-label={`Select size ${value.value}`}
                        aria-pressed={isSelected}
                      >
                        {value.value}
                      </button>
                    );
                  } else {
                    // Default button style
                    return (
                      <button
                        key={value.id}
                        type="button"
                        onClick={() => !disabled && isAvailable && onOptionChange(option.id, value.value)}
                        disabled={disabled || !isAvailable}
                        className={cn(
                          "px-4 py-2.5 rounded-lg border-2 font-medium text-sm transition-all min-w-[48px] min-h-[44px] flex items-center justify-center",
                          isSelected
                            ? "border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-200"
                            : "border-gray-300 bg-white text-gray-700 hover:border-amber-400 hover:bg-amber-50",
                          !isAvailable && "opacity-50 cursor-not-allowed",
                          disabled && "cursor-not-allowed"
                        )}
                        aria-label={`Select ${value.value}`}
                        aria-pressed={isSelected}
                      >
                        {value.value}
                        {isSelected && (
                          <Check className="w-4 h-4 ml-2 text-amber-600" />
                        )}
                      </button>
                    );
                  }
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

