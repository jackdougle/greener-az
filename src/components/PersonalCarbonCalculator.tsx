import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  Zap,
  Home,
  Car,
  TreePine,
  Leaf,
  TrendingDown
} from 'lucide-react';
import { CarbonFootprintService } from '@/services/CarbonFootprintService';
import { CarbonFootprintEstimate } from '@/types';

export default function PersonalCarbonCalculator() {
  const [monthlyUsage, setMonthlyUsage] = useState<string>('1000');
  const [renewablePercentage, setRenewablePercentage] = useState<string>('20');
  const [result, setResult] = useState<CarbonFootprintEstimate | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    const usage = parseFloat(monthlyUsage);
    const renewable = parseFloat(renewablePercentage);

    if (isNaN(usage) || isNaN(renewable) || usage <= 0 || renewable < 0 || renewable > 100) {
      alert('Please enter valid values');
      return;
    }

    const estimate = CarbonFootprintService.calculatePersonalFootprint(usage, renewable);
    setResult(estimate);
    setShowResults(true);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    if (num >= 100) return num.toFixed(0);
    if (num >= 10) return num.toFixed(1);
    return num.toFixed(2);
  };

  return (
    <Card className="border-0 shadow-lg bg-card backdrop-blur max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <span>Personal Carbon Footprint Calculator</span>
        </CardTitle>
        <p className="text-sm text-foreground/80">
          Calculate your household's carbon footprint from electricity usage
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Monthly Electricity Usage (kWh)</span>
            </label>
            <input
              type="number"
              value={monthlyUsage}
              onChange={(e) => setMonthlyUsage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="1000"
              min="0"
            />
            <p className="text-xs text-foreground/60">
              Average US household: ~900 kWh/month
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span>Renewable Energy Percentage (%)</span>
            </label>
            <input
              type="number"
              value={renewablePercentage}
              onChange={(e) => setRenewablePercentage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="20"
              min="0"
              max="100"
            />
            <p className="text-xs text-foreground/60">
              Arizona grid average: ~20%, Your utility may vary
            </p>
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate Carbon Footprint
        </Button>

        {/* Results */}
        {showResults && result && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>Your Carbon Footprint</span>
            </h3>

            {/* Annual Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg p-4" style={{ backgroundColor: 'hsl(var(--reduce-impact-bg))', border: '1px solid hsl(var(--reduce-impact-border))' }}>
                <div className="flex items-center space-x-2 mb-2">
                  <Home className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Household Total</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {result.householdCarbonTonsPerYear.toFixed(1)} tons CO₂/year
                </div>
                <div className="text-sm text-foreground/80">
                  {(result.householdCarbonKgPerMonth).toFixed(0)} kg CO₂/month
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">P</span>
                  <span className="font-semibold text-purple-900">Per Person</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {result.perCapitaCarbonTonsPerYear.toFixed(1)} tons CO₂/year
                </div>
                <div className="text-sm text-purple-700">
                  {(result.perCapitaCarbonKgPerMonth).toFixed(0)} kg CO₂/month
                </div>
              </div>
            </div>

            {/* Comparative Metrics */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">What This Means (Per Person)</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-slate-700">Equivalent to driving</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(result.equivalentCarMilesPerYear)} miles/year
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-slate-700">Trees needed to offset</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {formatNumber(result.equivalentTreesNeeded)} trees
                  </span>
                </div>
              </div>
            </div>

            {/* Renewable Impact */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Renewable Energy Impact</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 dark:text-green-400">Emissions reduction from renewables</span>
                <Badge className="bg-green-600 text-green-50">
                  -{result.renewableImpactReduction.toFixed(1)}%
                </Badge>
              </div>
              <p className="text-sm text-foreground/80">
                Switching to 100% renewable energy could reduce your footprint by{' '}
                {(100 - result.renewableImpactReduction).toFixed(1)}% more!
              </p>
            </div>

            {/* Action Items */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">Reduce Your Impact</h4>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li>• Install rooftop solar panels (reduce by 50-80%)</li>
                <li>• Switch to energy-efficient appliances</li>
                <li>• Use LED lighting and smart thermostats</li>
                <li>• Choose renewable energy plans from your utility</li>
                <li>• Improve home insulation and weatherization</li>
              </ul>
            </div>

            {/* Comparison */}
            <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
              <strong>Context:</strong> The average American household produces about 7.5 tons CO₂/year from electricity.
              Arizona's grid mix is {renewablePercentage}% renewable in your calculation.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}