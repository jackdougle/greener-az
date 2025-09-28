import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ExternalLink, Settings, CheckCircle, XCircle, Info } from 'lucide-react';
import { eiaApiService } from '@/services/EIAApiService';

interface ApiConfigurationNoticeProps {
  isApiConfigured: boolean;
  isUsingRealApi: boolean;
  onDismiss?: () => void;
}

export default function ApiConfigurationNotice({
  isApiConfigured,
  isUsingRealApi,
  onDismiss
}: ApiConfigurationNoticeProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isApiConfigured && isUsingRealApi) {
    // API is configured and working
    return (
      <Card className="border-green-200 bg-green-50 fade-in">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Live Data Connected
                </p>
                <p className="text-xs text-green-700">
                  Pulling real-time electricity data from EIA API
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isApiConfigured) {
    // API key not configured
    return (
      <Card className="border-amber-200 bg-amber-50 fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-lg">Enable Live Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="text-sm text-amber-800">
              <p className="mb-2">
                This application can display real-time electricity data from the U.S. Energy Information Administration (EIA).
                Currently showing simulated data.
              </p>
              <p>
                To enable live data updates, you'll need a free EIA API key.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-card/60 rounded-lg p-3 text-sm">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Setup Instructions:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-amber-800">
                  <li>Get a free API key from EIA (takes 30 seconds)</li>
                  <li>Add it to your <code className="bg-amber-100 px-1 rounded">.env.local</code> file</li>
                  <li>Restart the development server</li>
                  <li>Enjoy real-time electricity data!</li>
                </ol>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <a
                    href="https://www.eia.gov/opendata/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Get Free API Key</span>
                  </a>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-amber-700 hover:text-amber-900"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // API is configured but not enabled
  return (
    <Card className="border-blue-200 bg-blue-50 fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">
                API Key Configured
              </p>
              <p className="text-xs text-foreground/80">
                Set VITE_ENABLE_LIVE_DATA=true in .env.local to enable real-time data
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-primary hover:text-primary/80"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}