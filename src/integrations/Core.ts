import { MapData } from '@/types';
import { eiaApiService } from '@/services/EIAApiService';

// Define the structure of EIA data to match what eiaApiService.fetchArizonaElectricityData() returns
interface BalancingAuthorityData {
  demand: number;
  generation: number;
}

interface ProcessedElectricityData {
  azps?: BalancingAuthorityData;
  srp?: BalancingAuthorityData;
  walc?: BalancingAuthorityData;
  stateTotal: {
    totalDemand: number;
    totalGeneration: number;
  };
}

// Arizona county metadata (population, coordinates, cities)
const ARIZONA_COUNTY_METADATA = {
  'Maricopa': {
    population: 4485414,
    major_cities: ["Phoenix", "Scottsdale", "Mesa", "Chandler", "Glendale"],
    coordinates: { lat: 33.4484, lng: -112.0740 },
    balancing_authority: 'AZPS',
    share: 0.7
  },
  'Pima': {
    population: 1043433,
    major_cities: ["Tucson", "Oro Valley", "Marana"],
    coordinates: { lat: 32.2226, lng: -111.0262 },
    balancing_authority: 'AZPS',
    share: 0.3
  },
  'Pinal': {
    population: 425264,
    major_cities: ["Casa Grande", "Apache Junction", "Eloy"],
    coordinates: { lat: 32.8659, lng: -111.2722 },
    balancing_authority: 'AZPS',
    share: 0.8
  },
  'Yuma': {
    population: 203881,
    major_cities: ["Yuma", "San Luis"],
    coordinates: { lat: 32.6927, lng: -114.6277 },
    balancing_authority: 'WALC',
    share: 0.8
  },
  'Mohave': {
    population: 213267,
    major_cities: ["Lake Havasu City", "Kingman", "Bullhead City"],
    coordinates: { lat: 35.2069, lng: -114.0425 },
    balancing_authority: 'WALC',
    share: 0.6
  },
  'Coconino': {
    population: 145101,
    major_cities: ["Flagstaff", "Sedona", "Page"],
    coordinates: { lat: 35.2828, lng: -111.6647 },
    balancing_authority: 'AZPS',
    share: 0.3
  },
  'Navajo': {
    population: 106717,
    major_cities: ["Show Low", "Winslow", "Holbrook"],
    coordinates: { lat: 34.7636, lng: -109.7617 },
    balancing_authority: 'AZPS',
    share: 0.2
  },
  'Cochise': {
    population: 125447,
    major_cities: ["Sierra Vista", "Bisbee", "Douglas"],
    coordinates: { lat: 31.8759, lng: -109.7618 },
    balancing_authority: 'AZPS',
    share: 0.1
  },
  'Yavapai': {
    population: 236209,
    major_cities: ["Prescott", "Prescott Valley", "Sedona"],
    coordinates: { lat: 34.5397, lng: -112.4684 },
    balancing_authority: 'AZPS',
    share: 0.4
  },
  'Apache': {
    population: 66021,
    major_cities: ["St. Johns", "Eagar", "Chinle"],
    coordinates: { lat: 35.1106, lng: -109.2817 },
    balancing_authority: 'AZPS',
    share: 0.1
  },
  'Santa Cruz': {
    population: 47669,
    major_cities: ["Nogales", "Patagonia"],
    coordinates: { lat: 31.3389, lng: -111.0073 },
    balancing_authority: 'AZPS',
    share: 0.05
  },
  'Graham': {
    population: 38533,
    major_cities: ["Safford", "Thatcher", "Pima"],
    coordinates: { lat: 32.8542, lng: -109.8460 },
    balancing_authority: 'SRP',
    share: 0.2
  },
  'Greenlee': {
    population: 9563,
    major_cities: ["Clifton", "Duncan"],
    coordinates: { lat: 33.0598, lng: -109.0548 },
    balancing_authority: 'SRP',
    share: 0.1
  },
  'La Paz': {
    population: 16557,
    major_cities: ["Parker", "Quartzsite"],
    coordinates: { lat: 33.6617, lng: -114.2711 },
    balancing_authority: 'WALC',
    share: 0.2
  },
  'Gila': {
    population: 53272,
    major_cities: ["Globe", "Payson"],
    coordinates: { lat: 33.7712, lng: -110.7184 },
    balancing_authority: 'SRP',
    share: 0.3
  }
};

