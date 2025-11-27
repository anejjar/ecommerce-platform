import React from 'react';
import { Card } from '@/components/ui/card';

interface BlockPreviewProps {
    template: {
        name: string;
        category: string;
        componentCode: string;
    };
    config: any;
}

export const BlockPreview: React.FC<BlockPreviewProps> = ({
    template,
    config
}) => {
    // In a real implementation, this would dynamically render the component based on componentCode
    // or map to a pre-built component library.
    // For now, we'll show a JSON preview of the config to verify updates.

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Preview: {template.name}</h3>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
                    {template.category}
                </span>
            </div>

            <Card className="p-6 min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-dashed">
                <div className="text-center space-y-4 max-w-lg w-full">
                    <p className="text-muted-foreground">
                        Visual preview will be implemented in Phase 3.
                        <br />
                        Current Configuration:
                    </p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-left text-xs overflow-auto max-h-[300px] w-full">
                        {JSON.stringify(config, null, 2)}
                    </pre>
                </div>
            </Card>
        </div>
    );
};
