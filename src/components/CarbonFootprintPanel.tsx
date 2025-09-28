import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Car,
  TreePine,
  Fuel,
  Home,
  User,
  TrendingDown,
  Calculator
} from 'lucide-react';
import { CarbonFootprintEstimate } from '@/types';

interface CarbonFootprintPanelProps {
  estimate: CarbonFootprintEstimate;
  countyName: string;
  showPersonal?: boolean;
}

export default function CarbonFootprintPanel({
  estimate,
  countyName,
  showPersonal = true
}: CarbonFootprintPanelProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    if (num >= 100) return num.toFixed(0);
    if (num >= 10) return num.toFixed(1);
    return num.toFixed(2);
  };

  const getImpactColor = (percentage: number): string => {
    if (percentage >= 50) return 'bg-green-600 text-green-50';
    if (percentage >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <Card className="border-0 shadow-lg bg-card backdrop-blur fade-in-scale hover-lift transition-smooth">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <span>Carbon Footprint Estimator</span>
          <Badge variant="outline" className="text-xs hover-scale transition-smooth">
            {countyName}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal vs Household Toggle */}
        {showPersonal && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Per Person</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Annual</span>
                  <span className="font-semibold text-foreground">
                    {estimate.perCapitaCarbonTonsPerYear.toFixed(2)} tons CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Monthly</span>
                  <span className="font-semibold text-foreground">
                    {formatNumber(estimate.perCapitaCarbonKgPerMonth)} kg CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Daily</span>
                  <span className="font-semibold text-foreground">
                    {formatNumber(estimate.perCapitaCarbonPoundsPerDay)} lbs CO₂
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Per Household</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Annual</span>
                  <span className="font-semibold text-foreground">
                    {estimate.householdCarbonTonsPerYear.toFixed(2)} tons CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Monthly</span>
                  <span className="font-semibold text-foreground">
                    {formatNumber(estimate.householdCarbonKgPerMonth)} kg CO₂
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/80">Daily</span>
                  <span className="font-semibold">
                    {formatNumber(estimate.householdCarbonPoundsPerDay)} lbs CO₂
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparative Metrics */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span>Equivalent Impact (Per Person/Year)</span>
          </h4>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-lift transition-smooth stagger-1">
              <div className="flex items-center space-x-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-foreground/80">Driving miles</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatNumber(estimate.equivalentCarMilesPerYear)} miles
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-lift transition-smooth stagger-2">
              <div className="flex items-center space-x-2">
                <TreePine className="w-4 h-4 text-green-600" />
                <span className="text-sm text-foreground/80">Trees needed to offset</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatNumber(estimate.equivalentTreesNeeded)} trees
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover-lift transition-smooth stagger-3">
              <div className="flex items-center space-x-2">
                <Fuel className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-foreground/80">Gasoline burned</span>
              </div>
              <span className="font-semibold text-foreground">
                {formatNumber(estimate.equivalentGasolineGallons)} gallons
              </span>
            </div>
          </div>
        </div>

        {/* Renewable Impact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span>Renewable Energy Impact</span>
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/80">Renewable reduction</span>
              <Badge className={getImpactColor(estimate.renewableImpactReduction)}>
                {estimate.renewableImpactReduction.toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/80">Clean energy emissions:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {formatNumber(estimate.renewableEmissions)} tons CO₂
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/80">Fossil fuel emissions:</span>
              <span className="font-medium text-red-700">
                {formatNumber(estimate.nonRenewableEmissions)} tons CO₂
              </span>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-green-500/10 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">Reduce Your Carbon Footprint</h4>
          <ul className="text-sm text-foreground/80 space-y-1">
            <li>• Install rooftop solar panels (reduce by 50-80%)</li>
            <li>• Switch to an electric vehicle</li>
            <li>• Improve home energy efficiency</li>
            <li>• Use smart thermostats and LED lighting</li>
            <li>• Support community renewable energy programs</li>
          </ul>
        </div>

        {/* Methodology Note */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p>
            <strong>Calculation:</strong> Based on EPA emission factors, EIA grid mix data,
            and average Arizona household size (2.65 people). Renewable estimates include
            lifecycle emissions for solar/wind infrastructure.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}