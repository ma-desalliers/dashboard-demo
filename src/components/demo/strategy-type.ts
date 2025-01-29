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
  reachRate: { value: 53, monthlyGrowth: 0.5, cap: 85 },
  engagementRate: { value: 53, monthlyGrowth: 0.5, cap: 85 },
  conversionRate: { value: 53, monthlyGrowth: 0.5, cap: 85 },
  purchaseRate: { value: 53, monthlyGrowth: 0.5, cap: 85 }
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

  console.log(reachRate)

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

export const calculateMonthlyAcquisitionRate = (metrics: FunnelMetrics, month: number): number => {
  // Calculate the compound rate for each metric at the specified month
  const rates = Object.values(metrics).map(metric => {
    const monthlyRates = calculateMonthlyProgression(
      metric.value / 100, // Convert initial percentage to decimal
      metric.monthlyGrowth,
      metric.cap / 100, // Convert cap percentage to decimal
      month + 1
    );
    return monthlyRates[month];
  });

  // Multiply all rates together to get the acquisition rate
  return rates.reduce((acc, rate) => acc * rate, 1);
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
        calculateMonthlyAcquisitionRate(metrics, yearIndex * monthsPerYear + month)
      );

    // Calculate average rate for the year
    const averageRate = monthlyRates.reduce((a, b) => a + b) / monthsPerYear;
    
    // Calculate yearly projection
    acc[year] = Math.round(potentialReach * averageRate * 12);
    
    return acc;
  }, {} as YearlyProjections);
};