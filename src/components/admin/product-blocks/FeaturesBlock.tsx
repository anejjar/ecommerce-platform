'use client';

interface FeaturesBlockProps {
  config: {
    heading?: string;
    features?: Array<{ icon?: string; title?: string; description?: string }>;
    layout?: 'grid' | 'list';
    columns?: 2 | 3 | 4;
  };
}

export function FeaturesBlock({ config }: FeaturesBlockProps) {
  const {
    heading = 'Features',
    features = [],
    layout = 'grid',
    columns = 3,
  } = config;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className="p-6">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {layout === 'grid' ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {features.length > 0 ? (
            features.map((feature, index) => (
              <div key={index} className="text-center">
                {feature.icon && (
                  <div className="text-4xl mb-3">{feature.icon}</div>
                )}
                <h4 className="font-semibold mb-2">{feature.title || 'Feature Title'}</h4>
                <p className="text-sm text-gray-600">{feature.description || 'Feature description'}</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No features added yet
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {features.length > 0 ? (
            features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                {feature.icon && (
                  <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">{feature.title || 'Feature Title'}</h4>
                  <p className="text-sm text-gray-600">{feature.description || 'Feature description'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No features added yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

