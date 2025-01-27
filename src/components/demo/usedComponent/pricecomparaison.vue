Here's the complete updated component code:

```vue
<template>
  <q-card class="full-width q-pa-none" flat>
    <q-card-section class="q-px-none">
      <div class="text-h5 font-weight-bold">Compare Our Plan Families: Annual vs. Quarterly Savings</div>
      <p class="text-grey-7 q-mt-sm">
        Select a payment frequency to see how one free quarter reduces your overall AI credit costs.
      </p>
      
      <q-btn-toggle
        v-model="selectedFrequency"
        spread
        no-caps
        unelevated
        :options="paymentOptions"
        class="bg-grey-2 q-pa-xs q-mt-md"
        active-class="bg-green-600 text-white"
        text-color="grey-7"
      />
    </q-card-section>

    <q-card-section class="q-px-none">
      <div style="height: 400px">
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
        :rows="tableData"
        :columns="tableColumns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 0 }"
        @update:selected="handleSelection"
        class="q-mt-lg"
      >
        <template v-slot:body-cell-select="props">
          <q-td :props="props" @click="handlePlanSelect(props.row)" clickable>
            <q-icon clickable class="cursor-pointer">
              <i style="font-size:18px;" :class="props.row.selected ? 'fa-regular fa-circle-dot' : 'fa-regular fa-circle'"></i>
            </q-icon>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, watch, markRaw } from 'vue'

const emit = defineEmits(['plan-selected'])

const mounted = ref(false)
const chart = ref(null)
const selectedFrequency = ref('annual')
const selectedPlan = ref(null)
const selected = ref([])
const selectedRowIndex = ref(null)

const CHART_COLORS = {
  bars: '#22c55e',
  selectedBar: '#166534',
  line: '#f97316',
  selectedIndicator: '#166534'
}

const paymentOptions = [
  { label: 'Annually (Save 25%)', value: 'annual' },
  { label: 'Quarterly', value: 'quarterly' }
]

const PLAN_FAMILIES = {
  Visionary: {
    tiers: [
      { contractValue: 5000000, credits: 1000000019, baseCredit: 0.005, quarterlyPayment: 250000, annualPayment: 750000, duration: 5 },
      { contractValue: 2500000, credits: 240000009, baseCredit: 0.010, quarterlyPayment: 125000, annualPayment: 375000, duration: 5 },
      { contractValue: 1000000, credits: 50000004, baseCredit: 0.020, quarterlyPayment: 50000, annualPayment: 150000, duration: 5 }
    ]
  },
  Enterprise: {
    tiers: [
      { contractValue: 840000, credits: 33600003, baseCredit: 0.025, quarterlyPayment: 70000, annualPayment: 210000, duration: 3 },
      { contractValue: 720000, credits: 23760002, baseCredit: 0.030, quarterlyPayment: 60000, annualPayment: 180000, duration: 3 },
      { contractValue: 600000, credits: 18000002, baseCredit: 0.033, quarterlyPayment: 50000, annualPayment: 150000, duration: 3 }
    ]
  },
  Enthusiast: {
    tiers: [
      { contractValue: 480000, credits: 10800001, baseCredit: 0.044, quarterlyPayment: 60000, annualPayment: 180000, duration: 2 },
      { contractValue: 360000, credits: 7200001, baseCredit: 0.050, quarterlyPayment: 45000, annualPayment: 135000, duration: 2 },
      { contractValue: 240000, credits: 3600001, baseCredit: 0.067, quarterlyPayment: 30000, annualPayment: 90000, duration: 2 }
    ]
  }
}

const formatters = {
  currency: (value) => `$${value.toLocaleString()}`,
 // creditCost: (value) => value.toFixed(3),
  credits: (value) => `${Math.floor(value / 1000000)}M`,
  yAxisCurrency: (value) => `$${(value/1000).toFixed(0)}k`
}

const getBarColor = (index) => {
  if (index === selectedRowIndex.value) {
    return {
      fill: {
        type: 'solid',
        colors: [CHART_COLORS.selectedBar]
      },
      stroke: {
        width: 2,
        colors: [CHART_COLORS.selectedIndicator]
      }
    }
  }
  return {
    fill: {
      type: 'solid',
      colors: [CHART_COLORS.bars]
    }
  }
}

const tableData = computed(() => {
  const data = [];
  Object.entries(PLAN_FAMILIES).forEach(([family, details]) => {
    details.tiers.forEach((tier) => {
      const contractValue = selectedFrequency.value === 'annual' 
        ? Math.round(tier.contractValue * 0.75) 
        : tier.contractValue;
      
      const costPerCredit = Number(contractValue) / Number(tier.credits);
      const costPercreditFixed = Number.isFinite(costPerCredit) ? costPerCredit.toFixed(3) : '0.00'

      data.push({
        id: `${family}-${tier.contractValue}`,
        family,
        contractValue,
        payment: selectedFrequency.value === 'annual' ? tier.annualPayment : tier.quarterlyPayment,
        costPerCredit: costPercreditFixed,
        credits: tier.credits,
        duration: tier.duration,
        selected: `${family}-${tier.contractValue}` === selected.value.id
      });
    });
  });
  return data.sort((a, b) => b.contractValue - a.contractValue);
});

const tableColumns = computed(() => [
  { name: 'select', label: 'Select', field: 'select', align: 'center' },
  { name: 'family', label: 'Plan Family', field: 'family', align: 'left' },
  { name: 'contractValue', label: 'Contract Value', field: 'contractValue', format: formatters.currency, align: 'left' },
  { name: 'duration', label: 'Duration (Years)', field: 'duration', align: 'center' },
  { name: 'payment', label: `${selectedFrequency.value === 'annual' ? 'Annual' : 'Quarterly'} Payment`, field: 'payment', format: formatters.currency, align: 'center' },
  { name: 'costPerCredit', label: 'Credit Cost', field: 'costPerCredit', format: formatters.creditCost, align: 'center' },
  { name: 'credits', label: 'Total AI Credits', field: 'credits', format: formatters.credits, align: 'center' }
])

const chartSeries = computed(() => [{
  name: 'Payment',
  type: 'column',
  data: tableData.value.map(item => item.payment),
  states: {
    hover: {
      filter: {
        type: 'none'
      }
    }
  },
  colors: tableData.value.map((_, index) => 
    index === selectedRowIndex.value ? CHART_COLORS.selectedBar : CHART_COLORS.bars
  )
}, {
  name: 'Credit Cost',
  type: 'line',
  data: tableData.value.map(item => item.costPerCredit)
}])

const chartOptions = computed(() => ({
  chart: {
    height: 400,
    type: 'line',
    stacked: false,
    toolbar: { show: false },
    zoom: { enabled: false }
  },
  colors: [CHART_COLORS.bars, CHART_COLORS.line],
  dataLabels: { enabled: false },
  stroke: { width: [1, 3] },
  grid: { strokeDashArray: 3 },
  xaxis: {
    categories: tableData.value.map(item => item.family),
    labels: {
      formatter: (value, index) => index % 3 === 1 ? value : ''
    }
  },
  yaxis: [
    {
      axisTicks: { show: true },
      axisBorder: { show: true, color: CHART_COLORS.bars },
      labels: { formatter: formatters.yAxisCurrency },
      title: { text: 'Payment' },
      min: 0,
      max: selectedFrequency.value === 'annual' ? 800000 : 300000
    },
    {
      opposite: true,
      axisTicks: { show: true },
      axisBorder: { show: true, color: CHART_COLORS.line },
      labels: { formatter: formatters.creditCost },
      title: { text: 'Credit Cost' },
      min: 0,
      max: 0.070,
      reversed: true
    }
  ],
  tooltip: {
    shared: true,
    intersect: false,
    custom: ({ seriesIndex, dataPointIndex, w }) => {
      const isSelected = dataPointIndex === selectedRowIndex.value
      const plan = tableData.value[dataPointIndex]
      return `
        <div class="p-2">
          <div class="font-bold mb-1">
            ${plan.family}
            ${isSelected ? ' (Selected)' : ''}
          </div>
          <div>Payment: ${formatters.currency(plan.payment)}</div>
          <div>Credit Cost: ${formatters.creditCost(plan.costPerCredit)}</div>
        </div>
      `
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

watch(selectedFrequency, () => {
  selectedPlan.value = null
  selected.value = []
  selectedRowIndex.value = null
})

const handlePlanSelect = (row) => {
  selected.value = row
  selectedRowIndex.value = tableData.value.findIndex(item => item.id === row.id)
  emit('plan-selected', selected.value)
}

const handleSelection = (selection) => {
  if (selection.length > 0) {
    selectedPlan.value = true
    selectedRowIndex.value = tableData.value.findIndex(item => item.id === selection[0].id)
    emit('plan-selected', selectedPlan.value)
  }
}
</script>
```