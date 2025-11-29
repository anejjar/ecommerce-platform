'use client';

interface BenefitsBlockProps {
  config: {
    heading?: string;
    benefits?: Array<{ icon?: string; title?: string; description?: string }>;
    layout?: 'grid' | 'list';
    columns?: 2 | 3 | 4;
  };
}

export function BenefitsBlock({ config }: BenefitsBlockProps) {
  const {
    heading = 'Benefits',
    benefits = [],
    layout = 'grid',
    columns = 2,
  } = config;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-2';

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
      {heading && (
        <h3 className="text-2xl font-bold mb-6">{heading}</h3>
      )}
      {layout === 'grid' ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {benefits.length > 0 ? (
            benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3">
                {benefit.icon && (
                  <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">{benefit.title || 'Benefit Title'}</h4>
                  <p className="text-sm text-gray-600">{benefit.description || 'Benefit description'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No benefits added yet
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {benefits.length > 0 ? (
            benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                {benefit.icon && (
                  <div className="text-2xl flex-shrink-0">{benefit.icon}</div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">{benefit.title || 'Benefit Title'}</h4>
                  <p className="text-sm text-gray-600">{benefit.description || 'Benefit description'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No benefits added yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

