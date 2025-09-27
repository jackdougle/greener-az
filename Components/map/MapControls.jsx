import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Leaf, 
  BarChart3 
} from 'lucide-react';

export default function MapControls({ mapStyle, setMapStyle }) {
  const controls = [
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
    <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-1">
      {controls.map((control) => (
        <Button
          key={control.id}
          variant={mapStyle === control.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMapStyle(control.id)}
          className={`flex items-center space-x-2 transition-all duration-200 ${
            mapStyle === control.id 
              ? 'bg-white shadow-md' 
              : 'hover:bg-slate-200'
          }`}
        >
          <control.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{control.label}</span>
        </Button>
      ))}
    </div>
  );
}
