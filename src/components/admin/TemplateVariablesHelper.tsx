'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ShoppingCart,
  User,
  MapPin,
  Package,
  CreditCard,
  Store,
  Calendar,
  Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Variable {
  name: string;
  description: string;
  example: string;
  category: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
}

const templateVariables: Variable[] = [
  // Order Variables
  {
    name: '{{order.number}}',
    description: 'Unique order number',
    example: 'ORD-12345',
    category: 'Order',
    type: 'string',
  },
  {
    name: '{{order.id}}',
    description: 'Order ID',
    example: 'abc123def456',
    category: 'Order',
    type: 'string',
  },
  {
    name: '{{order.status}}',
    description: 'Current order status',
    example: 'SHIPPED',
    category: 'Order',
    type: 'string',
  },
  {
    name: '{{order.subtotal}}',
    description: 'Order subtotal before tax',
    example: '$99.99',
    category: 'Order',
    type: 'number',
  },
  {
    name: '{{order.tax}}',
    description: 'Total tax amount',
    example: '$8.50',
    category: 'Order',
    type: 'number',
  },
  {
    name: '{{order.shipping}}',
    description: 'Shipping cost',
    example: '$10.00',
    category: 'Order',
    type: 'number',
  },
  {
    name: '{{order.total}}',
    description: 'Final order total',
    example: '$118.49',
    category: 'Order',
    type: 'number',
  },
  {
    name: '{{order.date}}',
    description: 'Order creation date',
    example: 'November 23, 2024',
    category: 'Order',
    type: 'date',
  },
  {
    name: '{{order.notes}}',
    description: 'Customer order notes',
    example: 'Please gift wrap',
    category: 'Order',
    type: 'string',
  },

  // Customer Variables
  {
    name: '{{customer.name}}',
    description: 'Customer full name',
    example: 'John Doe',
    category: 'Customer',
    type: 'string',
  },
  {
    name: '{{customer.email}}',
    description: 'Customer email address',
    example: 'john@example.com',
    category: 'Customer',
    type: 'string',
  },
  {
    name: '{{customer.firstName}}',
    description: 'Customer first name',
    example: 'John',
    category: 'Customer',
    type: 'string',
  },
  {
    name: '{{customer.lastName}}',
    description: 'Customer last name',
    example: 'Doe',
    category: 'Customer',
    type: 'string',
  },

  // Shipping Address Variables
  {
    name: '{{shipping.name}}',
    description: 'Shipping recipient name',
    example: 'John Doe',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.address1}}',
    description: 'Shipping address line 1',
    example: '123 Main Street',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.address2}}',
    description: 'Shipping address line 2',
    example: 'Apt 4B',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.city}}',
    description: 'Shipping city',
    example: 'New York',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.state}}',
    description: 'Shipping state/province',
    example: 'NY',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.zip}}',
    description: 'Shipping postal code',
    example: '10001',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.country}}',
    description: 'Shipping country',
    example: 'United States',
    category: 'Shipping',
    type: 'string',
  },
  {
    name: '{{shipping.phone}}',
    description: 'Shipping phone number',
    example: '+1 (555) 123-4567',
    category: 'Shipping',
    type: 'string',
  },

  // Billing Address Variables
  {
    name: '{{billing.name}}',
    description: 'Billing name',
    example: 'John Doe',
    category: 'Billing',
    type: 'string',
  },
  {
    name: '{{billing.address1}}',
    description: 'Billing address line 1',
    example: '123 Main Street',
    category: 'Billing',
    type: 'string',
  },
  {
    name: '{{billing.city}}',
    description: 'Billing city',
    example: 'New York',
    category: 'Billing',
    type: 'string',
  },

  // Store Variables
  {
    name: '{{store.name}}',
    description: 'Store name',
    example: 'My Store',
    category: 'Store',
    type: 'string',
  },
  {
    name: '{{store.email}}',
    description: 'Store contact email',
    example: 'support@store.com',
    category: 'Store',
    type: 'string',
  },
  {
    name: '{{store.phone}}',
    description: 'Store phone number',
    example: '+1 (555) 999-0000',
    category: 'Store',
    type: 'string',
  },
  {
    name: '{{store.url}}',
    description: 'Store website URL',
    example: 'https://mystore.com',
    category: 'Store',
    type: 'string',
  },
  {
    name: '{{store.logo}}',
    description: 'Store logo URL',
    example: 'https://mystore.com/logo.png',
    category: 'Store',
    type: 'string',
  },

  // Items Loop (for order items)
  {
    name: '{{#each items}}',
    description: 'Loop through order items',
    example: '{{#each items}} ... {{/each}}',
    category: 'Items',
    type: 'array',
  },
  {
    name: '{{items.name}}',
    description: 'Product name (inside loop)',
    example: 'Blue T-Shirt',
    category: 'Items',
    type: 'string',
  },
  {
    name: '{{items.sku}}',
    description: 'Product SKU (inside loop)',
    example: 'TS-BLU-M',
    category: 'Items',
    type: 'string',
  },
  {
    name: '{{items.quantity}}',
    description: 'Quantity ordered (inside loop)',
    example: '2',
    category: 'Items',
    type: 'number',
  },
  {
    name: '{{items.price}}',
    description: 'Unit price (inside loop)',
    example: '$29.99',
    category: 'Items',
    type: 'number',
  },
  {
    name: '{{items.total}}',
    description: 'Line item total (inside loop)',
    example: '$59.98',
    category: 'Items',
    type: 'number',
  },

  // Payment Variables
  {
    name: '{{payment.method}}',
    description: 'Payment method used',
    example: 'Credit Card',
    category: 'Payment',
    type: 'string',
  },
  {
    name: '{{payment.status}}',
    description: 'Payment status',
    example: 'PAID',
    category: 'Payment',
    type: 'string',
  },

  // Date/Time Helpers
  {
    name: '{{formatDate date}}',
    description: 'Format a date',
    example: 'November 23, 2024',
    category: 'Helpers',
    type: 'string',
  },
  {
    name: '{{formatCurrency amount}}',
    description: 'Format as currency',
    example: '$123.45',
    category: 'Helpers',
    type: 'string',
  },
];

