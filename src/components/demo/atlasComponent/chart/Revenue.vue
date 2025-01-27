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
const baseRevenue = {
  2020: 750000,
  2021: 825000,
  2022: 907500,
  2023: 998250,
  2024: 1098075,
  2025: 1207882,
  2026: 1328670,
  2027: 1461537,
  2028: 1607691,
  2029: 1768460
}

const chartSeries = computed(() => {
  if (!props.tableData) return []
  
  const selectedStrategies = props.tableData.filter(strategy => strategy.selected)
  
  // Base revenue series (includes both historical and projected)
  const baseRevenueSeries = {
    name: 'Revenue',
    data: [
      baseRevenue[2020],
      baseRevenue[2021],
      baseRevenue[2022],
      baseRevenue[2023],
      baseRevenue[2024],
      baseRevenue[2025],
      baseRevenue[2026],
      baseRevenue[2027],
      baseRevenue[2028],
      baseRevenue[2029]
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
    color: '#10B981' // Green color for combined strategies
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
      speed: 150,
      animationType: 'Y',      // Keep vertical animation
      dynamicAnimation: {
        enabled: true,
        speed: 150,
        animationType: 'Y'     // Force vertical animation for updates too
      },
      initialAnimation: {
        enabled: false         // Disable initial animation
      },
      updateAnimation: {
        enabled: true,
        animationType: 'Y'     // Force vertical animation for updates
      },
      animateGradually: {
        enabled: false         // Disable gradual animations
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
      console.log(value,seriesIndex)
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
    animationDuration: 0  // Disable data label animations
  },
  states: {
    hover: {
      filter: {
        type: 'none'  // Disable hover animations
      }
    },
    active: {
      filter: {
        type: 'none'  // Disable active state animations
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
    animation: {
      enabled: false  // Disable tooltip animations
    },
    followCursor: false  // Disable cursor following animation
  }
}))

function formatYAxisCurrency(value: number) {
  return `$${(value / 1000000).toFixed(1)}M`
}

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