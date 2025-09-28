import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Car,
  TreePine,
  Fuel,
  Leaf,
  ExternalLink
} from 'lucide-react';
import { County } from '@/types';

interface CarbonFootprintCardProps {
  county: County;
  onShowModal: () => void;
}

export default function CarbonFootprintCard({ county, onShowModal }: CarbonFootprintCardProps) {

  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    if (num >= 100) return num.toFixed(0);
    if (num >= 10) return num.toFixed(1);
    return num.toFixed(2);
  };

  const getImpactColor = (percentage: number): string => {
    if (percentage >= 50) return 'bg-green-100 text-green-800';
    if (percentage >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  if (!county.carbonFootprint) return null;

  const { carbonFootprint } = county;

  return (
    <Card className="border-0 shadow-lg bg-white/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Calculator className="w-5 h-5 text-green-600" />
          <span>Carbon Footprint - {county.name} County</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        {/* Truly Horizontal Layout - 4 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Column 1: Key Metrics */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Annual Emissions</h4>
            <div className="space-y-1">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">
                  {carbonFootprint.perCapitaCarbonTonsPerYear.toFixed(1)}
                </div>
                <div className="text-xs text-blue-700">tons CO₂ per person</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-900">
                  {carbonFootprint.householdCarbonTonsPerYear.toFixed(1)}
                </div>
                <div className="text-xs text-purple-700">tons CO₂ per household</div>
              </div>
            </div>
          </div>

          {/* Column 2: What This Means */}
          <div className="bg-slate-50 rounded-lg p-3">
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Per Person Equivalent</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Car className="w-3 h-3 text-gray-600" />
                  <span className="text-slate-700">Driving</span>
                </div>
                <span className="font-semibold">{formatNumber(carbonFootprint.equivalentCarMilesPerYear)} mi/yr</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <TreePine className="w-3 h-3 text-green-600" />
                  <span className="text-slate-700">Trees</span>
                </div>
                <span className="font-semibold">{formatNumber(carbonFootprint.equivalentTreesNeeded)} to offset</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Fuel className="w-3 h-3 text-orange-600" />
                  <span className="text-slate-700">Gasoline</span>
                </div>
                <span className="font-semibold">{formatNumber(carbonFootprint.equivalentGasolineGallons)} gal/yr</span>
              </div>
            </div>
          </div>

          {/* Column 3: Renewable Impact */}
          <div className="bg-green-50 rounded-lg p-3">
            <h4 className="font-semibold text-green-900 mb-2 text-sm">Clean Energy Impact</h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">Emissions saved</span>
                <Badge className={`${getImpactColor(carbonFootprint.renewableImpactReduction)} text-xs px-1 py-0`}>
                  -{carbonFootprint.renewableImpactReduction.toFixed(0)}%
                </Badge>
              </div>
              <div className="text-xs text-green-800 mb-1">
                {county.renewable_percentage.toFixed(1)}% renewable grid
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-700">Clean:</span>
                <span className="font-medium">{formatNumber(carbonFootprint.renewableEmissions)} tons</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-red-700">Fossil:</span>
                <span className="font-medium">{formatNumber(carbonFootprint.nonRenewableEmissions)} tons</span>
              </div>
            </div>
          </div>

          {/* Column 4: Action Items */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Reduce Your Impact</h4>
            <ul className="text-xs text-blue-800 space-y-0.5 mb-3">
              <li>• AZ Solar Tax Credit (25%)</li>
              <li>• Utility rebate programs</li>
              <li>• Energy efficiency audits</li>
              <li>• Seasonal optimization tips</li>
            </ul>
            <Button
              size="sm"
              onClick={onShowModal}
              className="w-full text-xs py-1 h-7"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get Specific Programs & Tips
            </Button>
          </div>

        </div>

        {/* Methodology Note - Compact */}
        <div className="text-xs text-slate-500 mt-3 pt-2 border-t">
          <p>
            <strong>Note:</strong> Based on EPA emission factors, Arizona household size (2.65), and lifecycle emissions for renewables.
          </p>
        </div>
      </CardContent>

    </Card>
  );
}