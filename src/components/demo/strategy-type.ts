// Types for strategy calculations
export interface MetricValue {
  value: number;
  monthlyGrowth: number;
  cap: number;
}

export interface FunnelMetrics {
  reachRate: MetricValue;
  engagementRate: MetricValue;
  conversionRate: MetricValue;
  purchaseRate: MetricValue;
}

export interface YearlyProjections {
  y2025: number;
  y2026: number;
  y2027: number;
  y2028: number;
  y2029: number;
}

export interface ScenarioData {
  potentialReach: number;
  metrics: FunnelMetrics;
  yearlyProjections: YearlyProjections;
}

export interface ScenarioStore {
  [key: string]: ScenarioData;
}

export const DEFAULT_METRICS: FunnelMetrics = {
  reachRate: { value: 50, monthlyGrowth: 1, cap: 70 },
  engagementRate: { value: 8, monthlyGrowth: 0.5, cap: 10 },
  conversionRate: { value: 5, monthlyGrowth: 0.2, cap: 10 },
  purchaseRate: { value: 5, monthlyGrowth: 0.5, cap: 10 }
};

export const calculateMonthlyProgression = (
  startRate: number,
  monthlyIncrease: number,
  cap: number,
  months: number
): number[] => {
  const rates = [startRate];
  
  for (let i = 1; i < months; i++) {
    // Apply compound growth based on previous month's rate
    const previousRate = rates[i - 1];
    const growth = monthlyIncrease /100 ; // Convert percentage to decimal
    const nextRate = Math.min(
      previousRate * (1 + growth),
      cap
    );
    rates.push(nextRate);
  }
  
  return rates;
};

export const calculateFunnelMetrics = (
  potentialReach: number,
  metrics: FunnelMetrics,
  month: number = 1 // Default to first month if not specified
) => {
  // Calculate compounded rates for the specified month
  const reachRate = calculateMonthlyProgression(
    metrics.reachRate.value / 100,
    metrics.reachRate.monthlyGrowth,
    metrics.reachRate.cap / 100,
    month + 1
  )[month];


  const engagementRate = calculateMonthlyProgression(
    metrics.engagementRate.value / 100,
    metrics.engagementRate.monthlyGrowth,
    metrics.engagementRate.cap / 100,
    month + 1
  )[month];

  const conversionRate = calculateMonthlyProgression(
    metrics.conversionRate.value / 100,
    metrics.conversionRate.monthlyGrowth,
    metrics.conversionRate.cap / 100,
    month + 1
  )[month];

  const purchaseRate = calculateMonthlyProgression(
    metrics.purchaseRate.value / 100,
    metrics.purchaseRate.monthlyGrowth,
    metrics.purchaseRate.cap / 100,
    month + 1
  )[month];

  // Calculate funnel metrics using compounded rates
  const reach = Math.round(potentialReach * reachRate);
  const microConversions = Math.round(reach * engagementRate);
  const leads = Math.round(microConversions * conversionRate);
  const sales = Math.round(leads * purchaseRate);

  return { reach, microConversions, leads, sales };
};

export const calculateMonthlyAcquisitionRate = (potentialReach: number,salesReach: number): number => {
  console.log(salesReach, potentialReach)
  return salesReach / potentialReach
};

export const calculateYearlyProjections = (
  potentialReach: number,
  metrics: FunnelMetrics | null
): YearlyProjections => {
  if (!metrics) {
    return { y2025: 0, y2026: 0, y2027: 0, y2028: 0, y2029: 0 };
  }

  const years = ['y2025', 'y2026', 'y2027', 'y2028', 'y2029'];
  const monthsPerYear = 12;

  return years.reduce((acc, year, yearIndex) => {
    // Calculate monthly rates for current year
    const monthlyRates = Array(monthsPerYear)
      .fill(0)
      .map((_, month) => 
        calculateMonthlyAcquisitionRate(potentialReach,metrics.purchaseRate.value)
      );

    // Calculate average rate for the year
    const averageRate = monthlyRates.reduce((a, b) => a + b) / monthsPerYear;
    
    // Calculate yearly projection
    acc[year] = Math.round(potentialReach * averageRate * 12);
    
    return acc;
  }, {} as YearlyProjections);
};


interface RevenueByYear {
  [year: number]: number;
}

export function calculateRevenueProjection(
  historicalRevenue: number[],
  startYear: number,
  futureYears: number[]
): RevenueByYear {
  // Input validation
  if (!historicalRevenue.length || !futureYears.length) {
    return {};
  }

  const result: RevenueByYear = {};
  
  // Add historical data to result
  historicalRevenue.forEach((revenue, index) => {
    result[startYear + index] = revenue;
  });

  if (historicalRevenue.length < 2) {
    // If we only have one year of history, assume same revenue for future
    futureYears.forEach(year => {
      result[year] = historicalRevenue[0];
    });
    return result;
  }

  // Calculate year-over-year growth rates
  const growthRates = [];
  for (let i = 1; i < historicalRevenue.length; i++) {
    const growthRate = (historicalRevenue[i] - historicalRevenue[i - 1]) / historicalRevenue[i - 1];
    growthRates.push(growthRate);
  }

  // Calculate weighted growth rate (giving more weight to recent years)
  const weightedGrowthRate = growthRates.reduce((sum, rate, index) => {
    const weight = (index + 1) / growthRates.reduce((s, _, i) => s + i + 1, 0);
    return sum + (rate * weight);
  }, 0);

  // Generate projections
  let lastValue = historicalRevenue[historicalRevenue.length - 1];
  let lastYear = startYear + historicalRevenue.length - 1;

  futureYears.forEach(year => {
    const yearsFromLastHistorical = year - lastYear;
    const projectedRevenue = lastValue * Math.pow(1 + weightedGrowthRate, yearsFromLastHistorical);
    result[year] = Math.round(projectedRevenue);
  });

  return result;
}