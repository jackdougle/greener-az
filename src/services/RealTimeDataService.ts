import React from 'react';
import { RealTimeData, ConnectionStatus, UseRealTimeDataReturn } from '@/types';

class RealTimeDataService {
  private subscribers: Array<(data: RealTimeData) => void> = [];
  private isConnected: boolean = false;
  private isOnline: boolean = navigator.onLine;
  private updateInterval: NodeJS.Timeout | null = null;
  private connectionStatusSubscribers: Array<(isConnected: boolean) => void> = [];

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  subscribe(callback: (data: RealTimeData) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  subscribeToConnectionStatus(callback: (isConnected: boolean) => void): () => void {
    this.connectionStatusSubscribers.push(callback);
    return () => {
      this.connectionStatusSubscribers = this.connectionStatusSubscribers.filter(sub => sub !== callback);
    };
  }

  private handleOnline(): void {
    this.isOnline = true;
    console.log('🟢 Network connection restored');
    if (this.isConnected) {
      this.notifyConnectionStatusSubscribers();
      this.fetchAndBroadcastUpdates();
    }
  }

  private handleOffline(): void {
    this.isOnline = false;
    console.log('🔴 Network connection lost');
    this.notifyConnectionStatusSubscribers();
  }

  private notifyConnectionStatusSubscribers(): void {
    const actuallyConnected = this.isConnected && this.isOnline;
    this.connectionStatusSubscribers.forEach(callback => {
      try {
        callback(actuallyConnected);
      } catch (error) {
        console.error('Error in connection status subscriber callback:', error);
      }
    });
  }

  async connect(): Promise<void> {
    this.isConnected = true;
    console.log('🔴 Real-time service connected');

    // Notify connection status subscribers
    this.notifyConnectionStatusSubscribers();

    // Start periodic updates every 30 seconds (only if online)
    this.updateInterval = setInterval(() => {
      if (this.isOnline) {
        this.fetchAndBroadcastUpdates();
      }
    }, 30000);

    // Initial fetch (only if online)
    if (this.isOnline) {
      await this.fetchAndBroadcastUpdates();
    }
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.notifyConnectionStatusSubscribers();
    console.log('🟡 Real-time service disconnected');
  }

  private async fetchAndBroadcastUpdates(): Promise<void> {
    try {
      const updates = await this.fetchRealTimeUpdates();
      this.broadcastToSubscribers(updates);
    } catch (error) {
      console.error('Error fetching real-time updates:', error);
    }
  }

  private async fetchRealTimeUpdates(): Promise<RealTimeData> {
    // Simulate real-time data variations based on current time and realistic patterns
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();

    // Peak consumption hours: 2-6 PM on weekdays
    const isPeakHour = hour >= 14 && hour <= 18 && dayOfWeek >= 1 && dayOfWeek <= 5;
    const isNightTime = hour >= 22 || hour <= 6;

    // Base consumption multiplier
    let consumptionMultiplier = 1.0;
    if (isPeakHour) consumptionMultiplier = 1.15; // 15% higher during peak
    if (isNightTime) consumptionMultiplier = 0.85; // 15% lower at night

    // Solar generation based on time of day
    const solarEfficiency = this.calculateSolarEfficiency(hour);

    const updates = {
      timestamp: now.toISOString(),
      realTimeFactors: {
        consumptionMultiplier,
        solarEfficiency,
        isPeakHour,
        isNightTime,
        currentHour: hour
      },
      countyUpdates: {
        // Simulate real-time variations for major counties
        'Maricopa': {
          currentConsumption: Math.round(45200000 * consumptionMultiplier * (0.95 + Math.random() * 0.1)),
          renewableGeneration: Math.round(3650 * solarEfficiency * (0.9 + Math.random() * 0.2)),
          gridStress: (isPeakHour ? 'High' : isNightTime ? 'Low' : 'Normal') as 'High' | 'Moderate' | 'Low' | 'Normal'
        },
        'Pima': {
          currentConsumption: Math.round(8200000 * consumptionMultiplier * (0.95 + Math.random() * 0.1)),
          renewableGeneration: Math.round(1650 * solarEfficiency * (0.9 + Math.random() * 0.2)),
          gridStress: (isPeakHour ? 'High' : isNightTime ? 'Low' : 'Normal') as 'High' | 'Moderate' | 'Low' | 'Normal'
        },
        'Pinal': {
          currentConsumption: Math.round(3800000 * consumptionMultiplier * (0.95 + Math.random() * 0.1)),
          renewableGeneration: Math.round(3200 * solarEfficiency * (0.9 + Math.random() * 0.2)),
          gridStress: (isPeakHour ? 'Moderate' : 'Normal') as 'High' | 'Moderate' | 'Low' | 'Normal'
        }
      },
      stateMetrics: {
        totalCurrentConsumption: Math.round(71800000 * consumptionMultiplier),
        renewablePercentageNow: Math.round(26.1 * solarEfficiency * 100) / 100,
        gridStatusMessage: isPeakHour ? 'Peak demand period - High solar generation' :
                          isNightTime ? 'Low demand period - Battery storage active' :
                          'Normal operations'
      }
    };

    return updates;
  }

  private calculateSolarEfficiency(hour: number): number {
    // Solar efficiency curve: 0% at night, peak around noon
    if (hour < 6 || hour > 19) return 0; // No solar at night
    if (hour >= 6 && hour <= 8) return (hour - 6) / 2 * 0.3; // Morning ramp
    if (hour >= 8 && hour <= 12) return 0.3 + ((hour - 8) / 4) * 0.7; // Morning to peak
    if (hour >= 12 && hour <= 16) return 1.0; // Peak solar hours
    if (hour >= 16 && hour <= 19) return 1.0 - ((hour - 16) / 3) * 1.0; // Evening decline
    return 0;
  }

  private broadcastToSubscribers(updates: RealTimeData): void {
    this.subscribers.forEach(callback => {
      try {
        callback(updates);
      } catch (error) {
        console.error('Error in subscriber callback:', error);
      }
    });
  }

  getConnectionStatus(): ConnectionStatus {
    return {
      isConnected: this.isConnected && this.isOnline,
      subscriberCount: this.subscribers.length,
      lastUpdate: new Date().toISOString()
    };
  }
}

// Singleton instance
export const realTimeDataService = new RealTimeDataService();

// Hook for React components
export function useRealTimeData(): UseRealTimeDataReturn {
  const [data, setData] = React.useState<RealTimeData | null>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribeData = realTimeDataService.subscribe((updates) => {
      setData(updates);
    });

    const unsubscribeConnection = realTimeDataService.subscribeToConnectionStatus((connected) => {
      setIsConnected(connected);
    });

    realTimeDataService.connect().then(() => {
      // Initial connection status will be handled by the subscription
      setIsConnected(realTimeDataService.getConnectionStatus().isConnected);
    });

    return () => {
      unsubscribeData();
      unsubscribeConnection();
      realTimeDataService.disconnect();
      setIsConnected(false);
    };
  }, []);

  return { data, isConnected };
}