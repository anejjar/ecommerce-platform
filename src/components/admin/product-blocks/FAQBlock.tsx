'use client';

interface FAQBlockProps {
  config: {
    heading?: string;
    questions?: Array<{ question?: string; answer?: string }>;
  };
}

export function FAQBlock({ config }: FAQBlockProps) {
  const {
    heading = 'Frequently Asked Questions',
    questions = [],
  } = config;

  return (
    <div className="p-6">
      {heading && (
        <h3 className="text-2xl font-bold mb-6 text-center">{heading}</h3>
      )}
      {questions.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {questions.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">{item.question || 'Question?'}</h4>
              <p className="text-gray-600 text-sm">{item.answer || 'Answer...'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12 border-2 border-dashed rounded-lg">
          No questions added yet
        </div>
      )}
    </div>
  );
}

