/**
 * Carbon Footprint Estimation Service
 * Converts energy usage data into carbon footprint metrics per household and per capita
 */

export interface CarbonFootprintEstimate {
  // Per household estimates
  householdCarbonTonsPerYear: number;
  householdCarbonKgPerMonth: number;
  householdCarbonPoundsPerDay: number;

  // Per capita estimates
  perCapitaCarbonTonsPerYear: number;
  perCapitaCarbonKgPerMonth: number;
  perCapitaCarbonPoundsPerDay: number;

  // Comparative metrics
  equivalentCarMilesPerYear: number;
  equivalentTreesNeeded: number;
  equivalentGasolineGallons: number;

  // Breakdown by source
  renewableImpactReduction: number; // percentage reduction due to renewables
  nonRenewableEmissions: number;
  renewableEmissions: number;
}

export interface CarbonIntensityFactors {
  // Carbon intensity by source (kg CO2 per MWh)
  coal: number;
  naturalGas: number;
  solar: number;
  wind: number;
  hydro: number;
  nuclear: number;
  average: number; // Grid average when source breakdown unavailable
}

export class CarbonFootprintService {
  // EPA and EIA emission factors (kg CO2 per MWh)
  private static readonly CARBON_INTENSITY: CarbonIntensityFactors = {
    coal: 820,        // kg CO2/MWh
    naturalGas: 490,  // kg CO2/MWh
    solar: 46,        // kg CO2/MWh (lifecycle)
    wind: 11,         // kg CO2/MWh (lifecycle)
    hydro: 24,        // kg CO2/MWh (lifecycle)
    nuclear: 12,      // kg CO2/MWh (lifecycle)
    average: 386      // US grid average kg CO2/MWh (2023)
  };

  // Conversion factors
  private static readonly CONVERSIONS = {
    KG_TO_TONS: 0.001,
    KG_TO_POUNDS: 2.20462,
    TONS_TO_CAR_MILES: 2404, // EPA: 1 metric ton CO2 = 2,404 miles driven by average car
    TONS_TO_TREES: 16.5,     // 1 mature tree absorbs ~60kg CO2/year = 16.5 trees per ton
    TONS_TO_GASOLINE: 113.4  // 1 metric ton CO2 = 113.4 gallons gasoline burned
  };

  // Average household size by state (US Census)
  private static readonly AVG_HOUSEHOLD_SIZE_ARIZONA = 2.65;

  /**
   * Calculate carbon footprint estimates for a county
   */
  static calculateCountyCarbonFootprint(
    consumptionMWh: number,
    population: number,
    renewablePercentage: number,
    carbonEmissionsTons?: number
  ): CarbonFootprintEstimate {
    // Calculate per capita and per household consumption
    const perCapitaConsumptionMWh = consumptionMWh / population;
    const estimatedHouseholds = population / this.AVG_HOUSEHOLD_SIZE_ARIZONA;
    const perHouseholdConsumptionMWh = consumptionMWh / estimatedHouseholds;

    // Calculate emissions using grid intensity if not provided
    let totalCarbonTons: number;
    if (carbonEmissionsTons) {
      totalCarbonTons = carbonEmissionsTons;
    } else {
      // Estimate based on energy mix
      const renewableFraction = renewablePercentage / 100;
      const nonRenewableFraction = 1 - renewableFraction;

      const renewableEmissionsKg = consumptionMWh * renewableFraction * this.CARBON_INTENSITY.solar;
      const nonRenewableEmissionsKg = consumptionMWh * nonRenewableFraction * this.CARBON_INTENSITY.average;

      totalCarbonTons = (renewableEmissionsKg + nonRenewableEmissionsKg) * this.CONVERSIONS.KG_TO_TONS;
    }

    // Per capita calculations
    const perCapitaCarbonTonsPerYear = totalCarbonTons / population;
    const perCapitaCarbonKgPerMonth = (perCapitaCarbonTonsPerYear * 1000) / 12;
    const perCapitaCarbonPoundsPerDay = (perCapitaCarbonTonsPerYear * 1000 * this.CONVERSIONS.KG_TO_POUNDS) / 365;

    // Per household calculations
    const householdCarbonTonsPerYear = totalCarbonTons / estimatedHouseholds;
    const householdCarbonKgPerMonth = (householdCarbonTonsPerYear * 1000) / 12;
    const householdCarbonPoundsPerDay = (householdCarbonTonsPerYear * 1000 * this.CONVERSIONS.KG_TO_POUNDS) / 365;

    // Comparative metrics (per capita)
    const equivalentCarMilesPerYear = perCapitaCarbonTonsPerYear * this.CONVERSIONS.TONS_TO_CAR_MILES;
    const equivalentTreesNeeded = perCapitaCarbonTonsPerYear * this.CONVERSIONS.TONS_TO_TREES;
    const equivalentGasolineGallons = perCapitaCarbonTonsPerYear * this.CONVERSIONS.TONS_TO_GASOLINE;

    // Impact of renewables
    const renewableFraction = renewablePercentage / 100;
    const renewableImpactReduction = renewableFraction * 100;

    // Breakdown by source
    const renewableEmissions = totalCarbonTons * renewableFraction * (this.CARBON_INTENSITY.solar / this.CARBON_INTENSITY.average);
    const nonRenewableEmissions = totalCarbonTons - renewableEmissions;

    return {
      householdCarbonTonsPerYear,
      householdCarbonKgPerMonth,
      householdCarbonPoundsPerDay,
      perCapitaCarbonTonsPerYear,
      perCapitaCarbonKgPerMonth,
      perCapitaCarbonPoundsPerDay,
      equivalentCarMilesPerYear,
      equivalentTreesNeeded,
      equivalentGasolineGallons,
      renewableImpactReduction,
      nonRenewableEmissions,
      renewableEmissions
    };
  }

  /**
   * Calculate personal carbon footprint based on household energy usage
   */
  static calculatePersonalFootprint(
    monthlyKWhUsage: number,
    renewablePercentage: number = 20 // Default Arizona grid mix
  ): CarbonFootprintEstimate {
    const annualMWhUsage = (monthlyKWhUsage * 12) / 1000;

    // Use single household for personal calculation
    return this.calculateCountyCarbonFootprint(
      annualMWhUsage,
      this.AVG_HOUSEHOLD_SIZE_ARIZONA, // Treat as single household
      renewablePercentage
    );
  }

  /**
   * Get carbon reduction potential from energy efficiency measures
   */
  static calculateEfficiencyImpact(
    currentConsumptionMWh: number,
    efficiencyPercentage: number,
    renewablePercentage: number
  ): {
    carbonSavedTons: number;
    dollarsSaved: number;
    carMilesEquivalent: number;
  } {
    const energySavedMWh = currentConsumptionMWh * (efficiencyPercentage / 100);

    // Calculate carbon saved
    const renewableFraction = renewablePercentage / 100;
    const gridIntensityKg = (1 - renewableFraction) * this.CARBON_INTENSITY.average +
                           renewableFraction * this.CARBON_INTENSITY.solar;
    const carbonSavedTons = energySavedMWh * gridIntensityKg * this.CONVERSIONS.KG_TO_TONS;

    // Estimate cost savings (average AZ residential rate ~13¢/kWh)
    const dollarsSaved = energySavedMWh * 1000 * 0.13;

    // Car miles equivalent
    const carMilesEquivalent = carbonSavedTons * this.CONVERSIONS.TONS_TO_CAR_MILES;

    return {
      carbonSavedTons,
      dollarsSaved,
      carMilesEquivalent
    };
  }
}