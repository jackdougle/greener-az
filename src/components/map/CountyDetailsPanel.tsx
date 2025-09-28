
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
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatNumber = (num: number | undefined): string => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const getGridStressColor = (stress: string): string => {
    switch (stress) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>{county.name} County</span>
            {county.isRealTime && (
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">LIVE</span>
              </div>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Horizontal Layout - All content in columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Column 1: Key Metrics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">Key Metrics</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Population</p>
                <p className="text-lg font-bold text-slate-900">{formatNumber(county.population)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {county.isRealTime ? 'Current Usage' : 'Annual Consumption'}
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {county.isRealTime && county.currentConsumption
                    ? formatNumber(county.currentConsumption) + ' MWh/yr'
                    : formatNumber(county.consumption_mwh) + ' MWh'
                  }
                </p>
                {county.isRealTime && (
                  <p className="text-xs text-green-600">Live data</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Per Capita Usage</p>
                <p className="text-lg font-bold text-slate-900">{(county.consumption_per_capita || 0).toFixed(1)} MWh</p>
              </div>
            </div>
          </div>

          {/* Column 2: Sustainability & Energy */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">Sustainability & Energy</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sustainability Score</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${county.sustainability_score}%` }}
                    />
                  </div>
                  <Badge className={`${getSustainabilityColor(county.sustainability_score)} text-xs`}>
                    {county.sustainability_score}/100
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Renewable Energy</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-lg font-semibold text-slate-900">{county.renewable_percentage}%</span>
                </div>
                <p className="text-xs text-slate-600">({formatNumber(county.renewable_capacity_mw)} MW capacity)</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Avg. Residential Rate</p>
                <p className="text-lg font-bold text-slate-900">{county.avg_residential_rate}¢/kWh</p>
              </div>
            </div>
          </div>

          {/* Column 3: Cities & Sources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">Cities & Sources</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Major Cities</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {county.major_cities?.slice(0, 3).map((city, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Primary Energy Sources</p>
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
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <Icon className="w-3 h-3 text-slate-600" />
                        <span>{source}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Carbon Emissions</p>
                <p className="text-lg font-bold text-slate-900">{formatNumber(county.carbon_emissions_tons)} tons CO₂</p>
              </div>
            </div>
          </div>

          {/* Column 4: Status & Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 text-sm">Status & Actions</h4>
            <div className="space-y-2">

              {/* Grid Status - Real-time only */}
              {county.isRealTime && county.gridStress && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Grid Status</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <AlertTriangle className="w-3 h-3 text-slate-600" />
                    <Badge className={`${getGridStressColor(county.gridStress)} text-xs`}>
                      {county.gridStress} Demand
                    </Badge>
                  </div>
                  {county.currentRenewableGeneration && (
                    <p className="text-xs text-slate-600 mt-1">
                      {formatNumber(county.currentRenewableGeneration)} MW renewable
                    </p>
                  )}
                </div>
              )}

              {/* Carbon Footprint Summary */}
              {county.carbonFootprint && (
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Calculator className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-900">Carbon Footprint</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-green-700">Per person:</span>
                      <span className="font-semibold text-green-900 ml-1">
                        {county.carbonFootprint.perCapitaCarbonTonsPerYear.toFixed(1)} tons CO₂/yr
                      </span>
                    </div>
                    <div>
                      <span className="text-green-700">Per household:</span>
                      <span className="font-semibold text-green-900 ml-1">
                        {county.carbonFootprint.householdCarbonTonsPerYear.toFixed(1)} tons CO₂/yr
                      </span>
                    </div>
                    <div className="text-xs text-green-800 mt-1">💡 See detailed breakdown above</div>
                  </div>
                </div>
              )}

              {/* Quick Recommendations */}
              <div className="bg-blue-50 rounded-lg p-2">
                <h5 className="text-xs font-semibold text-blue-900 mb-1">Opportunities</h5>
                <ul className="text-xs text-blue-800 space-y-0.5">
                  {county.renewable_percentage < 30 && (
                    <li>• Increase solar capacity</li>
                  )}
                  {county.consumption_per_capita > 15 && (
                    <li>• Energy efficiency programs</li>
                  )}
                  {county.carbon_emissions_tons > 1000000 && (
                    <li>• Transition to renewables</li>
                  )}
                  <li>• Expand solar incentives</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
