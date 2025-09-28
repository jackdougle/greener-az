/**
 * EIA (Energy Information Administration) API Service
 *
 * This service provides real-time electricity data from the U.S. Energy Information Administration.
 * Register for a free API key at: https://www.eia.gov/opendata/
 */

export interface EIAElectricityData {
  period: string;
  subba: string; // Sub-balancing authority
  'subba-name': string;
  parent: string; // Parent balancing authority
  'parent-name': string;
  'respondent-id': string;
  'respondent-name': string;
  'type-name': string;
  value: number;
  'value-units': string;
}

export interface EIAApiResponse {
  response: {
    data: EIAElectricityData[];
    total: number;
    dateFormat: string;
    frequency: string;
    description: string;
  };
}

export interface ProcessedElectricityData {
  timestamp: string;
  azps: {
    demand: number;
    generation: number;
    interchange: number;
  };
  srp: {
    demand: number;
    generation: number;
    interchange: number;
  };
  walc: {
    demand: number;
    generation: number;
    interchange: number;
  };
  stateTotal: {
    totalDemand: number;
    totalGeneration: number;
    totalInterchange: number;
  };
}

class EIAApiService {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly requestCache = new Map<string, { data: any; timestamp: number }>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = import.meta.env.VITE_EIA_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_EIA_API_BASE_URL || 'https://api.eia.gov/v2';

