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
    heading = '',
    stats = [],
    layout = 'grid',
    columns = 4,
  } = config;

  if (!stats || stats.length === 0) return null;

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns] || 'md:grid-cols-4';

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {layout === 'grid' ? (
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {stat.icon && (
                <div className="text-3xl mb-2">{stat.icon}</div>
              )}
              <div className="text-3xl font-bold text-amber-600 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4">
              {stat.icon && (
                <div className="text-2xl flex-shrink-0">{stat.icon}</div>
              )}
              <div className="flex-1">
                <div className="text-2xl font-bold text-amber-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

