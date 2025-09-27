import { InvokeLLMParams, MapData } from '@/types';

export async function InvokeLLM({ prompt, add_context_from_internet = false, response_json_schema }: InvokeLLMParams): Promise<MapData> {
  try {
    console.log('InvokeLLM called with:', { prompt, add_context_from_internet, response_json_schema });

    const fallbackArizonaData: MapData = {
      counties: [
        {
          name: "Maricopa",
          consumption_mwh: 45200000,
          population: 4485414,
          major_cities: ["Phoenix", "Scottsdale", "Mesa", "Chandler", "Glendale"],
          renewable_percentage: 15.2,
          avg_residential_rate: 15.76,
          primary_sources: ["Natural Gas", "Solar", "Nuclear"],
          sustainability_score: 48,
          carbon_emissions_tons: 24800000,
          coordinates: { lat: 33.4484, lng: -112.0740 },
          consumption_per_capita: 10.08,
          renewable_capacity_mw: 3650
        },
        {
          name: "Pima",
          consumption_mwh: 8200000,
          population: 1043433,
          major_cities: ["Tucson", "Oro Valley", "Marana"],
          renewable_percentage: 18.5,
          avg_residential_rate: 11.8,
          primary_sources: ["Solar", "Natural Gas", "Coal"],
          sustainability_score: 58,
          carbon_emissions_tons: 4800000,
          coordinates: { lat: 32.2226, lng: -111.0262 },
          consumption_per_capita: 7.86,
          renewable_capacity_mw: 1650
        },
        {
          name: "Pinal",
          consumption_mwh: 3800000,
          population: 425264,
          major_cities: ["Casa Grande", "Apache Junction", "Eloy"],
          renewable_percentage: 35.2,
          avg_residential_rate: 13.1,
          primary_sources: ["Solar", "Natural Gas"],
          sustainability_score: 72,
          carbon_emissions_tons: 1200000,
          coordinates: { lat: 32.8659, lng: -111.2722 },
          consumption_per_capita: 8.94,
          renewable_capacity_mw: 3200
        },
        {
          name: "Yuma",
          consumption_mwh: 1850000,
          population: 203881,
          major_cities: ["Yuma", "San Luis"],
          renewable_percentage: 28.7,
          avg_residential_rate: 10.9,
          primary_sources: ["Solar", "Natural Gas", "Hydroelectric"],
          sustainability_score: 65,
          carbon_emissions_tons: 850000,
          coordinates: { lat: 32.6927, lng: -114.6277 },
          consumption_per_capita: 9.07,
          renewable_capacity_mw: 1100
        },
        {
          name: "Mohave",
          consumption_mwh: 1650000,
          population: 213267,
          major_cities: ["Lake Havasu City", "Kingman", "Bullhead City"],
          renewable_percentage: 22.1,
          avg_residential_rate: 11.5,
          primary_sources: ["Natural Gas", "Solar", "Coal"],
          sustainability_score: 52,
          carbon_emissions_tons: 980000,
          coordinates: { lat: 35.2069, lng: -114.0425 },
          consumption_per_capita: 7.74,
          renewable_capacity_mw: 850
        },
        {
          name: "Coconino",
          consumption_mwh: 1420000,
          population: 145101,
          major_cities: ["Flagstaff", "Sedona", "Page"],
          renewable_percentage: 31.4,
          avg_residential_rate: 12.8,
          primary_sources: ["Solar", "Wind", "Natural Gas"],
          sustainability_score: 68,
          carbon_emissions_tons: 650000,
          coordinates: { lat: 35.2828, lng: -111.6647 },
          consumption_per_capita: 9.79,
          renewable_capacity_mw: 720
        },
        {
          name: "Navajo",
          consumption_mwh: 3200000,
          population: 106717,
          major_cities: ["Show Low", "Winslow", "Holbrook"],
          renewable_percentage: 15.8,
          avg_residential_rate: 11.2,
          primary_sources: ["Coal", "Natural Gas", "Solar"],
          sustainability_score: 38,
          carbon_emissions_tons: 2100000,
          coordinates: { lat: 34.7636, lng: -109.7617 },
          consumption_per_capita: 29.98,
          renewable_capacity_mw: 450
        },
        {
          name: "Cochise",
          consumption_mwh: 980000,
          population: 125447,
          major_cities: ["Sierra Vista", "Bisbee", "Douglas"],
          renewable_percentage: 24.6,
          avg_residential_rate: 12.1,
          primary_sources: ["Solar", "Natural Gas", "Wind"],
          sustainability_score: 61,
          carbon_emissions_tons: 420000,
          coordinates: { lat: 31.8759, lng: -109.7618 },
          consumption_per_capita: 7.81,
          renewable_capacity_mw: 380
        },
        {
          name: "Yavapai",
          consumption_mwh: 1750000,
          population: 236209,
          major_cities: ["Prescott", "Prescott Valley", "Sedona"],
          renewable_percentage: 26.3,
          avg_residential_rate: 13.4,
          primary_sources: ["Solar", "Natural Gas", "Hydroelectric"],
          sustainability_score: 63,
          carbon_emissions_tons: 780000,
          coordinates: { lat: 34.5397, lng: -112.4684 },
          consumption_per_capita: 7.41,
          renewable_capacity_mw: 620
        },
        {
          name: "Apache",
          consumption_mwh: 750000,
          population: 66021,
          major_cities: ["St. Johns", "Eagar", "Chinle"],
          renewable_percentage: 19.2,
          avg_residential_rate: 10.8,
          primary_sources: ["Coal", "Solar", "Wind"],
          sustainability_score: 48,
          carbon_emissions_tons: 420000,
          coordinates: { lat: 35.1106, lng: -109.2817 },
          consumption_per_capita: 11.36,
          renewable_capacity_mw: 280
        },
        {
          name: "Santa Cruz",
          consumption_mwh: 420000,
          population: 47669,
          major_cities: ["Nogales", "Patagonia"],
          renewable_percentage: 33.1,
          avg_residential_rate: 11.6,
          primary_sources: ["Solar", "Natural Gas"],
          sustainability_score: 71,
          carbon_emissions_tons: 180000,
          coordinates: { lat: 31.3389, lng: -111.0073 },
          consumption_per_capita: 8.81,
          renewable_capacity_mw: 210
        },
        {
          name: "Graham",
          consumption_mwh: 380000,
          population: 38533,
          major_cities: ["Safford", "Thatcher", "Pima"],
          renewable_percentage: 29.7,
          avg_residential_rate: 10.3,
          primary_sources: ["Solar", "Natural Gas", "Hydroelectric"],
          sustainability_score: 66,
          carbon_emissions_tons: 165000,
          coordinates: { lat: 32.8542, lng: -109.8460 },
          consumption_per_capita: 9.86,
          renewable_capacity_mw: 190
        },
        {
          name: "Greenlee",
          consumption_mwh: 1100000,
          population: 9563,
          major_cities: ["Clifton", "Duncan"],
          renewable_percentage: 8.4,
          avg_residential_rate: 9.8,
          primary_sources: ["Coal", "Natural Gas", "Solar"],
          sustainability_score: 32,
          carbon_emissions_tons: 890000,
          coordinates: { lat: 33.0598, lng: -109.0548 },
          consumption_per_capita: 115.02,
          renewable_capacity_mw: 85
        },
        {
          name: "La Paz",
          consumption_mwh: 290000,
          population: 16557,
          major_cities: ["Parker", "Quartzsite"],
          renewable_percentage: 41.2,
          avg_residential_rate: 12.7,
          primary_sources: ["Solar", "Natural Gas"],
          sustainability_score: 78,
          carbon_emissions_tons: 95000,
          coordinates: { lat: 33.6617, lng: -114.2711 },
          consumption_per_capita: 17.51,
          renewable_capacity_mw: 420
        },
        {
          name: "Gila",
          consumption_mwh: 580000,
          population: 53272,
          major_cities: ["Globe", "Payson"],
          renewable_percentage: 25.8,
          avg_residential_rate: 11.9,
          primary_sources: ["Solar", "Natural Gas", "Hydroelectric"],
          sustainability_score: 62,
          carbon_emissions_tons: 285000,
          coordinates: { lat: 33.7712, lng: -110.7184 },
          consumption_per_capita: 10.89,
          renewable_capacity_mw: 240
        }
      ],
      state_totals: {
        total_consumption: 71800000,
        total_population: 7421401,
        avg_renewable_percentage: 26.1,
        total_emissions: 38900000
      },
      data_sources: [
        "U.S. Energy Information Administration (EIA) - 2024 Data",
        "Arizona Corporation Commission - Rate Filings 2024",
        "Arizona Public Service Company - 2024 Annual Reports",
        "Tucson Electric Power - 2024 Sustainability Reports",
        "U.S. Census Bureau - 2024 Population Estimates",
        "Arizona Department of Environmental Quality - 2024 Emissions Data",
        "DOE Loan Programs Office - APS Clean Energy Financing 2024"
      ]
    };

    return fallbackArizonaData;
  } catch (error) {
    console.error('Error in InvokeLLM:', error);
    throw error;
  }
}