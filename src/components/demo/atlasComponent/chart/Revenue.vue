<template>

  <div style="height: 400px">
    <component 
      v-if="mounted" 
      :is="chart" 
      type="bar" 
      height="100%" 
      :options="chartOptions" 
      :series="chartSeries" 
    />
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw, watch } from 'vue'

interface ScenarioData {
  y2025: number
  y2026: number
  y2027: number
  y2028: number
  y2029: number
}

interface TableData {
  name: string
  selected: boolean
  scenarios: {
    best: ScenarioData
    realistic: ScenarioData
    pessimistic: ScenarioData
  }
  selectedScenario: string
  [key: string]: any
}

const props = defineProps<{
  tableData: TableData[]
}>()

const mounted = ref(false)
const chart = ref(null)

// Combined historical and projected base revenue
const baseRevenue = computed(()=>{
return calculateRevenueProjection([750000,825000,907500,998250,1098075],[2020,2021,2022,2023,2024,2025,2026,2027,2028,2029])

})

const chartSeries = computed(() => {
  if (!props.tableData) return []
  
  const selectedStrategies = props.tableData.filter(strategy => strategy.selected)
  
  // Base revenue series (includes both historical and projected)
  const baseRevenueSeries = {
    name: 'Revenue',
    data: [
      baseRevenue.value[2020],
      baseRevenue.value[2021],
      baseRevenue.value[2022],
      baseRevenue.value[2023],
      baseRevenue.value[2024],
      baseRevenue.value[2025],
      baseRevenue.value[2026],
      baseRevenue.value[2027],
      baseRevenue.value[2028],
      baseRevenue.value[2029]
    ],
    color: '#4B5563'
  }

  // Combine all strategies into one series
  const combinedStrategiesData = [2025, 2026, 2027, 2028, 2029].map(year => {
    const yearKey = `y${year}`
    return selectedStrategies.reduce((sum, strategy) => 
      sum + (strategy.scenarios[strategy.selectedScenario][yearKey] || 0), 0)
  })

  const strategySeries = {
    name: 'Strategies',
    data: [
      null,
      null,
      null,
      null,
      null,
      ...combinedStrategiesData
    ],
    color: 'var(--q-primary)' // Green color for combined strategies
  }

  return [baseRevenueSeries, strategySeries]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'linear',
      speed: 250,
      animationType: 'Y',
      dynamicAnimation: {
        enabled: true,
        speed: 250,
        animationType: 'Y'
      },
      initialAnimation: {
        enabled: false,
         animationType: 'Y'
      },
      updateAnimation: {
        enabled: true,
        animationType: 'Y'
      },
      animateGradually: {
        enabled: true,
         animationType: 'Y'
      }
    }
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(value: number, { seriesIndex, dataPointIndex, w }: any) {
      if (seriesIndex === 0 && value > 0) {
        const baseValue = w.globals.series[1][dataPointIndex]
        const percentage = ((baseValue / value) * 100).toFixed(1)
        if(percentage == '0.0') return ''
        return `+${percentage}%`
      }
      return ''
    },
    style: {
      fontSize: '14px',
      colors: ['#ffffff']
    },
    offsetY: 0,
    textAnchor: 'middle',
    position:'top',
    animationDuration: 0
  },
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    },
    active: {
      filter: {
        type: 'none'
      }
    }
  },
  xaxis: {
    categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
        colors: Array(10).fill('#777777')
      }
    },
    title: {
      text: 'Year',
      style: {
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'inherit',
        colors: ['#666666']
      }
    },
    axisBorder: {
      show: true
    }
  },
  yaxis: {
    max: 6000000,
    forceNiceScale: true,
    labels: {
      formatter: (value: number) => formatYAxisCurrency(value),
      style: {
        colors: '#777777'
      }
    },
    title: {
      text: 'Annual Revenue',
      style: {
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'inherit'
      },
      rotate: -90
    }
  },
  legend: { show: true },
  grid: { 
    strokeDashArray: 0,
    xaxis: {
      lines: { show: false }
    }
  },
  tooltip: {
    enabled: true,
    shared: false,
    intersect: true,
    animation: {
      enabled: false
    },
    followCursor: false,
    marker: {
      show: false,
    },
    custom: undefined,
    x: {
      show: true,
    },
    y: {
      title: {
        formatter: (seriesName: string) => {
          if(seriesName == 'Strategies') return ''
          return seriesName
        }
      },
      formatter: function(value: number, { seriesIndex, dataPointIndex, w }: any) {
        if (seriesIndex === 1 && value > 0) {
          const baseValue = w.globals.series[0][dataPointIndex]
          const totalValue = value + baseValue
          const percentage = ((value / baseValue) * 100).toFixed(1)
          
          return [
            `<span style="font-weight:400">Strategies</span> $${value.toLocaleString('en-US', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            })}`,
            `<span style="font-weight:400">Total:</span> $${totalValue.toLocaleString('en-US', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1
            })}`,
            `<span style="font-weight:400">Increase:</span> +${percentage}%`
          ].join('</br>')
        }
        return `$${value.toLocaleString('en-US', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1
                })}` // Return empty string for non-strategy series
      }
    },
    items: {
      display: 'flex',
    },
    fixed: {
      enabled: false,
      position: 'topRight',
      offsetX: 0,
      offsetY: 0,
    },
    style: {
      fontSize: '12px',
      fontFamily: 'inherit',
    },
    theme: 'light',
    onDatasetHover: {
      highlightDataSeries: false,
    }
  },
}))

