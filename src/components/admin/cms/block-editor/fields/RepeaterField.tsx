import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ConfigForm } from '../ConfigForm';

interface RepeaterFieldProps {
    label: string;
    value: any[];
    onChange: (value: any[]) => void;
    fields: any[]; // Schema for the repeated items
    itemLabel?: string; // e.g., "Feature"
}

export const RepeaterField: React.FC<RepeaterFieldProps> = ({
    label,
    value = [],
    onChange,
    fields,
    itemLabel = 'Item'
}) => {
    const handleAdd = () => {
        // Create empty object based on fields
        const newItem: any = {};
        fields.forEach(field => {
            newItem[field.name] = field.default || '';
        });
        onChange([...value, newItem]);
    };

    const handleRemove = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    const handleChange = (index: number, itemData: any) => {
        const newValue = [...value];
        newValue[index] = itemData;
        onChange(newValue);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === value.length - 1)
        ) {
            return;
        }

        const newValue = [...value];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]];
        onChange(newValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-base font-semibold">{label}</Label>
                <Button variant="outline" size="sm" onClick={handleAdd}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add {itemLabel}
                </Button>
            </div>

            <div className="space-y-2">
                {value.map((item, index) => (
                    <RepeaterItem
                        key={index}
                        index={index}
                        data={item}
                        fields={fields}
                        label={`${itemLabel} ${index + 1}`}
                        onChange={(data) => handleChange(index, data)}
                        onRemove={() => handleRemove(index)}
                        onMoveUp={() => handleMove(index, 'up')}
                        onMoveDown={() => handleMove(index, 'down')}
                        isFirst={index === 0}
                        isLast={index === value.length - 1}
                    />
                ))}

                {value.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground bg-gray-50">
                        No items yet. Click "Add {itemLabel}" to start.
                    </div>
                )}
            </div>
        </div>
    );
};

interface RepeaterItemProps {
    index: number;
    data: any;
    fields: any[];
    label: string;
    onChange: (data: any) => void;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

const RepeaterItem: React.FC<RepeaterItemProps> = ({
    data,
    fields,
    label,
    onChange,
    onRemove,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Try to find a title field to use as the label
    const titleField = fields.find(f => f.name === 'title' || f.name === 'heading' || f.name === 'name');
    const displayLabel = titleField && data[titleField.name] ? data[titleField.name] : label;

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-md bg-white shadow-sm"
        >
            <div className="flex items-center justify-between p-2 pl-4">
                <div className="flex items-center gap-2 flex-1">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <CollapsibleTrigger className="flex-1 text-left font-medium hover:text-primary transition-colors">
                        {displayLabel}
                    </CollapsibleTrigger>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onMoveUp}
                        disabled={isFirst}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onMoveDown}
                        disabled={isLast}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            {isOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </Button>
                    </CollapsibleTrigger>
                </div>
            </div>
            <CollapsibleContent className="border-t p-4 bg-gray-50/50">
                <ConfigForm
                    schema={{ fields }}
                    data={data}
                    onChange={onChange}
                />
            </CollapsibleContent>
        </Collapsible>
    );
};
