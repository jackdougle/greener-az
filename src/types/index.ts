// Main data types for the Arizona Energy Map application

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface County {
  name: string;
  consumption_mwh: number;
  population: number;
  major_cities: string[];
  renewable_percentage: number;
  avg_residential_rate: number;
  primary_sources: string[];
  sustainability_score: number;
  carbon_emissions_tons: number;
  coordinates: Coordinates;
  consumption_per_capita: number;
  renewable_capacity_mw: number;

  // Real-time properties
  currentConsumption?: number;
  currentRenewableGeneration?: number;
  gridStress?: 'High' | 'Moderate' | 'Low' | 'Normal';
  isRealTime?: boolean;
}

export interface StateTotals {
  total_consumption: number;
  total_population: number;
  avg_renewable_percentage: number;
  total_emissions: number;

  // Real-time properties
  current_consumption?: number;
  current_renewable_percentage?: number;
  gridStatus?: string;
}

export interface MapData {
  counties: County[];
  state_totals: StateTotals;
  data_sources: string[];
}

// Real-time data types
export interface RealTimeFactors {
  consumptionMultiplier: number;
  solarEfficiency: number;
  isPeakHour: boolean;
  isNightTime: boolean;
  currentHour: number;
}

export interface CountyRealTimeUpdate {
  currentConsumption: number;
  renewableGeneration: number;
  gridStress: 'High' | 'Moderate' | 'Low' | 'Normal';
}

export interface StateRealTimeMetrics {
  totalCurrentConsumption: number;
  renewablePercentageNow: number;
  gridStatusMessage: string;
}

export interface RealTimeData {
  timestamp: string;
  realTimeFactors: RealTimeFactors;
  countyUpdates: Record<string, CountyRealTimeUpdate>;
  stateMetrics: StateRealTimeMetrics;
}

// Component prop types
export interface MapControlsProps {
  mapStyle: 'consumption' | 'renewable' | 'sustainability';
  setMapStyle: (style: 'consumption' | 'renewable' | 'sustainability') => void;
}

export interface CountyDetailsPanelProps {
  county: County;
  onClose: () => void;
}

export interface StatsOverviewProps {
  data: StateTotals;
  counties: County[];
}

export interface MapLegendProps {
  mapStyle: 'consumption' | 'renewable' | 'sustainability';
}

export interface DataSourcesProps {
  sources?: string[];
  lastUpdated?: string;
  isRealTime?: boolean;
}

// Service types
export interface ConnectionStatus {
  isConnected: boolean;
  subscriberCount: number;
  lastUpdate: string;
}

export interface UseRealTimeDataReturn {
  data: RealTimeData | null;
  isConnected: boolean;
}

// Utility types
export type MapStyleType = 'consumption' | 'renewable' | 'sustainability';

export interface InvokeLLMParams {
  prompt: string;
  add_context_from_internet?: boolean;
  response_json_schema?: object;
}