
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Zap,
  Users,
  Leaf,
  TrendingDown
} from 'lucide-react';
import { StatsOverviewProps } from '@/types';

export default function StatsOverview({ data, counties }: StatsOverviewProps) {
  const formatNumber = (num: number | undefined): string => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const avgSustainabilityScore = counties?.length > 0
    ? counties.reduce((acc, county) => acc + (county.sustainability_score || 0), 0) / counties.length
    : 0;

  const avgCarbonFootprintPerCapita = counties?.length > 0
    ? counties.reduce((acc, county) => acc + (county.carbonFootprint?.perCapitaCarbonTonsPerYear || 0), 0) / counties.length
    : 0;

  const topRenewableCounty = counties?.length > 0
    ? counties.reduce((prev, current) => ((prev.renewable_percentage || 0) > (current.renewable_percentage || 0)) ? prev : current)
    : { name: '', renewable_percentage: 0, renewable_capacity_mw: 0 };

  const stats = [
    {
      title: 'Total Consumption',
      value: formatNumber(data?.total_consumption || 0) + ' MWh',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-600',
      description: 'Annual statewide usage'
    },
    {
      title: 'Population Served',
      value: formatNumber(data?.total_population || 0),
      icon: Users,
      gradient: 'from-emerald-500 to-emerald-600',
      description: 'Arizona residents'
    },
    {
      title: 'Renewable Energy',
      value: (data?.avg_renewable_percentage || 0).toFixed(1) + '%',
      icon: Leaf,
      gradient: 'from-green-500 to-green-600',
      description: 'Statewide average'
    },
    {
      title: 'Carbon Emissions',
      value: formatNumber(data?.total_emissions || 0) + ' tons',
      icon: TrendingDown,
      gradient: 'from-red-500 to-red-600',
      description: 'Annual CO₂ output'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`overflow-hidden border-0 shadow-lg bg-white/95 backdrop-blur hover-lift fade-in-up stagger-${index + 1}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 transition-smooth">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600">
                    {stat.description}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center hover-scale transition-bounce`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur hover-lift fade-in-up stagger-5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Sustainability Leader</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-emerald-600 transition-smooth">
                {topRenewableCounty.name || 'N/A'} County
              </p>
              <p className="text-sm text-slate-600">
                Leading with {(topRenewableCounty.renewable_percentage || 0).toFixed(1)}% renewable energy
              </p>
              <div className="flex items-center space-x-2 mt-3">
                <Leaf className="w-4 h-4 text-emerald-600 hover-scale transition-bounce" />
                <span className="text-xs text-slate-500">
                  {formatNumber(topRenewableCounty.renewable_capacity_mw || 0)} MW capacity
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/95 backdrop-blur hover-lift fade-in-up stagger-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">State Average</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center transition-smooth hover:bg-slate-50 -mx-2 px-2 py-1 rounded">
                <span className="text-sm text-slate-600">Sustainability Score</span>
                <span className="font-semibold">{avgSustainabilityScore.toFixed(1)}/100</span>
              </div>
              <div className="flex justify-between items-center transition-smooth hover:bg-slate-50 -mx-2 px-2 py-1 rounded">
                <span className="text-sm text-slate-600">Per Capita Usage</span>
                <span className="font-semibold">
                  {((data?.total_consumption || 0) / (data?.total_population || 1) * 1000).toFixed(1)} kWh
                </span>
              </div>
              <div className="flex justify-between items-center transition-smooth hover:bg-slate-50 -mx-2 px-2 py-1 rounded">
                <span className="text-sm text-slate-600">Counties</span>
                <span className="font-semibold">{counties?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center transition-smooth hover:bg-slate-50 -mx-2 px-2 py-1 rounded">
                <span className="text-sm text-slate-600">Carbon Footprint per Person</span>
                <span className="font-semibold">{avgCarbonFootprintPerCapita.toFixed(1)} tons CO₂/yr</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