    if (!this.apiKey) {
      console.warn('⚠️ EIA API key not found. Please add VITE_EIA_API_KEY to your .env.local file');
    }
  }

  /**
   * Checks if the API is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Fetches real-time electricity data for Arizona balancing authorities
   */
  async fetchArizonaElectricityData(): Promise<ProcessedElectricityData> {
    if (!this.isConfigured()) {
      throw new Error('EIA API key not configured. Please add VITE_EIA_API_KEY to your environment variables.');
    }

    const cacheKey = 'arizona-electricity-data';
    const cached = this.requestCache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Get current date for the API request (EIA uses date format YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Arizona balancing authorities: AZPS, SRP, WALC
      const arizonaBalancingAuthorities = ['AZPS', 'SRP', 'WALC'];

      const responses = await Promise.all(
        arizonaBalancingAuthorities.map(ba => this.fetchBalancingAuthorityData(ba, yesterday, today))
      );

      const processedData = this.processElectricityData(responses);

      // Cache the processed data
      this.requestCache.set(cacheKey, {
        data: processedData,
        timestamp: Date.now()
      });

      return processedData;

    } catch (error) {
      console.error('Error fetching EIA electricity data:', error);
      throw new Error(`Failed to fetch electricity data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetches data for a specific balancing authority
   */
  private async fetchBalancingAuthorityData(
    balancingAuthority: string,
    startDate: string,
    endDate: string
  ): Promise<EIAApiResponse> {
    const url = new URL(`${this.baseUrl}/electricity/rto/region-sub-ba-data/data`);

    // Add query parameters
    url.searchParams.set('api_key', this.apiKey);
    url.searchParams.set('frequency', 'hourly');
    url.searchParams.set('data[0]', 'value');
    url.searchParams.set('facets[parent][]', balancingAuthority);
    url.searchParams.set('start', `${startDate}T00`);
    url.searchParams.set('end', `${endDate}T23`);
    url.searchParams.set('sort[0][column]', 'period');
    url.searchParams.set('sort[0][direction]', 'desc');
    url.searchParams.set('offset', '0');
    url.searchParams.set('length', '5000');

    console.log(`🔄 Fetching EIA data for ${balancingAuthority}...`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Arizona-Energy-Map/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EIA API request failed (${response.status}): ${errorText}`);
    }

    const data: EIAApiResponse = await response.json();

    if (!data.response || !data.response.data) {
      throw new Error('Invalid API response format');
    }

    console.log(`✅ Received ${data.response.data.length} data points for ${balancingAuthority}`);
    return data;
  }

  /**
   * Processes raw EIA data into a structured format
   */
  private processElectricityData(responses: EIAApiResponse[]): ProcessedElectricityData {
    const now = new Date().toISOString();

    // Initialize data structure
    const processedData: ProcessedElectricityData = {
      timestamp: now,
      azps: { demand: 0, generation: 0, interchange: 0 },
      srp: { demand: 0, generation: 0, interchange: 0 },
      walc: { demand: 0, generation: 0, interchange: 0 },
      stateTotal: { totalDemand: 0, totalGeneration: 0, totalInterchange: 0 }
    };

    responses.forEach(response => {
      const data = response.response.data;

      // Group data by balancing authority and type
      data.forEach(point => {
        const ba = point.parent.toLowerCase() as 'azps' | 'srp' | 'walc';
        const typeName = point['type-name'].toLowerCase();

        if (processedData[ba]) {
          // Get the most recent value (data is sorted by period desc)
          if (typeName.includes('demand') || typeName.includes('load')) {
            processedData[ba].demand = Math.max(processedData[ba].demand, point.value || 0);
          } else if (typeName.includes('generation') || typeName.includes('net generation')) {
            processedData[ba].generation = Math.max(processedData[ba].generation, point.value || 0);
          } else if (typeName.includes('interchange') || typeName.includes('net interchange')) {
            processedData[ba].interchange += point.value || 0;
          }
        }
      });
    });

    // Calculate state totals
    processedData.stateTotal = {
      totalDemand: processedData.azps.demand + processedData.srp.demand + processedData.walc.demand,
      totalGeneration: processedData.azps.generation + processedData.srp.generation + processedData.walc.generation,
      totalInterchange: processedData.azps.interchange + processedData.srp.interchange + processedData.walc.interchange
    };

    return processedData;
  }

  /**
   * Converts EIA balancing authority data to county-level estimates
   */
  mapBalancingAuthorityToCounties(eiaData: ProcessedElectricityData): Record<string, any> {
    // Mapping based on service territories
    const countyMappings = {
      'Maricopa': {
        ba: 'azps',
        share: 0.7, // APS serves ~70% of Maricopa County
        population: 4485414
      },
      'Pima': {
        ba: 'azps',
        share: 0.3, // APS serves ~30% of Pima County
        population: 1043433
      },
      'Pinal': {
        ba: 'azps',
        share: 0.8, // APS serves majority of Pinal
        population: 425264
      },
      'Yavapai': {
        ba: 'azps',
        share: 0.6, // APS serves majority of Yavapai
        population: 236209
      },
      'Gila': {
        ba: 'srp',
        share: 0.4, // SRP serves part of Gila
        population: 53272
      }
    };

    const countyData: Record<string, any> = {};

    Object.entries(countyMappings).forEach(([county, mapping]) => {
      const baData = eiaData[mapping.ba as keyof typeof eiaData];
      if (typeof baData === 'object' && 'demand' in baData) {
        countyData[county] = {
          currentConsumption: Math.round((baData.demand * mapping.share) * 1000), // Convert MW to kWh
          currentGeneration: Math.round((baData.generation * mapping.share) * 1000),
          gridStress: this.calculateGridStress(baData.demand, baData.generation),
          lastUpdated: eiaData.timestamp,
          isRealTime: true
        };
      }
    });

    return countyData;
  }

  /**
   * Calculates grid stress level based on demand vs generation
   */
  private calculateGridStress(demand: number, generation: number): 'Low' | 'Normal' | 'Moderate' | 'High' {
    const utilizationRatio = demand / (generation || demand);

    if (utilizationRatio > 0.9) return 'High';
    if (utilizationRatio > 0.75) return 'Moderate';
    if (utilizationRatio > 0.5) return 'Normal';
    return 'Low';
  }

  /**
   * Clears the request cache
   */
  clearCache(): void {
    this.requestCache.clear();
  }
}

// Export singleton instance
export const eiaApiService = new EIAApiService();