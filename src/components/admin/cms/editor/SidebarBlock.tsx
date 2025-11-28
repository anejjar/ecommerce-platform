import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Type, Image as ImageIcon, Layout, Box, Sparkles, Users, DollarSign, MessageSquare, HelpCircle, Grid3x3, Video, FileText, Megaphone, Navigation, Menu, Share2, Minus, ArrowRight } from 'lucide-react';

interface SidebarBlockProps {
    template: any;
    onAdd: () => void;
}

const getIconForCategory = (category: string) => {
    const cat = category.toLowerCase().replace('_', '');
    switch (cat) {
        case 'hero':
            return Sparkles;
        case 'content':
        case 'text':
            return FileText;
        case 'features':
            return Grid3x3;
        case 'cta':
        case 'calltoaction':
            return Megaphone;
        case 'testimonials':
            return MessageSquare;
        case 'pricing':
            return DollarSign;
        case 'team':
            return Users;
        case 'faq':
            return HelpCircle;
        case 'gallery':
        case 'media':
            return ImageIcon;
        case 'video':
            return Video;
        case 'form':
            return FileText;
        case 'logo':
        case 'logogrid':
            return Grid3x3;
        case 'stats':
            return Grid3x3;
        case 'layout':
            return Layout;
        case 'navigation':
            return Navigation;
        case 'header':
            return Menu;
        case 'footer':
            return Layout;
        case 'social':
            return Share2;
        case 'breadcrumbs':
            return ArrowRight;
        case 'divider':
            return Minus;
        case 'spacer':
            return Box;
        default:
            return Box;
    }
};

const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase().replace('_', '');
    switch (cat) {
        case 'hero':
            return 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600';
        case 'features':
            return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600';
        case 'cta':
        case 'calltoaction':
            return 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600';
        case 'testimonials':
            return 'bg-gradient-to-br from-green-50 to-green-100 text-green-600';
        case 'pricing':
            return 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-600';
        case 'team':
            return 'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600';
        case 'faq':
            return 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600';
        case 'form':
            return 'bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600';
        case 'navigation':
            return 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600';
        case 'header':
            return 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600';
        case 'footer':
            return 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600';
        case 'social':
            return 'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600';
        case 'breadcrumbs':
            return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600';
        case 'divider':
            return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600';
        case 'spacer':
            return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600';
        default:
            return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600';
    }
};

export const SidebarBlock: React.FC<SidebarBlockProps> = ({ template, onAdd }) => {
    const Icon = getIconForCategory(template.category);
    const colorClass = getCategoryColor(template.category);

    return (
        <div
            className="group relative flex flex-col items-center justify-center p-3 rounded-lg border-2 bg-white hover:border-primary hover:shadow-lg transition-all cursor-pointer h-28 text-center gap-2 overflow-hidden"
            onClick={onAdd}
        >
            {/* Background gradient on hover */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                colorClass
            )} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center gap-2 w-full">
                <div className={cn(
                    "p-2.5 rounded-lg transition-all duration-200",
                    colorClass,
                    "group-hover:scale-110 group-hover:shadow-md"
                )}>
                    <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 line-clamp-2 leading-tight px-1">
                    {template.name}
                </span>
            </div>

            {/* Add button */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                <div className="bg-primary text-white rounded-full p-1.5 shadow-lg">
                    <Plus className="h-3.5 w-3.5" />
                </div>
            </div>
        </div>
    );
};
