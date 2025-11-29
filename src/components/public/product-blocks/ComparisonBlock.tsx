'use client';

interface ComparisonBlockProps {
  config: {
    heading?: string;
    columns?: Array<{ title?: string; features?: string[] }>;
  };
}

export function ComparisonBlock({ config }: ComparisonBlockProps) {
  const {
    heading = '',
    columns = [],
  } = config;

  if (!columns || columns.length === 0) return null;

  const maxFeatures = Math.max(...columns.map(col => (col.features || []).length), 0);
  if (maxFeatures === 0) return null;

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-3 text-left bg-amber-50 font-semibold">Feature</th>
              {columns.map((col, index) => (
                <th key={index} className="border border-gray-300 p-3 text-center bg-amber-50 font-semibold">
                  {col.title || `Option ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxFeatures }).map((_, featureIndex) => (
              <tr key={featureIndex}>
                <td className="border border-gray-300 p-3 text-sm text-gray-700">
                  Feature {featureIndex + 1}
                </td>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-3 text-center text-sm">
                    {col.features?.[featureIndex] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

