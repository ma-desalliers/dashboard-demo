<template>
  <div class="q-pa-md">
    <c-table
      :columns="columns"
      :rows="props.tableData"
      :model-value="selectedRows"
      :row-key="rowKey"
      :hover-buttons="hoverButtons"
      @update:model-value="handleSelectionUpdate"
    >
      <template #cell-selectedScenario="{ row }" >

        <q-select
          v-model="row.selectedScenario"
          :options="scenarioOptions"
          dense
          emit-value
          map-options
          borderless
          style="max-width:110px; width:110px; font-size: 16px;"
          @update:model-value="(val) => handleScenarioUpdate(row, val)"
        />
      </template>

      <template #cell-irg="{ value }">
        <q-chip square :color="getIRGColor(value)" text-color="white" dense style="font-size: 16px;">
          {{ value }}
        </q-chip>
      </template>
    </c-table>
    <SidePanel v-model="showStrategySidePanel" :width="500" :full-page="true">
      <StrategyEditor></StrategyEditor>
    </SidePanel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StrategyPanel from './sidePanel/StrategyPanel.vue'
import StrategyEditor from '../StrategyEditor.vue'

interface Scenario {
  y2025: number
  y2026: number
  y2027: number
  y2028: number
  y2029: number
}

interface StrategyScenarios {
  best: Scenario
  realistic: Scenario
  pessimistic: Scenario
}

interface Strategy {
  name: string
  selected: boolean
  irg: number
  selectedScenario: 'best' | 'realistic' | 'pessimistic'
  scenarios: StrategyScenarios
}

interface Props {
  tableData: Strategy[]
  initialSelected?: Strategy[]
  editable?: boolean
  showHoverButtons?: boolean
}

// Props definition
const props = withDefaults(defineProps<Props>(), {
  initialSelected: () => [],
  editable: true,
  showHoverButtons: true
})

// Emits definition
const emit = defineEmits<{
  (e: 'updateSelected', value: Strategy[]): void
  (e: 'scenario-change', strategy: Strategy, newScenario: string): void
  (e: 'edit', strategy: Strategy): void
  (e: 'delete', strategy: Strategy): void
}>()

// Local state
const selectedRows = ref(props.initialSelected)

const scenarioOptions = [
  { label: 'Optimistic', value: 'optimistic' },
  { label: 'Realistic', value: 'realistic' },
  { label: 'Pessimistic', value: 'pessimistic' }
]

const showStrategySidePanel = ref(false)
const hoverButtons = computed(() => {
  return [
    {
      icon: 'fa fa-pen',
      action: (event:any, item:any) => { openStrategySidePanel(item) },
      color: 'white',
      textColor: '#333333'
    },
  ]
})



const rowKey = 'name'
// Column definitions
const columns = computed(() => [
  {
    name: 'name',  // Changed from 'strategy' to 'name' to match your data structure
    label: 'Strategies',
    field: 'name',
    type: 'hover',
    align: 'left'
  },
  {
    name: 'irg',
    label: 'IRG',
    field: 'irg',
    align: 'center',
    style: 'width:100px'
  },
  {
    name: 'selectedScenario',  // Changed from 'scenario' to match your data structure
    label: 'Scenario',
    field: 'selectedScenario',
    align: 'center',
    classed:'max-180',
    style:'max-width:150px;width:150px;',
    headerStyle:'max-width:150px;width:150px;'
  },
  {
    name: 'y2025',  // Changed to match your data structure
    label: '2025',
    field: 'y2025',
    align: 'center',
    style:'width:150px',
    format: (val: number) => formatCurrency(val)
  },
  {
    name: 'y2026',
    label: '2026',
    field: 'y2026',
    align: 'center',
    style:'width:150px',
    format: (val: number) => formatCurrency(val)
  },
  {
    name: 'y2027',
    label: '2027',
    field: 'y2027',
    align: 'center',
    style:'width:150px',
    format: (val: number) => formatCurrency(val)
  },
  {
    name: 'y2028',
    label: '2028',
    field: 'y2028',
    align: 'center',
    style:'width:150px',
    format: (val: number) => formatCurrency(val)
  },
  {
    name: 'y2029',
    label: '2029',
    field: 'y2029',
    align: 'center',
    style:'width:150px',
    format: (val: number) => formatCurrency(val)
  }
])

// Utility functions
const getIRGColor = (irg: number) => {
  if (irg >= 9) return 'green'
  if (irg >= 8) return 'light-green'
  if (irg >= 7) return 'yellow'
  return 'orange'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const getYearValue = (row: any, year: number) => {
  const yearKey = `y${year}` 
  console.log(row[yearKey], yearKey)
  return row[yearKey]
}

const openStrategySidePanel = (item:any) => {
  showStrategySidePanel.value = true
}

// Event handlers
const handleSelectionUpdate = (newSelection: Strategy[]) => {
  selectedRows.value = newSelection
  emit('updateSelected', newSelection)
}

const handleScenarioUpdate = (strategy: Strategy, newScenario: string) => {
  emit('scenario-change', strategy, newScenario)
}


</script>

<style>
.strategy-table {
  width: 100%;
}

.max-180{
  width:180px;
  max-width: 180px;
}
</style>