function formatYAxisCurrency(value: number) {
 // const chartValue = value ''
  return `$${(value / 1000000).toFixed(1)}M`
}



interface RevenueByYear {
  [year: number]: number;
}

const calculateRevenueProjection = (
  historicalRevenue: number[],
  years: number[]
): RevenueByYear => {
  // Input validation
  if (!historicalRevenue.length || !years.length) {
    return {};
  }

  const result: RevenueByYear = {};

  // Add historical data to result for the matching years
  historicalRevenue.forEach((revenue, index) => {
    if (index < years.length) {
      result[years[index]] = revenue;
    }
  });

  // If we don't have enough historical data for growth calculation
  if (historicalRevenue.length < 2) {
    // Use the last known revenue for all future years
    years.forEach(year => {
      if (!result[year]) {
        result[year] = historicalRevenue[historicalRevenue.length - 1];
      }
    });
    return result;
  }

  // Calculate year-over-year growth rates
  const growthRates: number[] = [];
  for (let i = 1; i < historicalRevenue.length; i++) {
    const growthRate = (historicalRevenue[i] - historicalRevenue[i - 1]) / historicalRevenue[i - 1];
    growthRates.push(growthRate);
  }

  // Calculate weighted average growth rate (more weight to recent years)
  const weights = growthRates.map((_, index) => index + 1);
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const weightedGrowthRate = growthRates.reduce((sum, rate, index) => {
    return sum + (rate * weights[index] / weightSum);
  }, 0);

  // Generate projections
  let lastValue = historicalRevenue[historicalRevenue.length - 1];
  let lastHistoricalYear = years[historicalRevenue.length - 1];

  // Project future values
  years.slice(historicalRevenue.length).forEach(year => {
    const yearsFromLastHistorical = year - lastHistoricalYear;
    const projectedRevenue = lastValue * Math.pow(1 + weightedGrowthRate, yearsFromLastHistorical);
    result[year] = Math.round(projectedRevenue);
  });

  return result;
};


watch(() => props.tableData, () => {
  // Chart will automatically update due to computed properties
}, { deep: true })

onMounted(async () => {
  if (process.client) {
    const VueApexCharts = await import('vue3-apexcharts')
    chart.value = markRaw(VueApexCharts.default)
    mounted.value = true
  }
})
</script>

<style>
.apexcharts-xaxis-tick {
  display: none;
}
</style>