<template>
  <q-card flat class="full-width q-pa-xs">
    <q-card-section class="q-px-none q-pt-none">
      <div style="height: 400px">
        <component v-if="mounted" :is="chart" type="bar" height="100%" :options="chartOptions" :series="chartSeries" />
      </div>

      <div class="row justify-between">
        <div class="row q-gutter-md">
          <div class="column q-col-gutter-xs">
            <span>Metric</span>
            <div>
              <q-btn-toggle v-model="selectedMetric" :options="[
                { label: 'Revenue', value: 'revenue' },
                { label: 'LTV', value: 'ltv' },
                { label: 'Clients', value: 'clients' }
              ]" spread unelevated class="bg-grey-2" active-class="bg-primary text-white" />
            </div>
          </div>
          <div class="column q-col-gutter-xs">
            <span>Scenario</span>
            <div>
              <q-btn-toggle unelevated v-model="selectedScenario" :options="[
                { label: 'Pessimist', value: 'pessimist' },
                { label: 'Realist', value: 'realist' },
                { label: 'Optimist', value: 'optimist' }
              ]" spread class="bg-grey-2" active-class="bg-primary text-white" />
            </div>
          </div>
        </div>
        <CustomDateRange></CustomDateRange>
      </div>

      <q-table :rows="campaigns" :columns="tableColumns" row-key="name" flat bordered :pagination="{ rowsPerPage: 0 }"
        class="q-mt-lg">
        <template v-slot:body-cell-select="props">
          <q-td :props="props">
            <q-checkbox v-model="props.row.selected" />
          </q-td>
        </template>
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="cursor-pointer" clickable @click="selectCampaign(props.row)">
            {{ props.row.name }}
          </q-td>
        </template>
        <template v-slot:body-cell-irg="props">
          <q-td :props="props">
            <q-chip :color="getIRGColor(props.row.irg)" text-color="white" dense>
              {{ props.row.irg }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, markRaw, watch } from 'vue'
import CustomDateRange from './CustomDateRange.vue'

const emit = defineEmits(['selectCampaign'])

const mounted = ref(false)
const chart = ref(null)
const selectedMetric = ref('revenue')
const selectedScenario = ref('realist')

const CHART_COLORS = {
  primary: '#64748B',
  secondary: '#4ADE80',
  tertiary: '#FCD34D'
}

const campaigns = ref([
  {
    name: 'Email Marketing',
    selected: true,
    irg: 9.2,
    roi: '119.0:1',
    scenarios: {
      pessimist: { y2025: 6426000, y2026: 7068600, y2027: 7711200 },
      realist: { y2025: 7140000, y2026: 7854000, y2027: 8568000 },
      optimist: { y2025: 7854000, y2026: 8639400, y2027: 9424800 }
    }
  },
  {
    name: 'Social Media',
    selected: false,
    irg: 6.7,
    roi: '47.0:1',
    scenarios: {
      pessimist: { y2025: 2538000, y2026: 2791800, y2027: 3045600 },
      realist: { y2025: 2820000, y2026: 3102000, y2027: 3384000 },
      optimist: { y2025: 3102000, y2026: 3412200, y2027: 3722400 }
    }
  },
  {
    name: 'SEO',
    selected: true,
    irg: 5.4,
    roi: '23.0:1',
    scenarios: {
      pessimist: { y2025: 1242000, y2026: 1366200, y2027: 1490400 },
      realist: { y2025: 1380000, y2026: 1518000, y2027: 1656000 },
      optimist: { y2025: 1518000, y2026: 1669800, y2027: 1821600 }
    }
  }
])

const tableColumns = computed(() => [
  { name: 'select', label: '', field: 'selected', align: 'center' },
  { name: 'name', label: 'Campaigns', field: 'name', align: 'left' },
  { name: 'irg', label: 'IRG', field: 'irg', align: 'center' },
  { name: 'roi', label: 'ROI', field: 'roi', align: 'center' },
  { 
    name: '2025', 
    label: '2025', 
    field: row => row.scenarios[selectedScenario.value].y2025,
    format: formatCurrency, 
    align: 'right' 
  },
  { 
    name: '2026', 
    label: '2026', 
    field: row => row.scenarios[selectedScenario.value].y2026,
    format: formatCurrency, 
    align: 'right' 
  },
  { 
    name: '2027', 
    label: '2027', 
    field: row => row.scenarios[selectedScenario.value].y2027,
    format: formatCurrency, 
    align: 'right' 
  }
])

const chartSeries = computed(() => {
  const selectedCampaigns = campaigns.value.filter(c => c.selected)
  const baseRevenue = [1000000, 1000000, 1100000, 1200000, 1300000, 1350000, 1400000]
  
  const growthRevenue = [0, 0, 0]
  const years = ['2025', '2026', '2027']
  years.forEach(year => {
    const yearTotal = selectedCampaigns.reduce((sum, campaign) => {
      return sum + campaign.scenarios[selectedScenario.value][`y${year}`]
    }, 0)
    growthRevenue.push(yearTotal * 0.7)
  })
  growthRevenue.push(growthRevenue[growthRevenue.length - 1] * 1.1)

  const optimisticRevenue = growthRevenue.map(val => val * 0.3)

  return [{
    name: 'Base Revenue',
    data: baseRevenue
  }, {
    name: 'Growth Revenue',
    data: growthRevenue
  }, {
    name: 'Optimistic Revenue',
    data: optimisticRevenue
  }]
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary],
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%'
    }
  },
  xaxis: {
    categories: ['2022', '2023', '2024', '2025', '2026', '2027', '2028'],
    labels: {
      formatter: (value) => value
    }
  },
  yaxis: {
    labels: {
      formatter: formatYAxisCurrency
    }
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: { strokeDashArray: 3 }
}))

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

function formatYAxisCurrency(value) {
  return `${(value / 1000000).toFixed(1)}M`
}

function getIRGColor(value) {
  if (value >= 9) return 'green'
  if (value >= 6) return 'orange'
  return 'red'
}

const selectCampaign = (campaign) => {
  emit('selectCampaign', campaign)
}

onMounted(async () => {
  if (process.client) {
    const VueApexCharts = await import('vue3-apexcharts')
    chart.value = markRaw(VueApexCharts.default)
    mounted.value = true
  }
})
</script>