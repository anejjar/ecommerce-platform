'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQBlockProps {
  config: {
    heading?: string;
    questions?: Array<{ question?: string; answer?: string }>;
  };
}

export function FAQBlock({ config }: FAQBlockProps) {
  const {
    heading = '',
    questions = [],
  } = config;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (questions.length === 0) return null;

  return (
    <div className="my-8">
      {heading && (
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">{heading}</h3>
      )}
      <div className="space-y-4 max-w-3xl mx-auto">
        {questions.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold">{item.question || 'Question?'}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && item.answer && (
              <div className="p-4 pt-0 text-gray-600 border-t">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

