import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapLegendProps } from '@/types';

export default function MapLegend({ mapStyle }: MapLegendProps) {
  const legends = {
    consumption: {
      title: 'Electricity Consumption (MWh per capita)',
      colors: [
        { color: '#dc2626', label: 'Very High' },
        { color: '#ea580c', label: 'High' },
        { color: '#ca8a04', label: 'Moderate' },
        { color: '#65a30d', label: 'Low' },
        { color: '#059669', label: 'Very Low' }
      ]
    },
    renewable: {
      title: 'Renewable Energy %',
      colors: [
        { color: '#dc2626', label: '0-20%' },
        { color: '#ea580c', label: '20-40%' },
        { color: '#ca8a04', label: '40-60%' },
        { color: '#65a30d', label: '60-80%' },
        { color: '#059669', label: '80-100%' }
      ]
    },
    sustainability: {
      title: 'Sustainability Score',
      colors: [
        { color: '#dc2626', label: '0-20' },
        { color: '#ea580c', label: '20-40' },
        { color: '#ca8a04', label: '40-60' },
        { color: '#65a30d', label: '60-80' },
        { color: '#059669', label: '80-100' }
      ]
    }
  };

  const currentLegend = legends[mapStyle];

  return (
  <Card className="absolute bottom-4 left-4 z-[1000] bg-card/95 backdrop-blur shadow-lg border border-border">
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-3 text-foreground">
          {currentLegend.title}
        </h4>
        <div className="space-y-2">
          {currentLegend.colors.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: item.color, borderColor: 'hsl(var(--border))' }}
              />
              <span className="text-xs text-foreground/80">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <p className="text-xs text-foreground/80">
            Circle size = Total consumption
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
