'use client';

import React, { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
}

interface ProductTabsConfig {
  productId: string;
  tabsToShow?: string[];
  defaultTab?: string;
  tabStyle?: 'underline' | 'pills' | 'buttons';
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  maxWidth?: string;
}

interface ProductTabsProps {
  config: ProductTabsConfig;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ config }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  const {
    productId,
    tabsToShow = ['description', 'specs', 'reviews', 'shipping'],
    defaultTab = 'description',
    tabStyle = 'underline',
    paddingTop = '40px',
    paddingBottom = '40px',
    backgroundColor = '#ffffff',
    maxWidth = '800px',
  } = config;

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?ids=${productId}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const tabStyles = {
    underline: 'border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500',
    pills: 'rounded-full px-4 py-2 bg-gray-100 hover:bg-gray-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white',
    buttons: 'border rounded-lg px-4 py-2 hover:bg-gray-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-blue-500',
  };

  const tabLabels: Record<string, string> = {
    description: 'Description',
    specs: 'Specifications',
    reviews: 'Reviews',
    shipping: 'Shipping & Returns',
  };

  if (loading) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        style={{
          paddingTop,
          paddingBottom,
          backgroundColor,
        }}
        className="container mx-auto px-4"
      >
        <p className="text-center text-gray-500">Product not found.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
          />
        );
      case 'specs':
        return <p className="text-gray-600">Specifications coming soon...</p>;
      case 'reviews':
        return <p className="text-gray-600">Reviews coming soon...</p>;
      case 'shipping':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Shipping</h4>
              <p className="text-gray-600">Standard shipping: 5-7 business days</p>
              <p className="text-gray-600">Express shipping: 2-3 business days</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Returns</h4>
              <p className="text-gray-600">30-day return policy. Items must be unused and in original packaging.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        paddingTop,
        paddingBottom,
        backgroundColor,
      }}
      className="w-full"
    >
      <div className="container mx-auto px-4" style={{ maxWidth }}>
        <div className="border-b mb-6">
          <div className={`flex gap-4 ${tabStyle === 'pills' ? 'flex-wrap' : ''}`}>
            {tabsToShow.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? tabStyle === 'underline'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : tabStyle === 'pills'
                      ? 'bg-blue-500 text-white rounded-full'
                      : 'bg-blue-500 text-white border-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                } ${tabStyles[tabStyle]}`}
              >
                {tabLabels[tab] || tab}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[200px]">{renderTabContent()}</div>
      </div>
    </div>
  );
};

