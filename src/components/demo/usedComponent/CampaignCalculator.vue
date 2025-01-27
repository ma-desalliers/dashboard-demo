<template>
  <q-card flat class="full-width q-pa-md">
    <q-card-section class="q-px-none">
      <div class="text-h5 font-weight-bold">{{name}}</div>
      
      <div style="height: 400px" class="q-mt-md">
        <component 
          v-if="mounted"
          :is="chart"
          type="line"
          height="100%"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>

      <q-table
        :rows="scenarios"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 0 }"
        class="q-mt-lg"
      >
        <template v-slot:body-cell-startMonth="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.startMonth"
              :options="monthOptions"
              dense
              outlined
              options-dense
              emit-value
              map-options
              @update:model-value="updateScenario(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-adSpend="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.adSpend"
              :options="adSpendOptions"
              dense
              outlined
              options-dense
              emit-value
              map-options
              @update:model-value="updateScenario(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-cpc="props">
          <q-td :props="props">
            <q-select
              v-model="props.row.cpc"
              :options="cpcOptions"
              dense
              outlined
              options-dense
              emit-value
              map-options
              @update:model-value="updateScenario(props.row)"
            />
          </q-td>
        </template>

      
      </q-table>

     <!--<div class="q-mt-md row q-gutter-sm">
        <q-btn color="purple" icon="psychology" label="AI" />
        <q-btn color="primary" icon="add" label="New Scenario" @click="addScenario" />
      </div>--> 
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, markRaw } from 'vue'

const mounted = ref(false)
const chart = ref(null)

const props = defineProps<{
name:string,
}>()

const monthOptions = [
  { label: 'Feb', value: 'Feb' }
]

const adSpendOptions = [
  { label: '$5.0k', value: 5000 },
  { label: '$10.0k', value: 10000 }
]

const cpcOptions = [
  { label: '$3', value: 3 },
  { label: '$4', value: 4 },
  { label: '$5', value: 5 },
  { label: '$6', value: 6 }
]

const scenarios = ref([
  { id: 1,scenario:'Pessimist', startMonth: 'Feb', adSpend: 5000, cpc: 3, conversionRate: 5, closingRate: 50 },
  { id: 2,scenario:'Realist' , startMonth: 'Feb', adSpend: 10000, cpc: 3, conversionRate: 5, closingRate: 50 },
  { id: 3, scenario:'Optimist', startMonth: 'Feb', adSpend: 10000, cpc: 3, conversionRate: 5, closingRate: 50 }
])

const columns = [
  { name: 'scenario', label: 'Scenario', field: 'scenario', align: 'left' },
  { name: 'scenario', label: 'Starting Month', field: 'startMonth', align: 'left' },
  { name: 'adSpend', label: 'Ad Spend', field: 'adSpend', format:( val:any) => `$${val.toLocaleString()}` },
  { name: 'cpc', label: 'CPC', field: 'cpc', format:( val:any) => `$${val}` },
  { name: 'conversionRate', label: 'Conversion Rate', field: 'conversionRate', format:( val:any) => `${val}%` },
  { name: 'leads', label: 'Leads', field: (row:any) => Math.round((row.adSpend / row.cpc) * (row.conversionRate / 100)) },
  { name: 'closingRate', label: 'Closing Rate', field: 'closingRate', format:( val:any) => `${val}%` },
  { name: 'orders', label: 'Orders', field: (row:any) => Math.round((row.adSpend / row.cpc) * (row.conversionRate / 100) * (row.closingRate / 100)) },
  { name: 'roas', label: 'ROAS', field: (row:any) => {
    const orders = Math.round((row.adSpend / row.cpc) * (row.conversionRate / 100) * (row.closingRate / 100))
    return `$${(orders * 2000 - row.adSpend).toLocaleString()}`
  }},
]

const generateChartData = (scenario : any) => {
  const data = []
  let cumulativeROAS = 0
  
  for (let i = 0; i < 12; i++) {
    const orders = Math.round((scenario.adSpend / scenario.cpc) * (scenario.conversionRate / 100) * (scenario.closingRate / 100))
    const roas = orders * 2000 - scenario.adSpend
    cumulativeROAS += roas
    data.push(cumulativeROAS)
  }
  
  return data
}
const chartName = ['Pessimist', 'Realist', 'Optimist']
const chartSeries = computed(() => scenarios.value.map((scenario, index) => ({
  name: chartName[index],
  data: generateChartData(scenario)
})))

const chartOptions = computed(() => ({
  chart: {
    height: 400,
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  colors: ['#ff0000', '#0000ff', '#00ff00'],
  xaxis: {
    categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    title: { text: 'Month' }
  },
  yaxis: {
    title: { text: 'Return On Ad Spend (ROAS)' },
    labels: {
      formatter: value => `$${Math.round(value/1000)}k`
    }
  },
  tooltip: {
    y: {
      formatter: value => `$${value.toLocaleString()}`
    }
  }
}))

onMounted(async () => {
  if (process.client) {
    const VueApexCharts = await import('vue3-apexcharts')
    chart.value = markRaw(VueApexCharts.default)
    mounted.value = true
  }
})

const updateScenario = (scenario) => {
  const index = scenarios.value.findIndex(s => s.id === scenario.id)
  scenarios.value[index] = { ...scenario }
}

const addScenario = () => {
  const newId = Math.max(...scenarios.value.map(s => s.id)) + 1
  scenarios.value.push({
    id: newId,
    startMonth: 'Feb',
    adSpend: 5000,
    cpc: 3,
    conversionRate: 5,
    closingRate: 50
  })
}

const deleteScenario = (scenario) => {
  scenarios.value = scenarios.value.filter(s => s.id !== scenario.id)
}
</script>