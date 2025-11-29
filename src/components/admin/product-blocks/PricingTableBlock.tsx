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
    heading = 'Pricing Plans',
    plans = [
      { name: 'Basic', price: '$0', features: [], ctaText: 'Get Started', ctaLink: '', highlighted: false },
      { name: 'Pro', price: '$29', features: [], ctaText: 'Get Started', ctaLink: '', highlighted: true },
    ],
  } = config;

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length > 0 ? (
          plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 border-2 rounded-lg ${
                plan.highlighted
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <h4 className="text-xl font-bold mb-2">{plan.name || `Plan ${index + 1}`}</h4>
              <div className="text-3xl font-bold text-amber-600 mb-4">
                {plan.price || '$0'}
              </div>
              <ul className="space-y-2 mb-6">
                {(plan.features || []).length > 0 ? (
                  plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">✓</span>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400">No features added</li>
                )}
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
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-8">
            No pricing plans added yet
          </div>
        )}
      </div>
    </div>
  );
}

