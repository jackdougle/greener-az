import React, { useState, useEffect } from 'react';
import { CardHeader, CardTitle, CardContent, Card } from './ui/card';
import { Clock, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { County } from '@/types';
import { historicalDataService, HistoricalData } from '@/services/HistoricalDataService';

interface TimeDataProps {
  selectedCounty: County | null;
}

interface HistoricalDataPoint {
  date: string;
  consumption_mwh: number;
  renewable_percentage: number;
}

export default function TimeData({ selectedCounty }: TimeDataProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch historical data when county changes
  useEffect(() => {
    if (selectedCounty) {
      setLoading(true);
      setError(null);
      
      historicalDataService.getCountyHistoricalData(selectedCounty.name)
        .then((data) => {
          setHistoricalData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching historical data:', err);
          setError('Failed to load historical data');
          setLoading(false);
        });
    } else {
      setHistoricalData(null);
    }
  }, [selectedCounty]);

  const monthlyData = historicalData?.monthlyData || [];
  const yearlyData = historicalData?.yearlyData || [];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const createSVGChart = (data: HistoricalDataPoint[], type: 'monthly' | 'yearly', width: number = 600, height: number = 280) => {
    if (data.length === 0) return null;

    const maxConsumption = Math.max(...data.map(d => d.consumption_mwh));
    const minConsumption = Math.min(...data.map(d => d.consumption_mwh));
    const range = maxConsumption - minConsumption;
    
    // Increased padding for better spacing
    const leftPadding = 80;
    const rightPadding = 30;
    const topPadding = 40;
    const bottomPadding = 60;
    
    const chartWidth = width - leftPadding - rightPadding;
    const chartHeight = height - topPadding - bottomPadding;

    const points = data.map((point, index) => {
      const x = leftPadding + (index / (data.length - 1)) * chartWidth;
      const y = topPadding + ((point.consumption_mwh - minConsumption) / range) * chartHeight;
      return { x, y, ...point };
    });

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Grid lines */}
        <defs>
          <pattern id={`grid-${type}`} width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.2"/>
          </pattern>
        </defs>
        
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <line
            key={index}
            x1={leftPadding}
            y1={topPadding + chartHeight - (ratio * chartHeight)}
            x2={leftPadding + chartWidth}
            y2={topPadding + chartHeight - (ratio * chartHeight)}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        
        {/* Vertical grid lines */}
        {points.map((point, index) => (
          index % Math.ceil(data.length / 8) === 0 && (
            <line
              key={index}
              x1={point.x}
              y1={topPadding}
              x2={point.x}
              y2={topPadding + chartHeight}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          )
        ))}
        
        {/* Chart line with gradient */}
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(313 77.3% 50.2%)" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="hsl(313 77.3% 60.2%)" stopOpacity="0.3"/>
          </linearGradient>
        </defs>
        
        {/* Area under the curve */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${topPadding + chartHeight} L ${points[0].x} ${topPadding + chartHeight} Z`}
          fill={`url(#gradient-${type})`}
        />
        
        {/* Chart line */}
        <path
          d={pathData}
          fill="none"
          stroke="hsl(313 77.3% 50.2%)"
          strokeWidth="3"
          className="drop-shadow-sm"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="hsl(313 77.3% 40.2%)"
              stroke="hsl(var(--background))"
              strokeWidth="2"
              className="hover:r-7 transition-all duration-200 cursor-pointer"
            />
            <title>{`${point.date}: ${formatNumber(point.consumption_mwh)} MWh`}</title>
          </g>
        ))}
        
        {/* X-axis labels */}
        {points.map((point, index) => (
          index % Math.ceil(data.length / 8) === 0 && (
            <text
              key={index}
              x={point.x + 13}
              y={height - 45}
              textAnchor="middle"
              className="text-xs fill-foreground font-bold"
              fontSize="12"
              fontWeight="bold"
            >
              {type === 'monthly' ? point.date.split(' ')[0] : point.date}
            </text>
          )
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <text
            key={index}
            x={leftPadding - 7}
            y={topPadding + chartHeight - (ratio * chartHeight)}
            textAnchor="end"
            className="text-xs fill-foreground font-bold"
            fontSize="12"
            fontWeight="bold"
          >
            {formatNumber(minConsumption + ratio * range)}
          </text>
        ))}
        
        {/* Y-axis title */}
        <text
          x={30}
          y={height / 2 - 5}
          textAnchor="middle"
          transform={`rotate(-90, 25, ${height / 2})`}
          className="text-sm fill-foreground font-bold"
          fontSize="14"
          fontWeight="bold"
        >
          Megawatt Hours (MWh)
        </text>
        
        {/* X-axis title */}
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          className="text-sm fill-foreground font-bold"
          fontSize="14"
          fontWeight="bold"
        >
          {type === 'monthly' ? 'Time (Months)' : 'Time (Years)'}
        </text>
      </svg>
    );
  };

  if (!selectedCounty) {
    return (
      <Card className="mt-6 shadow-lg bg-card backdrop-blur border border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Energy Usage Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-foreground/60">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a county on the map to view historical energy usage data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mt-6 shadow-lg bg-card backdrop-blur border border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Energy Usage Over Time - {selectedCounty?.name} County</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-foreground/70">Loading historical data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6 shadow-lg bg-card backdrop-blur border border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Energy Usage Over Time - {selectedCounty?.name} County</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-foreground/60 mb-2">⚠️ {error}</div>
              <div className="text-sm text-foreground/50">Using fallback data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-lg bg-card backdrop-blur border border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Energy Usage Over Time - {selectedCounty?.name} County</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 12 Month Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span>Past 12 Months</span>
              </h3>
              <div className="text-sm text-foreground/70">
                Avg: {formatNumber(monthlyData.reduce((sum, d) => sum + d.consumption_mwh, 0) / monthlyData.length)} MWh/mo
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 h-80 w-full">
              {createSVGChart(monthlyData, 'monthly', 600, 280)}
            </div>
          </div>

          {/* 10 Year Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-md font-semibold flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Past 10 Years</span>
              </h3>
              <div className="text-sm text-foreground/70">
                Growth: {(((yearlyData[yearlyData.length - 1]?.consumption_mwh || 0) - (yearlyData[0]?.consumption_mwh || 0)) / (yearlyData[0]?.consumption_mwh || 1) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4 h-80 w-full">
              {createSVGChart(yearlyData, 'yearly', 600, 280)}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {formatNumber(monthlyData[monthlyData.length - 1]?.consumption_mwh || 0)}
            </div>
            <div className="text-sm text-foreground/70">Current Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(yearlyData[yearlyData.length - 1]?.consumption_mwh || 0)}
            </div>
            <div className="text-sm text-foreground/70">Current Year</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {monthlyData[monthlyData.length - 1]?.renewable_percentage.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-foreground/70">Current Renewable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatNumber((monthlyData.reduce((sum, d) => sum + d.consumption_mwh, 0) / monthlyData.length) * 12)}
            </div>
            <div className="text-sm text-foreground/70">Annual Average</div>
          </div>
        </div>
      </CardContent>
    </Card>  
  );
}