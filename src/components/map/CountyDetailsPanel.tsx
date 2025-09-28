
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Zap,
  Users,
  Leaf,
  TrendingUp,
  TrendingDown,
  Sun,
  Wind,
  Factory,
  MapPin,
  Activity,
  AlertTriangle,
  Calculator,
  Car,
  TreePine,
  Home
} from 'lucide-react';
import { CountyDetailsPanelProps } from '@/types';

export default function CountyDetailsPanel({ county, onClose }: CountyDetailsPanelProps) {
  const getSustainabilityColor = (score: number): string => {
    if (score >= 80) return 'bg-green-600 text-green-50';
    if (score >= 60) return 'bg-yellow-500 text-foreground';
    return 'bg-red-500 text-foreground';
  };

  const formatNumber = (num: number | undefined): string => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const getGridStressColor = (stress: string): string => {
    switch (stress) {
      case 'High': return 'bg-destructive text-destructive-foreground';
      case 'Moderate': return 'bg-yellow-500 text-foreground';
      case 'Low': return 'bg-accent text-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-card backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="transition-smooth">{county.name} County</span>
            {county.isRealTime && (
              <div className="flex items-center space-x-1 fade-in">
                <Activity className="w-4 h-4 text-green-600 pulse-soft" />
                <span className="text-xs text-green-600 font-medium">LIVE</span>
              </div>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:rotate-90 transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Horizontal Layout - All content in columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Column 1: Key Metrics */}
          <div className="space-y-3 fade-in-up stagger-1">
            <h4 className="font-semibold text-foreground text-sm">Key Metrics</h4>
            <div className="space-y-2">
              <div className="transition-smooth hover:bg-muted -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Population</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(county.population)}</p>
              </div>
              <div className="transition-smooth hover:bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
                  {county.isRealTime ? 'Current Usage' : 'Annual Consumption'}
                </p>
                <p className="text-lg font-bold text-foreground">
                  {county.isRealTime && county.currentConsumption
                    ? formatNumber(county.currentConsumption) + ' MWh/yr'
                    : formatNumber(county.consumption_mwh) + ' MWh'
                  }
                </p>
                {county.isRealTime && (
                  <div className="flex flex-row">
                    <AlertTriangle className="h-3 w-3 mr-1 translate-y-0.5 text-green-600"/>
                    <p className="text-xs text-green-600 pulse-soft">Live data</p>
                  </div>
                  
                )}
              </div>
              <div className="transition-smooth hover:bg-amber-50 -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Per Capita Usage</p>
                <p className="text-lg font-bold text-foreground">{(county.consumption_per_capita || 0).toFixed(1)} MWh</p>
              </div>
            </div>
          </div>

          {/* Column 2: Sustainability & Energy */}
          <div className="space-y-3 fade-in-up stagger-2">
            <h4 className="font-semibold text-foreground text-sm">Sustainability & Energy</h4>
            <div className="space-y-2">
              <div className="transition-smooth hover:bg-emerald-50 -mx-2 px-2 py-2 rounded-lg pr-8">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Sustainability Score</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-2 hover-glow transition-smooth">
                    <div
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${county.sustainability_score}%` }}
                    />
                  </div>
                  <Badge className={`${getSustainabilityColor(county.sustainability_score)} text-xs transition-bounce`}>
                    {county.sustainability_score}/100
                  </Badge>
                </div>
              </div>
              <div className="transition-smooth hover:bg-green-50 -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Renewable Energy</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Leaf className="w-4 h-4 text-green-600 hover-scale transition-bounce" />
                  <span className="text-lg font-semibold text-foreground">{county.renewable_percentage}%</span>
                </div>
                <p className="text-xs text-foreground/80">({formatNumber(county.renewable_capacity_mw)} MW capacity)</p>
              </div>
              <div className="transition-smooth hover:bg-yellow-50 -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Avg. Residential Rate</p>
                <p className="text-lg font-bold text-foreground">{county.avg_residential_rate}¢/kWh</p>
              </div>
            </div>
          </div>

          {/* Column 3: Cities & Sources */}
          <div className="space-y-3 fade-in-up stagger-3">
            <h4 className="font-semibold text-foreground text-sm">Cities & Sources</h4>
            <div className="space-y-2">
              <div className="transition-smooth hover:bg-muted -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Major Cities</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {county.major_cities?.slice(0, 3).map((city, index) => (
                    <Badge key={index} variant="outline" className={`text-xs hover-scale transition-bounce fade-in stagger-${index + 1}`}>
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="transition-smooth hover:bg-orange-50 -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Primary Energy Sources</p>
                <div className="space-y-1 mt-1">
                  {county.primary_sources?.slice(0, 3).map((source, index) => {
                    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
                      'Solar': Sun,
                      'Wind': Wind,
                      'Natural Gas': Factory,
                      'Coal': Factory
                    };
                    const Icon = icons[source] || Factory;

                    return (
                      <div key={index} className={`flex items-center space-x-2 text-xs transition-smooth hover:scale-105 fade-in stagger-${index + 1}`}>
                        <Icon className="w-3 h-3 text-foreground/60" />
                        <span>{source}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="transition-smooth hover:bg-muted -mx-2 px-2 py-2 rounded-lg">
                <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">Carbon Emissions</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(county.carbon_emissions_tons)} tons CO₂</p>
              </div>
            </div>
          </div>

          {/* Column 4: Status & Actions */}
          <div className="space-y-3 fade-in-up stagger-4">
            <h4 className="font-semibold text-foreground text-sm">Status & Actions</h4>
            <div className="space-y-2">

              {/* Carbon Footprint Summary */}
              {county.carbonFootprint && (
                <div className="rounded-lg p-2 transition-smooth fade-in stagger-1" style={{ backgroundColor: 'hsl(var(--opportunities-bg))', border: '1px solid hsl(var(--opportunities-border))' }}>
                  <div className="flex items-center space-x-1 mb-1">
                    <Calculator className="w-3 h-3 text-green-600 hover-scale transition-bounce" />
                    <span className="text-xs font-medium text-foreground">Carbon Footprint</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">
                      <span className="text-green-600 dark:text-green-400">Per person:</span>
                      <span className="font-semibold text-foreground ml-1">
                        {county.carbonFootprint.perCapitaCarbonTonsPerYear.toFixed(1)} tons CO₂/yr
                      </span>
                    </div>
                    <div className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">
                      <span className="text-green-600 dark:text-green-400">Per household:</span>
                      <span className="font-semibold text-foreground ml-1">
                        {county.carbonFootprint.householdCarbonTonsPerYear.toFixed(1)} tons CO₂/yr
                      </span>
                    </div>
                    <div className="text-xs text-foreground/80 mt-1">💡 See detailed breakdown above</div>
                  </div>
                </div>
              )}

              {/* Quick Recommendations */}
              <div className="rounded-lg p-2" style={{ backgroundColor: 'hsl(var(--opportunities-bg))', border: '1px solid hsl(var(--opportunities-border))' }}>
                <div className="flex items-center space-x-1 mb-1">
                  <Zap className="w-3 h-3 text-green-600 hover-scale transition-bounce -translate-y-0.5" />
                  <h5 className="text-xs font-semibold text-foreground mb-1">Opportunities</h5>
                </div>
                <ul className="text-xs text-foreground/80 space-y-0.5">
                  {county.renewable_percentage < 30 && (
                    <li className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">• Increase solar capacity</li>
                  )}
                  {county.consumption_per_capita > 15 && (
                    <li className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">• Energy efficiency programs</li>
                  )}
                  {county.carbon_emissions_tons > 1000000 && (
                    <li className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">• Transition to renewables</li>
                  )}
                  <li className="transition-smooth hover:bg-muted -mx-1 px-1 py-0.5 rounded">• Expand solar incentives</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
