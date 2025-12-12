'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionConfig {
  items?: AccordionItem[];
  titleColor?: string;
  contentColor?: string;
  borderColor?: string;
}

interface AccordionWidgetProps {
  config: AccordionConfig;
}

export const AccordionWidget: React.FC<AccordionWidgetProps> = ({ config }) => {
  const {
    items = [],
    titleColor = '#000000',
    contentColor = '#666666',
    borderColor = '#e0e0e0',
  } = config;

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No accordion items configured
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          style={{ borderColor }}
        >
          <AccordionTrigger style={{ color: titleColor }}>
            {item.title}
          </AccordionTrigger>
          <AccordionContent style={{ color: contentColor }}>
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
