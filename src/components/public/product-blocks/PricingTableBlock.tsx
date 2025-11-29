'use client';

interface PricingTableBlockProps {
  config: {
    heading?: string;
    plans?: Array<{
      name?: string;
      price?: string;
      features?: string[];
      ctaText?: string;
      ctaLink?: string;
      highlighted?: boolean;
    }>;
  };
}

export function PricingTableBlock({ config }: PricingTableBlockProps) {
  const {
    heading = '',
    plans = [],
  } = config;

  if (!plans || plans.length === 0) return null;

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`p-6 border-2 rounded-lg ${
              plan.highlighted
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
            <div className="text-3xl font-bold text-amber-600 mb-4">
              {plan.price}
            </div>
            <ul className="space-y-2 mb-6">
              {(plan.features || []).map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">✓</span>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            {plan.ctaText && (
              <a
                href={plan.ctaLink || '#'}
                className={`block w-full text-center py-2 px-4 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {plan.ctaText}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

