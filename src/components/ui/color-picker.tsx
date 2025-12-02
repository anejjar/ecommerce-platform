'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showPresets?: boolean;
}

// Preset colors
const PRESET_COLORS = [
  '#000000', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
  '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#dc2626', '#d97706', '#ca8a04', '#16a34a', '#2563eb', '#4f46e5', '#7c3aed', '#db2777',
  '#991b1b', '#92400e', '#854d0e', '#15803d', '#1e40af', '#3730a3', '#6d28d9', '#be185d',
];

export function ColorPicker({
  value,
  onChange,
  disabled = false,
  className,
  showPresets = true,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hexValue, setHexValue] = React.useState(value || '#000000');

  React.useEffect(() => {
    setHexValue(value || '#000000');
  }, [value]);

  const handleHexChange = (newHex: string) => {
    // Remove # if present
    let cleanHex = newHex.replace('#', '');
    
    // Validate hex color
    if (/^[0-9A-Fa-f]{0,6}$/.test(cleanHex)) {
      if (cleanHex.length === 6 || cleanHex.length === 3) {
        const fullHex = cleanHex.length === 3 
          ? cleanHex.split('').map(c => c + c).join('')
          : cleanHex;
        const finalHex = `#${fullHex}`;
        setHexValue(finalHex);
        onChange(finalHex);
      } else {
        setHexValue(`#${cleanHex}`);
      }
    }
  };

  const handlePresetClick = (color: string) => {
    setHexValue(color);
    onChange(color);
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange(newColor);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal h-10',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <div
              className="h-5 w-5 rounded border border-gray-300 shrink-0"
              style={{ backgroundColor: value || '#000000' }}
            />
            <span className="font-mono text-sm flex-1 text-left">
              {value || '#000000'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          {/* Native Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color Picker</label>
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-full h-32 rounded-md border-2 border-gray-200"
                  style={{ backgroundColor: hexValue }}
                />
              </div>
              <input
                type="color"
                value={hexValue}
                onChange={handleNativeColorChange}
                className="w-full h-32 opacity-0 cursor-pointer"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Hex Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Hex Code</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={hexValue}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                className="font-mono"
                disabled={disabled}
                maxLength={7}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="shrink-0"
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preset Colors */}
          {showPresets && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Presets</label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    className={cn(
                      'h-8 w-8 rounded border-2 transition-all hover:scale-110',
                      hexValue.toLowerCase() === color.toLowerCase()
                        ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400'
                        : 'border-gray-200 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: color }}
                    disabled={disabled}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Compact version for inline use (like in appearance settings)
interface CompactColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CompactColorPicker({
  value,
  onChange,
  disabled = false,
  className,
}: CompactColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hexValue, setHexValue] = React.useState(value || '#000000');

  React.useEffect(() => {
    setHexValue(value || '#000000');
  }, [value]);

  const handleHexChange = (newHex: string) => {
    let cleanHex = newHex.replace('#', '');
    if (/^[0-9A-Fa-f]{0,6}$/.test(cleanHex)) {
      if (cleanHex.length === 6 || cleanHex.length === 3) {
        const fullHex = cleanHex.length === 3 
          ? cleanHex.split('').map(c => c + c).join('')
          : cleanHex;
        const finalHex = `#${fullHex}`;
        setHexValue(finalHex);
        onChange(finalHex);
      } else {
        setHexValue(`#${cleanHex}`);
      }
    }
  };

  const handlePresetClick = (color: string) => {
    setHexValue(color);
    onChange(color);
  };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setHexValue(newColor);
    onChange(newColor);
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              'h-10 w-20 rounded-md border-2 border-gray-300 cursor-pointer transition-all hover:scale-105 hover:border-gray-400',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            style={{ backgroundColor: value || '#000000' }}
            title="Click to open color picker"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            {/* Native Color Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Color Picker</label>
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="w-full h-32 rounded-md border-2 border-gray-200"
                    style={{ backgroundColor: hexValue }}
                  />
                </div>
                <input
                  type="color"
                  value={hexValue}
                  onChange={handleNativeColorChange}
                  className="w-full h-32 opacity-0 cursor-pointer"
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Hex Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hex Code</label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#000000"
                  className="font-mono"
                  disabled={disabled}
                  maxLength={7}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="shrink-0"
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Preset Colors */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Presets</label>
              <div className="grid grid-cols-8 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetClick(color)}
                    className={cn(
                      'h-8 w-8 rounded border-2 transition-all hover:scale-110',
                      hexValue.toLowerCase() === color.toLowerCase()
                        ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-400'
                        : 'border-gray-200 hover:border-gray-400'
                    )}
                    style={{ backgroundColor: color }}
                    disabled={disabled}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="font-mono flex-1"
        disabled={disabled}
      />
    </div>
  );
}