export async function loadRealElectricityData(): Promise<MapData> {
  try {
    console.log('🔄 Loading real electricity data from EIA API...');

    if (!eiaApiService.isConfigured()) {
      throw new Error('EIA API not configured');
    }

    // Fetch real EIA data and residential rate data in parallel
    const [eiaData, residentialRate] = await Promise.all([
      eiaApiService.fetchArizonaElectricityData(),
      eiaApiService.fetchArizonaResidentialRateData()
    ]);

    console.log('✅ Successfully fetched EIA data:', eiaData);

    // Use the data directly without type assertion, but with safe property access
    const eiaDataTyped = eiaData as any; // Safe fallback

    // Convert EIA data to county-level data using real consumption
    const counties = Object.entries(ARIZONA_COUNTY_METADATA).map(([countyName, metadata]) => {
      const baKey = metadata.balancing_authority.toLowerCase();
      
      // Safely access the balancing authority data with fallback
      const baData = eiaDataTyped[baKey] || { demand: 0, generation: 0 };

      // Safely calculate consumption and generation, defaulting to 0 if data is missing
      const countyConsumption = (baData && baData.demand) 
        ? baData.demand * metadata.share * 1000 
        : 0;
      const countyGeneration = (baData && baData.generation) 
        ? baData.generation * metadata.share * 1000 
        : 0;

      // Estimate renewable percentage, avoiding division by zero
      const renewablePercentage = countyConsumption > 0
        ? Math.round((countyGeneration / countyConsumption) * 100 * 0.3)
        : 0;

      // Calculate emissions based on consumption (approximate factor)
      const carbonEmissions = countyConsumption * 0.4; // Rough CO2 factor

      return {
        name: countyName,
        consumption_mwh: Math.round(countyConsumption),
        population: metadata.population,
        major_cities: metadata.major_cities,
        renewable_percentage: Math.min(renewablePercentage, 45), // Cap at 45%
        avg_residential_rate: residentialRate, // Use real fetched rate
        primary_sources: renewablePercentage > 25 ? ["Solar", "Natural Gas", "Nuclear"] : ["Natural Gas", "Solar", "Coal"],
        sustainability_score: Math.round(renewablePercentage * 1.5 + 20), // Rough calculation
        carbon_emissions_tons: Math.round(carbonEmissions),
        coordinates: metadata.coordinates,
        consumption_per_capita: metadata.population > 0 ? Math.round((countyConsumption / metadata.population) * 10) / 10 : 0,
        renewable_capacity_mw: Math.round(countyGeneration * 0.3) // Estimate renewable capacity
      };
    });

    // Calculate state totals from real data
    const stateTotals = {
      total_consumption: (eiaDataTyped.stateTotal?.totalDemand || 0) * 1000, // Convert MW to MWh
      total_population: Object.values(ARIZONA_COUNTY_METADATA).reduce((sum, county) => sum + county.population, 0),
      avg_renewable_percentage: (eiaDataTyped.stateTotal?.totalDemand || 0) > 0
        ? Math.round(((eiaDataTyped.stateTotal?.totalGeneration || 0) / (eiaDataTyped.stateTotal?.totalDemand || 1)) * 100 * 0.3)
        : 0,
      total_emissions: Math.round((eiaDataTyped.stateTotal?.totalDemand || 0) * 1000 * 0.4)
    };

    return {
      counties,
      state_totals: stateTotals,
      data_sources: [
        "U.S. Energy Information Administration (EIA) - Real-time API",
        "Arizona Public Service (AZPS) - Live Grid Data",
        "Salt River Project (SRP) - Live Grid Data",
        "Western Area Power Administration (WALC) - Live Grid Data",
        "U.S. Census Bureau - 2024 Population Estimates"
      ]
    };

  } catch (error) {
    console.error('❌ Error loading real electricity data:', error);
    throw error;
  }
}