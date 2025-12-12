'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tab {
  title: string;
  content: string;
}

interface TabsConfig {
  tabs?: Tab[];
  activeTabColor?: string;
  tabTextColor?: string;
}

interface TabsWidgetProps {
  config: TabsConfig;
}

export const TabsWidget: React.FC<TabsWidgetProps> = ({ config }) => {
  const {
    tabs = [],
    activeTabColor = '#0066ff',
    tabTextColor = '#333333',
  } = config;

  if (!tabs || tabs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No tabs configured
      </div>
    );
  }

  return (
    <Tabs defaultValue="tab-0" className="w-full">
      <TabsList style={{ borderBottomColor: activeTabColor }}>
        {tabs.map((tab, index) => (
          <TabsTrigger
            key={index}
            value={`tab-${index}`}
            style={{ color: tabTextColor }}
            className="data-[state=active]:border-b-2"
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, index) => (
        <TabsContent key={index} value={`tab-${index}`}>
          <div className="p-4">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
