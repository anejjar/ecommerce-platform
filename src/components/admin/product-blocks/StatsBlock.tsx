'use client';

interface StatsBlockProps {
  config: {
    heading?: string;
    stats?: Array<{ value?: string; label?: string; icon?: string }>;
    layout?: 'grid' | 'list';
    columns?: 2 | 3 | 4;
  };
}

export function StatsBlock({ config }: StatsBlockProps) {
  const {
    heading = 'Statistics',
    stats = [],
    layout = 'grid',
    columns = 4,
  } = config;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-4';

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {layout === 'grid' ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="text-center">
                {stat.icon && (
                  <div className="text-3xl mb-2">{stat.icon}</div>
                )}
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {stat.value || '0'}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label || 'Label'}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No statistics added yet
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                {stat.icon && (
                  <div className="text-2xl flex-shrink-0">{stat.icon}</div>
                )}
                <div className="flex-1">
                  <div className="text-2xl font-bold text-amber-600">
                    {stat.value || '0'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label || 'Label'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No statistics added yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

