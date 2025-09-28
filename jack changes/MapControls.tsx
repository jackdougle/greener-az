import React from 'react';
import {
    Zap,
    Leaf,
    BarChart3
} from 'lucide-react';
import { MapControlsProps, MapStyleType } from '@/types';

export default function MapControls({ mapStyle, setMapStyle }: MapControlsProps) {
    const controls: Array<{
        id: MapStyleType;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        description: string;
    }> = [
            {
                id: 'consumption',
                label: 'Consumption',
                icon: Zap,
                description: 'Electricity usage per capita'
            },
            {
                id: 'renewable',
                label: 'Renewables',
                icon: Leaf,
                description: 'Renewable energy percentage'
            },
            {
                id: 'sustainability',
                label: 'Sustainability',
                icon: BarChart3,
                description: 'Overall sustainability score'
            }
        ];

    return (
        <div className="flex items-center space-x-2 bg-popover rounded-xl p-1 border border-border">
            {controls.map((control) => (
                <button
                    key={control.id}
                    onClick={() => setMapStyle(control.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mapStyle === control.id
                        ? 'bg-card shadow-md text-foreground'
                        : 'text-foreground/80 hover:bg-popover hover:text-foreground'
                        }`}
                >
                    <control.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{control.label}</span>
                </button>
            ))}
        </div>
    );
}