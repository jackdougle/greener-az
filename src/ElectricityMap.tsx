import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl, CircleMarker, Tooltip } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { loadRealElectricityData } from '@/integrations/Core';
import { useRealTimeData } from './services/RealTimeDataService';
import { CarbonFootprintService } from './services/CarbonFootprintService';
import { MapData, County, MapStyleType } from '@/types';
import { 
  Zap, 
  Leaf, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  BarChart3,
  Sun,
  Wind,
  Factory,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import MapLegend from './components/map/MapLegend';
import CountyDetailsPanel from './components/map/CountyDetailsPanel';
import CarbonFootprintCard from './components/map/CarbonFootprintCard';
import CarbonReductionModal from './components/CarbonReductionModal';
import StatsOverview from './components/map/StatsOverview';
import MapControls from './components/map/MapControls';
import DataSources from './components/DataSources';
import ApiConfigurationNotice from './components/ApiConfigurationNotice';
import { realTimeDataService } from './services/RealTimeDataService';

export default function ElectricityMap() {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<MapStyleType>('consumption');
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(false);
  const [showCarbonModal, setShowCarbonModal] = useState<boolean>(false);
  const { data: realTimeData, isConnected: isRealTimeConnected } = useRealTimeData();
  const [dataSourceInfo, setDataSourceInfo] = useState(realTimeDataService.getDataSourceInfo());

  const formatNumber = (num: number | undefined): string => {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  useEffect(() => {
    loadElectricityData();
  }, []);

  useEffect(() => {
    if (realTimeData && mapData) {
      // Apply real-time updates to map data
      const updatedMapData = { ...mapData };

      // Update county data with real-time information
      if (realTimeData.countyUpdates) {
        updatedMapData.counties = updatedMapData.counties.map(county => {
          const realTimeUpdate = realTimeData.countyUpdates[county.name];
          if (realTimeUpdate) {
            return {
              ...county,
              currentConsumption: realTimeUpdate.currentConsumption,
              currentRenewableGeneration: realTimeUpdate.renewableGeneration,
              gridStress: realTimeUpdate.gridStress,
              isRealTime: true
            };
          }
          return county;
        });
      }

      // Update state totals with real-time data
      if (realTimeData.stateMetrics) {
        updatedMapData.state_totals = {
          ...updatedMapData.state_totals,
          current_consumption: realTimeData.stateMetrics.totalCurrentConsumption,
          current_renewable_percentage: realTimeData.stateMetrics.renewablePercentageNow,
          gridStatus: realTimeData.stateMetrics.gridStatusMessage
        };
      }

      setMapData(updatedMapData);
      setLastUpdated(new Date(realTimeData.timestamp).toLocaleString());

      // Update data source info
      setDataSourceInfo(realTimeDataService.getDataSourceInfo());
    }
  }, [realTimeData]);

  // Helper function to enrich counties with carbon footprint estimates
  const enrichCountiesWithCarbonFootprint = (counties: County[]): County[] => {
    return counties.map(county => ({
      ...county,
      carbonFootprint: CarbonFootprintService.calculateCountyCarbonFootprint(
        county.consumption_mwh,
        county.population,
        county.renewable_percentage,
        county.carbon_emissions_tons
      )
    }));
  };

  const getFallbackArizonaData = () => {
    return {
      counties: [
        {
          name: "Maricopa",
          consumption_mwh: 42500000,
          population: 4485414,
          major_cities: ["Phoenix", "Scottsdale", "Mesa", "Chandler", "Glendale"],
          renewable_percentage: 12.8,
          avg_residential_rate: 12.3,
          primary_sources: ["Natural Gas", "Solar", "Nuclear"],
          sustainability_score: 45,
          carbon_emissions_tons: 25600000,
          coordinates: { lat: 33.4484, lng: -112.0740 },
          consumption_per_capita: 9.47,
          renewable_capacity_mw: 2850
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
        total_consumption: 69000000,
        total_population: 7421401,
        avg_renewable_percentage: 24.7,
        total_emissions: 40500000
      },
      data_sources: [
        "U.S. Energy Information Administration (EIA)",
        "Arizona Corporation Commission",
        "Arizona Public Service Company Reports",
        "U.S. Census Bureau",
        "Arizona Department of Environmental Quality",
        "Fallback estimates based on population and economic data"
      ]
    };
  };

  const loadElectricityData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading real EIA electricity data...');
      const response = await loadRealElectricityData();

      const enrichedResponse = {
        ...response,
        counties: enrichCountiesWithCarbonFootprint(response.counties)
      };
      setMapData(enrichedResponse);
      setIsUsingFallback(false);
      console.log('✅ Successfully loaded real electricity data');
    } catch (error) {
      console.error('❌ Error loading real electricity data, using fallback:', error);
      const fallbackData = getFallbackArizonaData();
      fallbackData.counties = enrichCountiesWithCarbonFootprint(fallbackData.counties);
      setMapData(fallbackData);
      setIsUsingFallback(true);
    }
    setLoading(false);
  };

  const getColorByValue = (value: number, metric: MapStyleType = 'consumption'): string => {
    if (!mapData || !mapData.counties || mapData.counties.length === 0 || value === undefined || value === null) return '#94a3b8';
    
    const values = mapData.counties.map(c => {
      switch(metric) {
        case 'consumption': return c.consumption_per_capita;
        case 'renewable': return c.renewable_percentage;
        case 'sustainability': return c.sustainability_score;
        default: return c.consumption_per_capita;
      }
    }).filter(v => typeof v === 'number' && !isNaN(v));
    
    if (values.length === 0) return '#94a3b8';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    if (range === 0) return '#ca8a04';
    
    const normalized = (value - min) / range;
    
    let colors;
    if (metric === 'renewable' || metric === 'sustainability') {
      colors = ['#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#059669'];
    } else {
      colors = ['#059669', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'].reverse();
    }
    
    if (normalized <= 0.2) return colors[0];
    if (normalized <= 0.4) return colors[1];
    if (normalized <= 0.6) return colors[2];
    if (normalized <= 0.8) return colors[3];
    return colors[4];
  };

  const handleCountyClick = (county: County): void => {
    setSelectedCounty(county);
    setShowPanel(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 fade-in">
          <div className="relative mx-auto w-12 h-12 flex items-center justify-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-300 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground fade-in-up stagger-1">Loading Arizona Electricity Data</h3>
            <p className="text-foreground/80 fade-in-up stagger-2">Fetching real-time consumption and sustainability metrics...</p>
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-card/80 backdrop-blur-md border-b border-border fixed top-0 left-0 w-full z-50 fade-in" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 50 }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 slide-in-left">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center hover-scale transition-bounce">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Arizona Energy Map</h1>
                <p className="text-sm text-foreground/80">Interactive electricity usage & sustainability insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 slide-in-right">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Real-time Status Indicator */}
              <div className="flex items-center space-x-2 transition-smooth">
                {isRealTimeConnected && !isUsingFallback ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-600 transition-smooth" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full pulse-soft"></div>
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
                    </div>
                  </>
                ) : isUsingFallback ? (
                  <>
                    <WifiOff className="w-4 h-4 text-amber-500 transition-smooth" />
                    <span className="text-sm text-amber-600">Fallback</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-foreground/60 transition-smooth" />
                    <span className="text-sm text-foreground/60">Static</span>
                  </>
                )}
              </div>

              <div className="fade-in stagger-2">
                <MapControls
                  mapStyle={mapStyle}
                  setMapStyle={setMapStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* API Configuration Notice */}
        <div className="mb-6 fade-in">
          <ApiConfigurationNotice
            isApiConfigured={dataSourceInfo.isApiConfigured}
            isUsingRealApi={dataSourceInfo.isUsingRealApi}
          />
        </div>

        {mapData && (
          <div className="fade-in-up stagger-1">
            <StatsOverview
              data={mapData.state_totals}
              counties={mapData.counties}
            />
          </div>
        )}

        <div className="space-y-6 mt-6">
          {/* Carbon Footprint Card - Horizontal Layout */}
          {showPanel && selectedCounty && (
            <div className="slide-in-right">
              <CarbonFootprintCard
                county={selectedCounty}
                onShowModal={() => setShowCarbonModal(true)}
              />
            </div>
          )}

          {/* County Details Card - Horizontal Layout */}
          {showPanel && selectedCounty && (
            <div className="slide-in-left stagger-1">
              <CountyDetailsPanel
                county={selectedCounty}
                onClose={() => setShowPanel(false)}
              />
            </div>
          )}

          {/* Map - Full Width */}
          <div className="fade-in-scale stagger-2">
            <Card className="overflow-hidden shadow-xl border-0 bg-card backdrop-blur hover-lift">
              <CardContent className="p-0">
                <div className="h-[600px] relative map-tint">
                  <MapContainer
                    center={[34.0489, -111.0937]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution="&copy; OpenStreetMap &copy; CARTO"
                    />
                    
                    {mapData?.counties.map((county, index) => {
                      if (!county.coordinates || typeof county.coordinates.lat !== 'number' || typeof county.coordinates.lng !== 'number') {
                        return null;
                      }

                      const value = mapStyle === 'consumption' ? county.consumption_per_capita :
                                    mapStyle === 'renewable' ? county.renewable_percentage :
                                    county.sustainability_score;
                                    
                      const radius = Math.max(8, Math.sqrt(county.consumption_mwh / 20000));

                      return (
                        <CircleMarker
                          key={index}
                          center={[county.coordinates.lat, county.coordinates.lng]}
                          pathOptions={{
                            fillColor: getColorByValue(value, mapStyle),
                            color: 'white',
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.8
                          }}
                          radius={radius}
                          eventHandlers={{
                            click: () => {
                              handleCountyClick(county);
                            },
                            mouseover: (e) => {
                              const marker = e.target;
                              marker.setStyle({
                                weight: 3,
                                fillOpacity: 1,
                                color: '#3b82f6'
                              });
                            },
                            mouseout: (e) => {
                              const marker = e.target;
                              marker.setStyle({
                                weight: 2,
                                fillOpacity: 0.8,
                                color: 'white'
                              });
                            }
                          }}
                        >
                          <Tooltip>
                            <div className="p-2 bg-card/95 backdrop-blur rounded-lg shadow-lg border-0">
                              <h4 className="font-bold text-foreground mb-1">{county.name} County</h4>
                              <div className="text-xs text-slate-600 space-y-0.5">
                                <p>Population: {formatNumber(county.population)}</p>
                                <p>Consumption: {formatNumber(county.consumption_mwh)} MWh</p>
                                <p>Renewable: {county.renewable_percentage}%</p>
                              </div>
                              <p className="text-xs text-primary mt-2 font-medium">Click for details →</p>
                            </div>
                          </Tooltip>
                        </CircleMarker>
                      );
                    })}
                    
                    <ZoomControl position="topright" />
                  </MapContainer>
                  
                  <MapLegend mapStyle={mapStyle} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="fade-in-up stagger-3">
          <DataSources
            sources={mapData?.data_sources}
            lastUpdated={lastUpdated || undefined}
            isRealTime={isRealTimeConnected}
            isUsingFallback={isUsingFallback}
          />
        </div>
      </div>

      {/* Carbon Reduction Modal - Full Page Overlay */}
      {selectedCounty && (
        <CarbonReductionModal
          county={selectedCounty}
          isOpen={showCarbonModal}
          onClose={() => setShowCarbonModal(false)}
        />
      )}
    </div>
  );
}
