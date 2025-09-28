import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  ExternalLink,
  Sun,
  Home,
  Car,
  DollarSign,
  Calendar,
  MapPin,
  Zap,
  Thermometer,
  Wind,
  Building,
  Phone,
  Globe
} from 'lucide-react';
import { County } from '@/types';

interface CarbonReductionModalProps {
  county: County;
  isOpen: boolean;
  onClose: () => void;
}

export default function CarbonReductionModal({ county, isOpen, onClose }: CarbonReductionModalProps) {
  const [activeTab, setActiveTab] = useState<'programs' | 'seasonal' | 'immediate'>('programs');

  if (!isOpen) return null;

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };

  const season = getCurrentSeason();

  // Arizona-specific government programs and incentives
  const governmentPrograms = [
    {
      title: "Arizona Solar Energy Device Tax Credit",
      description: "25% state tax credit on solar installations (max $1,000, lifetime limit)",
      website: "https://azdor.gov/forms/tax-credits-forms/credit-solar-energy-devices",
      type: "State Tax Credit",
      deadline: "Ongoing (until 2025)"
    },
    {
      title: "Federal Residential Clean Energy Credit",
      description: "30% federal tax credit for solar installations - EXPIRES DEC 31, 2025",
      website: "https://www.irs.gov/credits-deductions/residential-clean-energy-credit",
      type: "Federal Tax Credit",
      deadline: "December 31, 2025"
    },
    {
      title: "DSIRE - Database of State Incentives",
      description: "Official comprehensive database of all Arizona energy incentives and rebates",
      website: "https://www.dsireusa.org/",
      type: "Incentive Database",
      deadline: "Ongoing"
    },
    {
      title: "APS Renewable Energy Riders",
      description: "Net billing and export credit programs for APS solar customers",
      website: "https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans/Renewable-Energy-Riders",
      type: "Utility Program",
      deadline: "Ongoing"
    },
    {
      title: "Arizona Weatherization Assistance Program",
      description: "Free energy efficiency upgrades for income-qualified households",
      website: "https://housing.az.gov/general-public/weatherization-assistance-program",
      type: "State Program",
      deadline: "Income-qualified"
    },
    {
      title: "Arizona Governor's Office - Clean Energy Hub",
      description: "State renewable energy programs and solar/wind tax credit information",
      website: "https://resilient.az.gov/clean-energy-hub/households/residential-solar-and-wind-energy-systems-tax-credit",
      type: "State Program",
      deadline: "Ongoing"
    }
  ];

  // Season-specific tips for Arizona
  const seasonalTips = {
    spring: [
      {
        icon: <Thermometer className="w-4 h-4" />,
        tip: "Service your AC before summer - clean filters, check refrigerant",
        savings: "10-15% on cooling costs"
      },
      {
        icon: <Sun className="w-4 h-4" />,
        tip: "Install shade structures on south/west windows before peak heat",
        savings: "5-20% on cooling"
      },
      {
        icon: <Home className="w-4 h-4" />,
        tip: "Seal air leaks around windows and doors before summer",
        savings: "10-30% on energy bills"
      },
      {
        icon: <Wind className="w-4 h-4" />,
        tip: "Use whole house fans during cool spring evenings",
        savings: "Reduce AC usage by 50%"
      }
    ],
    summer: [
      {
        icon: <Thermometer className="w-4 h-4" />,
        tip: "Set thermostat to 78°F when home, 85°F when away",
        savings: "6-8% per degree raised"
      },
      {
        icon: <Sun className="w-4 h-4" />,
        tip: "Close blinds/curtains during peak sun hours (10am-6pm)",
        savings: "10-25% on cooling"
      },
      {
        icon: <Zap className="w-4 h-4" />,
        tip: "Run major appliances during off-peak hours (7pm-12pm)",
        savings: "Time-of-use rate savings"
      },
      {
        icon: <Car className="w-4 h-4" />,
        tip: "Park in shade, use windshield covers to reduce cabin heat",
        savings: "Less AC load when driving"
      }
    ],
    fall: [
      {
        icon: <Home className="w-4 h-4" />,
        tip: "Switch to evaporative cooling when humidity drops below 55%",
        savings: "50-75% less energy than AC"
      },
      {
        icon: <Thermometer className="w-4 h-4" />,
        tip: "Open windows at night when temps drop below 75°F",
        savings: "Zero cooling costs"
      },
      {
        icon: <Sun className="w-4 h-4" />,
        tip: "Clean solar panels after dust storm season",
        savings: "10-25% more solar production"
      },
      {
        icon: <Building className="w-4 h-4" />,
        tip: "Schedule HVAC maintenance before winter heating season",
        savings: "10-15% efficiency improvement"
      }
    ],
    winter: [
      {
        icon: <Thermometer className="w-4 h-4" />,
        tip: "Lower water heater to 120°F, use programmable thermostat",
        savings: "5-10% on heating"
      },
      {
        icon: <Sun className="w-4 h-4" />,
        tip: "Open south-facing windows during sunny days for passive heating",
        savings: "Natural warming"
      },
      {
        icon: <Zap className="w-4 h-4" />,
        tip: "Peak solar production season - great time to install panels",
        savings: "Higher winter efficiency"
      },
      {
        icon: <Home className="w-4 h-4" />,
        tip: "Reverse ceiling fans to push warm air down",
        savings: "3-8% on heating costs"
      }
    ]
  };

  // Immediate actions based on county characteristics
  const getImmediateActions = () => {
    const actions = [];

    if (county.renewable_percentage < 20) {
      actions.push({
        action: "Switch to renewable energy plan",
        provider: "Contact your utility about 100% renewable options",
        impact: "50-80% carbon reduction",
        timeframe: "1-2 weeks"
      });
    }

    if (county.consumption_per_capita > 15) {
      actions.push({
        action: "Schedule energy audit",
        provider: "Contact your utility (APS, TEP, or SRP) or search for certified auditors",
        impact: "15-30% energy savings",
        timeframe: "1-4 weeks"
      });
    }

    actions.push({
      action: "Get solar quotes from certified installers",
      provider: "Compare quotes at EnergySage.com or contact local installers",
      impact: "50-90% electric bill reduction",
      timeframe: "2-6 months"
    });

    if (county.major_cities?.includes("Phoenix") || county.major_cities?.includes("Tucson")) {
      actions.push({
        action: "Check for cool roof rebates",
        provider: "City rebates for reflective roofing materials",
        impact: "10-15% cooling cost reduction",
        timeframe: "Next roof replacement"
      });
    }

    return actions;
  };

  const immediateActions = getImmediateActions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span>Reduce Your Carbon Footprint - {county.name} County</span>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            <Button
              variant={activeTab === 'programs' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('programs')}
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Programs & Rebates
            </Button>
            <Button
              variant={activeTab === 'seasonal' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('seasonal')}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Seasonal Tips
            </Button>
            <Button
              variant={activeTab === 'immediate' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('immediate')}
            >
              <Phone className="w-4 h-4 mr-1" />
              Take Action Now
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {activeTab === 'programs' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Arizona Government Programs & Incentives</h3>
              </div>

              <div className="grid gap-4">
                {governmentPrograms.map((program, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{program.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{program.description}</p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {program.type}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-500">Deadline: {program.deadline}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(program.website, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seasonal' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">
                  {season.charAt(0).toUpperCase() + season.slice(1)} Tips for Arizona
                </h3>
              </div>

              <div className="grid gap-3">
                {seasonalTips[season as keyof typeof seasonalTips].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="text-blue-600 mt-1">
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{tip.tip}</p>
                      <p className="text-xs text-green-700 mt-1">💰 Potential savings: {tip.savings}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Why These Tips Work in Arizona</h4>
                <p className="text-sm text-blue-800">
                  Arizona's desert climate requires specific strategies. Our {season} recommendations
                  account for extreme temperatures, low humidity, and high solar radiation typical
                  of the Sonoran Desert region.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'immediate' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Take Action Today</h3>
              </div>

              <div className="grid gap-4">
                {immediateActions.map((action, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-3">
                    <h4 className="font-semibold text-slate-900 mb-1">{action.action}</h4>
                    <p className="text-sm text-slate-600 mb-2">{action.provider}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-green-700 font-medium">Impact: {action.impact}</span>
                      <span className="text-blue-700">Timeline: {action.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Online Resources
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• <strong>Solar Calculator:</strong> <a href="https://pvwatts.nrel.gov/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">pvwatts.nrel.gov</a></li>
                    <li>• <strong>Energy Star:</strong> <a href="https://www.energystar.gov/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">energystar.gov</a></li>
                    <li>• <strong>Solar Quotes:</strong> <a href="https://www.energysage.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">energysage.com</a></li>
                    <li>• <strong>Home Energy Audits:</strong> <a href="https://www.energy.gov/energysaver/weatherize/energy-audits" target="_blank" rel="noopener noreferrer" className="underline hover:text-green-900">energy.gov</a></li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Contact Your Utility
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>APS:</strong> <a href="https://www.aps.com/en/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">aps.com/contact</a></li>
                    <li>• <strong>TEP:</strong> <a href="https://www.tep.com/contact/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">tep.com/contact</a></li>
                    <li>• <strong>SRP:</strong> <a href="https://www.srpnet.com/contact/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">srpnet.com/contact</a></li>
                    <li>• <strong>Find Local Solar:</strong> <a href="https://www.energysage.com/solar-quotes/" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">EnergySage.com</a></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}