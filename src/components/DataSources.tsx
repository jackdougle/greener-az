import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Clock, Wifi } from 'lucide-react';
import { DataSourcesProps } from '@/types';

export default function DataSources({ sources, lastUpdated, isRealTime = false, isUsingFallback = false }: DataSourcesProps) {
  const sourceLinks: Record<string, string> = {
    "U.S. Energy Information Administration (EIA) - 2024 Data": "https://www.eia.gov/electricity/state/arizona/",
    "Arizona Corporation Commission - Rate Filings 2024": "https://www.azcc.gov/",
    "Arizona Public Service Company - 2024 Annual Reports": "https://www.aps.com/en/About/Our-Company/Clean-Energy",
    "Tucson Electric Power - 2024 Sustainability Reports": "https://www.tep.com/",
    "U.S. Census Bureau - 2024 Population Estimates": "https://www.census.gov/data/tables/time-series/demo/popest/2020s-state-total.html",
    "Arizona Department of Environmental Quality - 2024 Emissions Data": "https://azdeq.gov/",
    "DOE Loan Programs Office - APS Clean Energy Financing 2024": "https://www.energy.gov/lpo/articles/lpo-announces-conditional-commitment-arizona-public-service-company-help-meet-local"
  };

  if (!sources || sources.length === 0) return null;

  return (
    <Card className="mt-6 border-0 shadow-lg bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ExternalLink className="w-5 h-5 text-blue-600" />
            <span>Data Sources</span>
          </div>
          {isRealTime && !isUsingFallback ? (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Wifi className="w-4 h-4" />
              <span>Live Data</span>
            </div>
          ) : isUsingFallback ? (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Wifi className="w-4 h-4" />
              <span>Fallback Data</span>
            </div>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-1 gap-3">
          {sources.map((source, index) => {
            const link = sourceLinks[source];
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <span className="text-slate-600">{source}</span>
                </div>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <span className="text-xs">View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-800">
                {isRealTime && !isUsingFallback ? 'Real-time updates' : isUsingFallback ? 'Using fallback data' : 'Last updated'}: {lastUpdated || new Date().toLocaleString()}
              </p>
            </div>
            {isRealTime && !isUsingFallback ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">Connected</span>
              </div>
            ) : isUsingFallback ? (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs text-gray-600">Static Data</span>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}