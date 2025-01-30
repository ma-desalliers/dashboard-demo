<template>
  <q-dialog v-model="isDialogOpen" persistent @before-hide="saveMetrics" transition-duration="0">
    <q-card style="min-width: 700px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ `Funnel chart - ${selectedRow?.scenario || ''}` }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <!-- Column headers -->
          <div class="col-12">
            <div class="row q-col-gutter-md">
              <div class="col-4 text-right">Metric :</div>
              <div class="col-2 text-center ">Current Value</div>
              <div class="col-2 text-center" style="white-space: nowrap;">Monthly Growth</div>
              <div class="col-2 text-center ">Cap</div>
            </div>
          </div>
          
          <!-- Metric rows -->
          <div class="col-12" v-for="row in metricRows" :key="row.key">
            <div class="row q-col-gutter-md items-center">
              <div class="col-4">
                <div class="text-subtitle2">{{ row.label }}<Tooltip  :title="row.label":description="row.description"></Tooltip></div>
                
              </div>
              
              <div class="col-2">
                <q-input
                  v-model.number="metrics[row.key].value"
                  type="number"
                  suffix="%"
                  dense
                  outlined
                      class="text-right"
    input-class="text-right"
                  :rules="[
                    val => val >= 0 && val <= 100 || 'Value must be between 0-100',
                    val => !isNaN(val) || 'Must be a number'
                  ]"
                  @update:model-value="calculateProjections"
                />
              </div>
              
              <div class="col-2">
                <q-input
                  v-model.number="metrics[row.key].monthlyGrowth"
                  type="number"
                  suffix="%"
                  step="0.1"
                  dense
                  outlined
                      class="text-right"
    input-class="text-right"
                  :rules="[
                    val => val >= 0 && val <= 100 || 'Growth must be between 0-100',
                    val => !isNaN(val) || 'Must be a number'
                  ]"
                  @update:model-value="calculateProjections"
                />
              </div>
              
              <div class="col-2">
                <q-input
                  v-model.number="metrics[row.key].cap"
                  type="number"
                  suffix="%"
                  dense
                  outlined
                      class="text-right"
    input-class="text-right"
                  :rules="[
                    val => val >= 0 && val <= 100 || 'Cap must be between 0-100',
                    val => val >= metrics[row.key].value || 'Must be greater than current value',
                    val => !isNaN(val) || 'Must be a number'
                  ]"
                  @update:model-value="calculateProjections"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Preview Section
      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Growth Projections</div>
        <div class="row q-col-gutter-md">
          <div class="col-4" v-for="(value, year) in yearlyProjections" :key="year">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">{{ formatYear(year) }}</div>
                <div class="text-h6">{{ value.toFixed(0) }}</div>
                <div class="text-caption text-grey-7">
                  {{ calculateGrowthRate(year) }}% YoY Growth
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section> -->

      <q-card-actions align="right" class="bg-white">
        <q-btn flat label="Close" color="primary" @click="saveMetrics" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { 
  type FunnelMetrics, 
  type YearlyProjections,
  type MetricValue,
  DEFAULT_METRICS,
  calculateYearlyProjections 
} from '../strategy-type'

interface Props {
  modelValue: boolean;
  selectedRow?: {
    scenario: string;
    potentialReach: number;
    acquisitionRate: number;
  } | null;
  currentMetrics?: FunnelMetrics | null;
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'save'])
const $q = useQuasar()

const isDialogOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const metrics = ref<FunnelMetrics>({...DEFAULT_METRICS})

const metricRows = [
  {
    key: 'reachRate',
    label: 'Reach Rate',
    description: 'Percentage of target audience that sees your content'
  },
  {
    key: 'engagementRate',
    label: 'Engagement Rate',
    description: 'Percentage of reached audience that engages with content'
  },
  {
    key: 'conversionRate',
    label: 'Conversion Rate',
    description: 'Percentage of engaged users that take desired action'
  },
  {
    key: 'purchaseRate',
    label: 'Purchase Rate',
    description: 'Percentage of converted users that make a purchase'
  }
]

const yearlyProjections = ref<YearlyProjections>({
  y2025: 0,
  y2026: 0,
  y2027: 0,
  y2028: 0,
  y2029: 0
})

const calculateProjections = () => {
  if (!props.selectedRow) return

  yearlyProjections.value = calculateYearlyProjections(
    props.selectedRow.potentialReach,
    metrics.value
  )
}

const formatYear = (yearKey: string): string => {
  return yearKey.replace('y', '')
}

const calculateGrowthRate = (yearKey: string): number => {
  const years = Object.keys(yearlyProjections.value)
  const currentIndex = years.indexOf(yearKey)
  if (currentIndex === 0) return 0

  const currentValue = yearlyProjections.value[yearKey]
  const previousValue = yearlyProjections.value[years[currentIndex - 1]]
  return Math.round(((currentValue - previousValue) / previousValue) * 100)
}

const saveMetrics = () => {
  emit('save', {
    metrics: metrics.value,
    yearlyProjections: yearlyProjections.value
  })
  isDialogOpen.value = false
}

// Initialize metrics when dialog opens
watch(() => props.currentMetrics, (newMetrics) => {
  if (newMetrics) {
    metrics.value = JSON.parse(JSON.stringify(newMetrics))
    calculateProjections()
  }
}, { immediate: true })

// Recalculate projections when selectedRow changes
watch(() => props.selectedRow, () => {
  if (props.selectedRow) {
    calculateProjections()
  }
}, { immediate: true })
</script>
<style scoped>
/* Add these styles to ensure proper right alignment */
:deep(.q-field__native) {
  text-align: center !important;
}

:deep(.q-field__suffix) {
  padding-left: 4px;
}
</style>