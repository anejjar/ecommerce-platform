'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Check, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckoutSettings } from '@/types/checkout-settings';
import toast from 'react-hot-toast';

interface WhatsAppOrderButtonProps {
  cartItems: any[];
  formData: any;
  total: number;
  position: 'primary' | 'secondary';
  settings: CheckoutSettings | null;
  disabled?: boolean;
}

export function WhatsAppOrderButton({
  cartItems,
  formData,
  total,
  position,
  settings,
  disabled = false,
}: WhatsAppOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderReference, setOrderReference] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const handleWhatsAppOrder = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.phone) {
      toast.error('Please enter your phone number for WhatsApp orders');
      return;
    }

    if (!formData.address || !formData.city) {
      toast.error('Please enter your complete address');
      return;
    }

    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // Create order via API
      const response = await fetch('/api/checkout/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          formData,
          total,
          checkoutSettings: settings,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create WhatsApp order');
      }

      const data = await response.json();

      setOrderReference(data.orderReference);
      setWhatsappUrl(data.whatsappUrl);
      setShowConfirmation(true);

      // Open WhatsApp in new tab
      window.open(data.whatsappUrl, '_blank');
    } catch (error: any) {
      console.error('WhatsApp order error:', error);
      toast.error(error.message || 'Failed to create WhatsApp order');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = settings?.whatsAppButtonText || 'Order via WhatsApp';

  return (
    <>
      <Button
        type="button"
        onClick={handleWhatsAppOrder}
        disabled={disabled || isLoading}
        variant={position === 'primary' ? 'default' : 'outline'}
        size="lg"
        className={position === 'primary' ? 'w-full' : 'w-full mt-3'}
        style={
          position === 'primary' && settings?.primaryColor
            ? {
                backgroundColor: settings.primaryColor,
              }
            : {}
        }
      >
        {isLoading ? (
          <>
            <MessageCircle className="mr-2 h-5 w-5 animate-pulse" />
            Creating order...
          </>
        ) : (
          <>
            <MessageCircle className="mr-2 h-5 w-5" />
            {buttonText}
          </>
        )}
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-600" />
              Order Created Successfully!
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p>
                Your order <strong className="text-primary">{orderReference}</strong> has been
                created.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>Next step:</strong> Complete your order by sending the pre-filled
                  message via WhatsApp.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                If WhatsApp didn't open automatically, click the button below:
              </p>

              <Button
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full"
                variant="default"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open WhatsApp
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-4">
                <p>Order Reference: {orderReference}</p>
                <p className="mt-1">
                  A confirmation email has been sent to {formData.email}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
