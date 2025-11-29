'use client';

interface ComparisonBlockProps {
  config: {
    heading?: string;
    columns?: Array<{ title?: string; features?: string[] }>;
  };
}

export function ComparisonBlock({ config }: ComparisonBlockProps) {
  const {
    heading = 'Comparison',
    columns = [
      { title: 'Option 1', features: [] },
      { title: 'Option 2', features: [] },
    ],
  } = config;

  const maxFeatures = Math.max(...columns.map(col => (col.features || []).length), 0);

  return (
    <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-3 text-left bg-gray-50">Feature</th>
              {columns.map((col, index) => (
                <th key={index} className="border p-3 text-center bg-gray-50">
                  {col.title || `Option ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {maxFeatures > 0 ? (
              Array.from({ length: maxFeatures }).map((_, featureIndex) => (
                <tr key={featureIndex}>
                  <td className="border p-3 text-sm text-gray-600">
                    Feature {featureIndex + 1}
                  </td>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="border p-3 text-center">
                      {col.features?.[featureIndex] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="border p-8 text-center text-gray-400">
                  No features added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

