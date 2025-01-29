<template>
  <div class="row">
    <div class="col-3">
      <StrategyPanel></StrategyPanel>
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
            <q-btn
              flat
              round
              color="primary"
              icon="edit"
              class="q-ml-md"
              @click="showFunnelDialog = true"
            >
              <q-tooltip>Edit Funnel Metrics</q-tooltip>
            </q-btn>
          </div>
          <CustomDateRange></CustomDateRange>
        </q-card-section>
        <StrategyChart :table-data="computedRows"></StrategyChart>
      </q-card>
      
      <div class="q-pa-md">
        <CTable
          :columns="columns"
          :rows="computedRows"
          v-model="selected"
        >
          <template #cell-acquisitionRate="props">
            <div 
              class="cursor-pointer hover-highlight c-border-primary"
              @click="handleAcquisitionRateClick(props.row)"
            >
              {{ formatPercentage(props.row.acquisitionRate) }}
            </div>
          </template>

          <template #cell-scenario="props">
            <div class="row items-center">
              <div 
                class="scenario-indicator q-mr-sm " 
                :style="{
                  backgroundColor: getScenarioColor(props.row.scenario),
                  width: '4px',
                  height: '20px',
                  borderRadius: '2px'
                }"
              ></div>
              {{ props.row.scenario }}
            </div>
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
import { ref, computed } from 'vue'
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

const POTENTIAL_REACH = {
  Optimist: 50000,
  Realistic: 42500,
  Pessimist: 35000
}

const selectedChart = ref('savings')
const chartOptions = ['Revenue', 'Savings', 'LTV', 'Customer']
const showFunnelDialog = ref(false)
const selectedRow = ref(null)
const selected = ref([])

// Initialize scenarios with metrics and projections
// Initialize each scenario with proper default values
const initializeScenario = (reach: number) => ({
  potentialReach: reach,
  metrics: { ...DEFAULT_METRICS },
  yearlyProjections: calculateYearlyProjections(reach, DEFAULT_METRICS)
})

// Instead of a simple ref
const scenarioStore = reactive<ScenarioStore>({
  optimist: initializeScenario(POTENTIAL_REACH.Optimist),
  realistic: initializeScenario(POTENTIAL_REACH.Realistic),
  pessimist: initializeScenario(POTENTIAL_REACH.Pessimist)
})

const columns = [
  {
    name: 'scenario',
    label: 'Scenario',
    field: 'scenario',
    align: 'left',
    style: 'min-width: 120px'
  },
  {
    name: 'potentialReach',
    label: 'Potential Reach',
    field: 'potentialReach',
    align: 'center',
    style: 'min-width: 120px'
  },
  {
    name: 'acquisitionRate',
    label: 'Acquisition Rate (AR)',
    field: 'acquisitionRate',
    align: 'center',
    style: 'min-width: 150px'
  },
  {
    name: 'reach',
    label: 'Reach',
    field: 'reach',
    align: 'center',
    style: 'min-width: 100px'
  },
  {
    name: 'microConversions',
    label: 'Micro Conversions',
    field: 'microConversions',
    align: 'center',
    style: 'min-width: 150px'
  },
  {
    name: 'leads',
    label: 'Leads',
    field: 'leads',
    align: 'center',
    style: 'min-width: 100px'
  },
  {
    name: 'sales',
    label: 'Sales',
    field: 'sales',
    align: 'center',
    style: 'min-width: 100px'
  }
]

const getCurrentMetrics = computed(() => {
  if (!selectedRow.value) return null
  const scenarioKey = selectedRow.value.scenario.toLowerCase()
  return scenarioStore[scenarioKey].metrics
})
// Compute the rows based on current metrics and scenarios
const computedRows = computed(() => {
  return Object.entries(POTENTIAL_REACH).map(([scenario, reach]) => {
    const scenarioKey = scenario.toLowerCase()
    // Remove .value since scenarioStore is now reactive
    const scenarioData = scenarioStore[scenarioKey]

    console.log(scenarioData.metrics.reachRate)
    
    // Calculate the actual acquisition rate based on metrics
    const monthlyValues = Object.values(scenarioData?.metrics || {}).map(m => m.value / 100)
    const acquisitionRate = calculateMonthlyAcquisitionRate(scenarioData?.metrics, 1) //  monthlyValues.length ? monthlyValues.reduce((acc, val) => acc * val, 1) : 0
    
    // Get yearly projection with proper null checking
    const yearlyProjection = scenarioData?.yearlyProjections?.y2025 || 0
    
    // Calculate funnel metrics using actual rates
    const funnelMetrics = calculateFunnelMetrics(reach, scenarioData.metrics)
    return {
      scenario,
      potentialReach: reach,
      acquisitionRate,
      ...funnelMetrics
    }
  })
})
const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
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
  console.log(scenarioKey)
  // Create a new scenario object with all the data
  const updatedScenario = {
    ...scenarioStore[scenarioKey],
    metrics: { ...metrics },
    yearlyProjections: { ...yearlyProjections }
  }
  
  // Update the store directly
  scenarioStore[scenarioKey] = updatedScenario


  console.log(scenarioStore)
  showFunnelDialog.value = false
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
</style>