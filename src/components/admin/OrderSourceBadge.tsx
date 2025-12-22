import { Badge } from '@/components/ui/badge';
import { Globe, MessageCircle, Store, User } from 'lucide-react';
import { OrderSource } from '@/types/checkout';

interface OrderSourceBadgeProps {
  source: OrderSource | string;
  className?: string;
}

export function OrderSourceBadge({ source, className = '' }: OrderSourceBadgeProps) {
  const config = {
    WEBSITE: {
      icon: Globe,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      label: 'Website',
    },
    WHATSAPP: {
      icon: MessageCircle,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
      label: 'WhatsApp',
    },
    POS: {
      icon: Store,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      label: 'POS',
    },
    ADMIN: {
      icon: User,
      color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      label: 'Admin',
    },
  };

  const sourceConfig = config[source as keyof typeof config] || config.WEBSITE;
  const Icon = sourceConfig.icon;

  return (
    <Badge
      variant="secondary"
      className={`${sourceConfig.color} ${className}`}
    >
      <Icon className="h-3 w-3 mr-1" />
      {sourceConfig.label}
    </Badge>
  );
}
