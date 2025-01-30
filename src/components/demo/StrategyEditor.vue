<template>
  <div class="row">
    <div class="col-3">
      <StrategyPanel @close-panel="closePanel"></StrategyPanel>
    </div>
    <div class="col-9">
      <q-card bordered flat class="q-mx-md q-px-md q-mt-md q-pb-md">
        <q-card-section class="row justify-between items-end q-pb-none q-px-none">
          <div class="row items-center">
            <q-select
              v-model="selectedChart"
              :options="chartOptions"
              dense
              borderless
              options-dense
              dropdown-icon="expand_more"
            />
          </div>
          <div class="row items-end q-gutter-x-md">
            <q-input
              v-model.number="revenuePerSale"
              type="number"
label="Revenu par Vente"
              dense
              outlined
              :min="0"
              prefix="$"
              class="q-pb-none"
:rules="[val => val > 0 || 'Veuillez entrer une valeur supérieure à 0']"
              style="width: 200px"
            >
              <template v-slot:append>
                <q-icon name="paid" />
              </template>
            </q-input>
            <CustomDateRange></CustomDateRange>
          </div>
        </q-card-section>
        <StrategyChart :table-data="computedRows"></StrategyChart>
      </q-card>
      
      <div class="q-pa-md">
        <CTable
          :columns="columns"
          :rows="computedRows"
          v-model="selected"
        >
          <template #cell-scenario="props">
            <div class="row items-center">
              {{ props.row.scenario }}
            </div>
          </template>

          <template #cell-potentialReach="props">
            <q-select
              v-model="scenarioReach[props.row.scenario.toLowerCase()]"
              :options="reachOptions"
              dense
              options-dense
              @update:model-value="updateScenarioStore(props.row.scenario.toLowerCase())"
              style="width: 150px"
            >
              <template #selected>
                {{ formatNumber(props.row.potentialReach) }}
              </template>
            </q-select>
          </template>

          <template #cell-acquisitionRate="props">
            <q-btn
              class=""
              dense
              @click="handleAcquisitionRateClick(props.row)"
              :label="formatPercentage(props.row.acquisitionRate) "
              icon-right="fa fa-chevron-down"
            >
            </q-btn>
          </template>
        </CTable>
      </div>
      
      <FunnelMetricsDialog
        v-model="showFunnelDialog"
        :selected-row="selectedRow"
        :current-metrics="getCurrentMetrics"
        @save="handleMetricsUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import StrategyChart from './atlasComponent/chart/StrategyChart.vue'
import CustomDateRange from './atlasComponent/CustomDateRange.vue'
import StrategyPanel from './atlasComponent/sidePanel/StrategyPanel.vue'
import FunnelMetricsDialog from './atlasComponent/FunnelMetricDialog.vue'
import { 
  type ScenarioStore,
  type ScenarioData,
  DEFAULT_METRICS,
  calculateFunnelMetrics,
  calculateYearlyProjections,
  calculateMonthlyAcquisitionRate
} from './strategy-type'

const scenarioReach = reactive({
  optimist: 50000,
  realistic: 42500,
  pessimist: 35000
})

const reachOptions = [
  10000, 25000, 35000, 42500, 50000, 75000, 100000
]

const emit = defineEmits(['closePanel'])

const selectedChart = ref('Revenue')
const chartOptions = ['Revenue', 'Savings', 'LTV', 'Customer']
const revenuePerSale = ref(5000)
const showFunnelDialog = ref(false)
const selectedRow = ref(null)
const selected = ref([])

const initializeScenario = (reach: number) => ({
  potentialReach: reach,
  metrics: { ...DEFAULT_METRICS },
  yearlyProjections: calculateYearlyProjections(reach, DEFAULT_METRICS)
})

const scenarioStore = reactive<ScenarioStore>({
  optimist: initializeScenario(scenarioReach.optimist),
  realistic: initializeScenario(scenarioReach.realistic),
  pessimist: initializeScenario(scenarioReach.pessimist)
})

