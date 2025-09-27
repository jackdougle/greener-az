import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export default function DataSources({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <Card className="mt-6 border-0 shadow-lg bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <ExternalLink className="w-5 h-5 text-blue-600" />
          <span>Data Sources</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-2">
          {sources.map((source, index) => (
            <div key={index} className="text-sm text-slate-600 flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span>{source}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            Data is updated regularly from official government sources and utility companies.
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}