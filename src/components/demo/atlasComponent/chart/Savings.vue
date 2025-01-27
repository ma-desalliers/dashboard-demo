<template>
  <q-card flat class="">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <!--<div class="col-12 col-md-4">
          <q-select
            v-model="selectedView"
            :options="viewOptions"
            label="View Type"
            outlined
            dense
          />
        </div>-->
      </div>
      
    </q-card-section>

    <q-card-section>
      <div style="height: 400px">
        <component 
          v-if="mounted"
          :is="chart"
          type="bar"
          height="100%"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'

const mounted = ref(false)
const chart = ref(null)
const selectedView = ref('cumulative')

const viewOptions = [
  { label: 'Cumulative', value: 'cumulative' },
  { label: 'Yearly', value: 'yearly' }
]

const initialCategories = [
  {
    id: 'google-ads',
    name: 'Google Ads Management',
    directMonthlySaving: 2000,
    indirectMonthlySaving: 1000,
    growthRate: 0.05,
  },
  {
    id: 'marketing-hire',
    name: 'Marketing Personnel',
    directMonthlySaving: 5000,
    indirectMonthlySaving: 2500,
    growthRate: 0.03,
  },
  {
    id: 'automation',
    name: 'Process Automation',
    directMonthlySaving: 3000,
    indirectMonthlySaving: 4000,
    growthRate: 0.04,
  }
]

const startYear = 2025
const yearRange = 10

const formatCurrency = (value: number): string => {
  const roundedValue = Math.round(value / 1000) * 1000
  if (roundedValue >= 1000000) {
    return `$${Math.round(roundedValue / 100000) / 10}M`
  }
  return `$${Math.round(roundedValue / 1000)}K`
}

const generateData = () => {
  const yearlyData = []
  let cumulativeDirect = 0
  let cumulativeIndirect = 0

  for (let yearOffset = 0; yearOffset < yearRange; yearOffset++) {
    const yearDirectSavings = initialCategories.reduce((sum, category) => {
      return sum + (category.directMonthlySaving * 12 * Math.pow(1 + category.growthRate, yearOffset))
    }, 0)

    const yearIndirectSavings = initialCategories.reduce((sum, category) => {
      return sum + (category.indirectMonthlySaving * 12 * Math.pow(1 + category.growthRate, yearOffset))
    }, 0)

    cumulativeDirect += yearDirectSavings
    cumulativeIndirect += yearIndirectSavings

    yearlyData.push({
      year: startYear + yearOffset,
      directSavings: yearDirectSavings,
      indirectSavings: yearIndirectSavings,
      directCumulative: cumulativeDirect,
      indirectCumulative: cumulativeIndirect
    })
  }

  return yearlyData
}

const data = ref(generateData())

const series = computed(() => {
  const isYearly = selectedView.value === 'yearly'
  return [
    {
      name: 'Direct Savings',
      data: data.value.map(d => isYearly ? d.directSavings : d.directCumulative)
    },
    {
      name: 'Indirect Savings',
      data: data.value.map(d => isYearly ? d.indirectSavings : d.indirectCumulative)
    }
  ]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false
    }
  },
  colors: ['#2E7D32', '#A5D6A7'],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    }
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
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: data.value.map(d => d.year)
  },
  yaxis: {
    labels: {
      formatter: formatCurrency
    }
  },
  tooltip: {
    y: {
      formatter: formatCurrency
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left'
  }
}))

const metrics = computed(() => {
  const lastEntry = data.value[data.value.length - 1]
  const totalSavings = selectedView.value === 'yearly'
    ? lastEntry.directSavings + lastEntry.indirectSavings
    : lastEntry.directCumulative + lastEntry.indirectCumulative
  
  const yearlyAvg = totalSavings / (selectedView.value === 'yearly' ? 1 : data.value.length)
  const monthlyAvg = yearlyAvg / 12
  const initialCost = 100000
  const paybackMonths = monthlyAvg > 0 ? Math.ceil(initialCost / monthlyAvg) : 0

  return {
    paybackMonths,
    totalSavings,
    yearlyAvg
  }
})

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const VueApexCharts = await import('vue3-apexcharts')
    chart.value = markRaw(VueApexCharts.default)
    mounted.value = true
  }
})
</script>