const categories = [
  { name: 'All', icon: BookOpen, count: templateVariables.length },
  { name: 'Order', icon: ShoppingCart, count: templateVariables.filter(v => v.category === 'Order').length },
  { name: 'Customer', icon: User, count: templateVariables.filter(v => v.category === 'Customer').length },
  { name: 'Shipping', icon: Package, count: templateVariables.filter(v => v.category === 'Shipping').length },
  { name: 'Billing', icon: CreditCard, count: templateVariables.filter(v => v.category === 'Billing').length },
  { name: 'Items', icon: Hash, count: templateVariables.filter(v => v.category === 'Items').length },
  { name: 'Store', icon: Store, count: templateVariables.filter(v => v.category === 'Store').length },
  { name: 'Payment', icon: CreditCard, count: templateVariables.filter(v => v.category === 'Payment').length },
  { name: 'Helpers', icon: Calendar, count: templateVariables.filter(v => v.category === 'Helpers').length },
];

interface TemplateVariablesHelperProps {
  onInsert?: (variable: string) => void;
}

export function TemplateVariablesHelper({ onInsert }: TemplateVariablesHelperProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const filteredVariables = templateVariables.filter((variable) => {
    const matchesSearch =
      variable.name.toLowerCase().includes(search.toLowerCase()) ||
      variable.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || variable.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVariable(variable);
    toast.success('Variable copied to clipboard!');
    setTimeout(() => setCopiedVariable(null), 2000);

    if (onInsert) {
      onInsert(variable);
    }
  };

  const getTypeColor = (type: Variable['type']) => {
    const colors = {
      string: 'bg-blue-100 text-blue-700',
      number: 'bg-green-100 text-green-700',
      date: 'bg-purple-100 text-purple-700',
      boolean: 'bg-orange-100 text-orange-700',
      array: 'bg-pink-100 text-pink-700',
      object: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Variables Guide
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-5">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-primary" />
              Template Variables
            </SheetTitle>
            <SheetDescription className="text-base mt-2">
              Browse and insert variables into your template. Click any variable to copy it to your clipboard.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search variables by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 text-base border-2 focus-visible:ring-2"
            />
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Filter by Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.name;
                return (
                  <Button
                    key={category.name}
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 transition-all ${
                      isSelected ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                    <Badge
                      variant={isSelected ? 'secondary' : 'outline'}
                      className="ml-1 text-xs font-semibold"
                    >
                      {category.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Variables List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                {filteredVariables.length} variable{filteredVariables.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredVariables.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-8 h-8 opacity-50" />
                </div>
                <p className="font-medium mb-1">No variables found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredVariables.map((variable) => (
                  <div
                    key={variable.name}
                    className="group border-2 rounded-xl p-4 hover:border-primary hover:shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                    onClick={() => handleCopy(variable.name)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Variable Name and Type */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="font-mono text-sm font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-md">
                            {variable.name}
                          </code>
                          <Badge className={`${getTypeColor(variable.type)} font-medium`}>
                            {variable.type}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-sm leading-relaxed">
                          {variable.description}
                        </p>

                        {/* Example */}
                        <div className="flex items-start gap-2 bg-muted/50 p-2 rounded-md">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0 mt-0.5">
                            Example:
                          </span>
                          <code className="text-xs font-mono bg-background px-2 py-1 rounded border">
                            {variable.example}
                          </code>
                        </div>
                      </div>

                      {/* Copy Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(variable.name);
                        }}
                      >
                        {copiedVariable === variable.name ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
