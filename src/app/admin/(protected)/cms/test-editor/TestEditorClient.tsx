'use client';

import React, { useState } from 'react';
import { ConfigForm } from '@/components/admin/cms/block-editor/ConfigForm';
import { BlockPreview } from '@/components/admin/cms/block-editor/BlockPreview';
import { Card } from '@/components/ui/card';

// Mock schema for testing
const mockSchema = {
    fields: [
        { name: 'heading', type: 'text', label: 'Main Heading', required: true, placeholder: 'Enter heading...' },
        { name: 'subheading', type: 'textarea', label: 'Subheading', rows: 2 },
        { name: 'heroImage', type: 'image', label: 'Hero Image', recommended: '1920x1080px' },
        { name: 'overlayColor', type: 'color', label: 'Overlay Color' },
        { name: 'overlayOpacity', type: 'slider', label: 'Overlay Opacity', min: 0, max: 1, step: 0.1 },
        {
            name: 'alignment',
            type: 'select',
            label: 'Text Alignment',
            options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' }
            ]
        },
        { name: 'showButton', type: 'checkbox', label: 'Show CTA Button' },
        {
            name: 'features',
            type: 'repeater',
            label: 'Features List',
            itemLabel: 'Feature',
            fields: [
                { name: 'title', type: 'text', label: 'Title' },
                { name: 'icon', type: 'text', label: 'Icon' },
                { name: 'description', type: 'textarea', label: 'Description' }
            ]
        }
    ]
};

const mockTemplate = {
    name: 'Hero Section',
    category: 'HERO',
    componentCode: '...'
};

export default function TestEditorPage() {
    const [config, setConfig] = useState({
        heading: 'Welcome to our site',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
        alignment: 'center',
        showButton: true,
        features: [
            { title: 'Fast', icon: '⚡', description: 'Lightning fast performance' }
        ]
    });

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Block Editor Component Test</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Configuration Form</h2>
                        <ConfigForm
                            schema={mockSchema}
                            data={config}
                            onChange={setConfig}
                        />
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="sticky top-8">
                        <BlockPreview
                            template={mockTemplate}
                            config={config}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
