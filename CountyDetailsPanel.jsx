
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
  MapPin
} from 'lucide-react';

export default function CountyDetailsPanel({ county, onClose }) {
  const getSustainabilityColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  return (
    <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>{county.name} County</span>
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
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Population
            </p>
            <p className="text-lg font-bold text-slate-900">
              {formatNumber(county.population)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Consumption
            </p>
            <p className="text-lg font-bold text-slate-900">
              {formatNumber(county.consumption_mwh)} MWh
            </p>
          </div>
        </div>

        {/* Sustainability Score */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Sustainability Score
          </p>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                style={{ width: `${county.sustainability_score}%` }}
              />
            </div>
            <Badge className={getSustainabilityColor(county.sustainability_score)}>
              {county.sustainability_score}/100
            </Badge>
          </div>
        </div>

        {/* Renewable Energy */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Renewable Energy
          </p>
          <div className="flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-lg font-semibold text-slate-900">
              {county.renewable_percentage}%
            </span>
            <span className="text-sm text-slate-600">
              ({formatNumber(county.renewable_capacity_mw)} MW capacity)
            </span>
          </div>
        </div>

        {/* Major Cities */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Major Cities
          </p>
          <div className="flex flex-wrap gap-1">
            {county.major_cities?.slice(0, 3).map((city, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {city}
              </Badge>
            ))}
          </div>
        </div>

        {/* Energy Sources */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Primary Energy Sources
          </p>
          <div className="space-y-1">
            {county.primary_sources?.slice(0, 3).map((source, index) => {
              const icons = {
                'Solar': Sun,
                'Wind': Wind,
                'Natural Gas': Factory,
                'Coal': Factory
              };
              const Icon = icons[source] || Factory;
              
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <Icon className="w-4 h-4 text-slate-600" />
                  <span>{source}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per Capita Usage */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Per Capita Usage</span>
            <span className="text-lg font-bold text-slate-900">
              {(county.consumption_per_capita || 0).toFixed(1)} MWh
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Avg. Residential Rate</span>
            <span className="text-lg font-bold text-slate-900">
              {county.avg_residential_rate}¢/kWh
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Carbon Emissions</span>
            <span className="text-lg font-bold text-slate-900">
              {formatNumber(county.carbon_emissions_tons)} tons CO₂
            </span>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Sustainability Opportunities</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {county.renewable_percentage < 30 && (
              <li>• Increase solar capacity deployment</li>
            )}
            {county.consumption_per_capita > 15 && (
              <li>• Implement energy efficiency programs</li>
            )}
            {county.carbon_emissions_tons > 1000000 && (
              <li>• Transition from coal to renewable sources</li>
            )}
            <li>• Expand residential solar incentives</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
C