const updateScenarioStore = (scenario: 'optimist' | 'realistic' | 'pessimist') => {
  scenarioStore[scenario] = initializeScenario(scenarioReach[scenario])
}

const columns = [
  {
    name: 'scenario',
label: 'Scénario',
    field: 'scenario',
    align: 'left',
    style: 'min-width: 120px'
  },
  {
    name: 'potentialReach',
label: 'Portée Potentielle',
    field: 'potentialReach',
    align: 'center',
    style: 'min-width: 150px'
  },
  {
    name: 'acquisitionRate',
label: 'Taux d’Acquisition (TA)',
    field: 'acquisitionRate',
    align: 'center',
    style: 'min-width: 150px'
  },
  {
    name: 'reach',
label: 'Portée',
    field: 'reach',
    align: 'center',
    format: (val: number) => formatNumber(val),
    style: 'min-width: 100px'
  },
  {
    name: 'microConversions',
label: 'Micro Conversions',
    field: 'microConversions',
    align: 'center',
    format: (val: number) => formatNumber(val),
    style: 'min-width: 150px'
  },
  {
    name: 'leads',
label: 'Prospects',
    field: 'leads',
    align: 'center',
    format: (val: number) => formatNumber(val),
    style: 'min-width: 100px'
  },
  {
    name: 'sales',
label: 'Ventes',
    field: 'sales',
    align: 'center',
    format: (val: number) => formatNumber(val),
    style: 'min-width: 100px'
  },
  {
    name: 'revenue',
label: 'Revenu',
    field: 'revenue',
    align: 'center',
    format: (val: number) => `$${formatNumber(val)}`,
    style: 'min-width: 150px'
  }
]

const getCurrentMetrics = computed(() => {
  if (!selectedRow.value) return null
  const scenarioKey = selectedRow.value.scenario.toLowerCase()
  return scenarioStore[scenarioKey].metrics
})

const computedRows = computed(() => {
  return Object.entries(scenarioReach).map(([scenario, reach]) => {
    const scenarioData = scenarioStore[scenario]
    
    const monthlyValues = Object.values(scenarioData?.metrics || {}).map(m => m.value / 100)
    const funnelMetrics = calculateFunnelMetrics(reach, scenarioData.metrics)
    const acquisitionRate = calculateMonthlyAcquisitionRate(reach, funnelMetrics.sales)
    
    const yearlyProjection = scenarioData?.yearlyProjections?.y2025 || 0
    
    return {
      scenario: scenario.charAt(0).toUpperCase() + scenario.slice(1),
      potentialReach: reach,
      acquisitionRate,
      ...funnelMetrics,
      revenue: funnelMetrics.sales * revenuePerSale.value,
      borderColor:getScenarioColor(scenario.charAt(0).toUpperCase() + scenario.slice(1))

    }
  })
})

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(3)}%`
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value)
}

const getScenarioColor = (scenario: string): string => {
  const colors = {
    'Optimist': '#4CAF50',
    'Realistic': '#FFC107',
    'Pessimist': '#F44336'
  }
  return colors[scenario] || '#E0E0E0'
}

const handleAcquisitionRateClick = (row) => {
  selectedRow.value = row
  showFunnelDialog.value = true
}

const handleMetricsUpdate = ({ metrics, yearlyProjections }) => {
  if (!selectedRow.value) return
  
  const scenarioKey = selectedRow.value.scenario.toLowerCase()
  
  const updatedScenario = {
    ...scenarioStore[scenarioKey],
    metrics: { ...metrics },
    yearlyProjections: { ...yearlyProjections }
  }
  
  scenarioStore[scenarioKey] = updatedScenario
  showFunnelDialog.value = false
}

const closePanel = () => {
  emit('closePanel')
}
</script>

<style scoped>
.hover-highlight:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.cursor-pointer {
  cursor: pointer;
  padding: 4px 8px;
}

:deep(.q-field__control) {
  height: 32px;
}

:deep(.q-field__marginal) {
  height: 32px;
}
</style>
