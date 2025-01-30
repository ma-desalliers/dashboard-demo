<template>
  <q-card flat class="">
    <q-card-section>
      <div style="height: 400px">
        <component 
          v-if="mounted"
          :is="chart"
          type="line"
          height="100%"
          :options="chartOptions"
          :series="computedSeries"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'

interface TableRow {
  scenario: string;
  potentialReach: number;
  acquisitionRate: number;
  reach: number;
  microConversions: number;
  leads: number;
  sales: number;
  revenue: number; 
}

const props = defineProps<{
  tableData: TableRow[];
}>()

const mounted = ref(false)
const chart = ref(null)
const selectedScenario = ref('all')

const scenarioOptions = computed(() => [
  { label: 'All Scenarios', value: 'all' },
  ...props.tableData.map(row => ({
    label: row.scenario,
    value: row.scenario.toLowerCase()
  }))
])

const months = [
  'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 
  'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 
  'Dec 2025', 'Jan 2026'
]

const generateSeriesData = (row: TableRow) => {
  const baseValue = row.revenue; // Changed from row.potentialReach * row.acquisitionRate
  return months.map((_, index) => {
    return Math.round(baseValue * Math.pow(1.03, index));
  })
}
const getScenarioColor = (scenario: string): string => {
  switch (scenario) {
    case 'Optimist':
      return '#4CAF50'
    case 'Realistic':
      return '#FFC107'
    case 'Pessimist':
      return '#F44336'
    default:
      return '#E0E0E0'
  }
}

const computedSeries = computed(() => {
  const allSeries = props.tableData.map(row => ({
    name: row.scenario,
    data: generateSeriesData(row),
    color: getScenarioColor(row.scenario)
  }))

  if (selectedScenario.value === 'all') {
    return allSeries
  }
  
  return allSeries.filter(s => s.name.toLowerCase() === selectedScenario.value)
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    borderColor: '#e0e0e0',
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    categories: months,
    labels: {
      rotate: 0
    }
  },
  yaxis: {
    title: {
      text: 'Revenue ($)'  // Add this to show what the y-axis represents
    },
    labels: {
      formatter: (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      }
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  },
  tooltip: {
    y: {
      title: {
        formatter: (seriesName: string) => 'Revenue:'
      },
      formatter: (value: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      }
    }
  },
  dataLabels: {
    enabled: false
  }
}))

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const VueApexCharts = await import('vue3-apexcharts')
    chart.value = markRaw(VueApexCharts.default)
    mounted.value = true
  }
})
</script>