<template>
  <div class="column q-col-gutter-xs q-px-sm">
    <div>
      <q-btn-dropdown
        outline
        class="full-width"
        color="grey"
        :menu-anchor="menuPosition === 'top' ? 'top middle' : 'bottom middle'" 
        :menu-self="menuPosition === 'top' ? 'bottom middle' : 'top middle'"
        @show="onShow"
      >
        <template #label>
          <div class="row items-center no-wrap c-text-dark">
            <q-icon :name="rangeType === 'date' ? 'event' : 'calendar_today'" class="q-mr-sm" />
            <span>{{ displayLabel }}</span>
          </div>
        </template>

        <q-card :style="{ minWidth: rangeType === 'date' ? '500px' : '300px', maxWidth: rangeType === 'date' ? '500px' : '300px' }">
          <q-card-section class="row no-wrap">
            <template v-if="rangeType === 'date'">
              <div class="col-4">
                <q-list class="q-py-none">
                  <q-item
                    v-for="range in presetRanges" 
                    :key="range.value"
                    clickable
                    :class="{'bg-grey-2': range.value === 'custom' && showCustom}"
                    @click="handleRangeClick(range)"
                  >
                    <q-item-section>{{ range.label }}</q-item-section>
                  </q-item>
                </q-list>
              </div>
              
              <q-separator vertical />
              
              <div class="col-8 column justify-center items-center q-px-md">
                <q-date
                  v-model="dateRange"
                  range
                  minimal
                  :title="''"
                  mask="YYYY-MM-DD"
                />
                
                <q-separator class="q-my-md" />

                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-6">
                    <q-input
                      v-model="dateRange.from"
                      label="Start Date"
                      outlined
                      dense
                      readonly
                    />
                  </div>
                  <div class="col-6">
                    <q-input
                      v-model="dateRange.to"
                      label="End Date"
                      outlined
                      dense
                      readonly
                    />
                  </div>
                </div>

                <div class="row justify-end full-width q-gutter-sm">
                  <q-btn
                    label="Cancel"
                    color="grey"
                    flat
                    dense
                    v-close-popup
                    @click="cancel"
                  />
                  <q-btn
                    label="Done"
                    color="primary"
                    dense
                    @click="applyCustomRange"
                    v-close-popup
                  />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="col-12 column items-center q-pa-md">
                <div class="row q-col-gutter-md q-mb-md">
                  <q-btn-group outline>
                    <q-btn
                      v-for="preset in yearPresets"
                      :key="preset.value"
                      :label="preset.label"
                      outline
                      color="primary"
                      :class="{ 'bg-primary text-white': activeYearPreset === preset.value }"
                      @click="applyYearPreset(preset)"
                    />
                  </q-btn-group>
                </div>

                <div class="row q-col-gutter-md q-mb-md full-width">
                  <div class="col-6">
                    <q-select
                      v-model="yearRange.from"
                      :options="yearOptions"
                      label="Start Year"
                      outlined
                      dense
                      emit-value
                      map-options
                      @update:model-value="handleStartYearChange"
                    />
                  </div>
                  <div class="col-6">
                    <q-select
                      v-model="yearRange.to"
                      :options="yearOptions"
                      label="End Year"
                      outlined
                      dense
                      emit-value
                      map-options
                      @update:model-value="handleEndYearChange"
                    />
                  </div>
                </div>

                <div class="row justify-end full-width q-gutter-sm">
                  <q-btn
                    label="Cancel"
                    color="grey"
                    flat
                    dense
                    v-close-popup
                    @click="cancel"
                  />
                  <q-btn
                    label="Apply"
                    color="primary"
                    dense
                    @click="applyYearRange"
                    v-close-popup
                  />
                </div>
              </div>
            </template>
          </q-card-section>
        </q-card>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  modelValue?: { start: string; end: string }
  rangeType?: 'date' | 'year'
}

const props = withDefaults(defineProps<Props>(), {
  rangeType: 'date'
})

const emit = defineEmits(['update:modelValue'])

const dateRange = ref({ from: '', to: '' })
const yearRange = ref({ from: new Date().getFullYear(), to: new Date().getFullYear() })
const menuPosition = ref('bottom')
const showCustom = ref(false)
const activeYearPreset = ref('')

const presetRanges = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This week', value: 'this-week' },
  { label: 'Last week', value: 'last-week' },
  { label: 'This month', value: 'this-month' },
  { label: 'Last month', value: 'last-month' },
  { label: 'This quarter', value: 'this-quarter' },
  { label: 'Last quarter', value: 'last-quarter' },
  { label: 'Custom Period', value: 'custom' }
]

const yearPresets = [
  { label: '1Y', value: 1 },
  { label: '3Y', value: 3 },
  { label: '5Y', value: 5 },
  { label: '10Y', value: 10 }
]

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 20; i <= currentYear; i++) {
    years.push({
      label: i.toString(),
      value: i
    })
  }
  return years
})

const displayLabel = computed(() => {
  if (props.rangeType === 'date') {
    if (dateRange.value.from && dateRange.value.to) {
      return `${formatDate(dateRange.value.from)} - ${formatDate(dateRange.value.to)}`
    }
  } else {
    if (yearRange.value.from && yearRange.value.to) {
      return `${yearRange.value.from} - ${yearRange.value.to}`
    }
  }
  return 'Select Range'
})

const onShow = () => {
  const dropdown = document.querySelector('.q-menu')
  if (!dropdown) return

  const rect = dropdown.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  
  menuPosition.value = spaceBelow < 300 ? 'top' : 'bottom'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const handleRangeClick = (range: { value: string }) => {
  if (range.value === 'custom') {
    showCustom.value = !showCustom.value
    return
  }
  
  showCustom.value = false
  const { start, end } = calculateDateRange(range.value)
  dateRange.value = { from: start, to: end }
  emitUpdate()
}

const handleStartYearChange = (year: number) => {
  if (year > yearRange.value.to) {
    yearRange.value.to = year
  }
  activeYearPreset.value = ''
}

const handleEndYearChange = (year: number) => {
  if (year < yearRange.value.from) {
    yearRange.value.from = year
  }
  activeYearPreset.value = ''
}

const applyYearPreset = (preset: { value: number }) => {
  const startYear = yearRange.value.from
  activeYearPreset.value = preset.value.toString()
  yearRange.value = {
    from: startYear ,
    to: startYear +(preset.value - 1)
  }
}

const calculateDateRange = (rangeType: string) => {
  const today = new Date()
  let start = new Date()
  let end = new Date()

  switch (rangeType) {
    case 'today':
      break
    case 'yesterday':
      start.setDate(today.getDate() - 1)
      end = new Date(start)
      break
    case 'this-week':
      start.setDate(today.getDate() - today.getDay())
      break
    case 'last-week':
      start.setDate(today.getDate() - today.getDay() - 7)
      end.setDate(today.getDate() - today.getDay() - 1)
      break
    case 'this-month':
      start.setDate(1)
      break
    case 'last-month':
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      end = new Date(today.getFullYear(), today.getMonth(), 0)
      break
    case 'this-quarter':
      const quarter = Math.floor(today.getMonth() / 3)
      start = new Date(today.getFullYear(), quarter * 3, 1)
      break
    case 'last-quarter':
      const lastQuarter = Math.floor((today.getMonth() - 3) / 3)
      const year = lastQuarter < 0 ? today.getFullYear() - 1 : today.getFullYear()
      const quarterMonth = lastQuarter < 0 ? 4 + lastQuarter : lastQuarter
      start = new Date(year, quarterMonth * 3, 1)
      end = new Date(year, (quarterMonth + 1) * 3, 0)
      break
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

const cancel = () => {
  if (props.rangeType === 'date') {
    dateRange.value = { from: '', to: '' }
  } else {
    const currentYear = new Date().getFullYear()
    yearRange.value = { from: currentYear, to: currentYear }
    activeYearPreset.value = ''
  }
}

const applyCustomRange = () => {
  if (dateRange.value.from && dateRange.value.to) {
    emitUpdate()
    showCustom.value = false
  }
}

const applyYearRange = () => {
  if (yearRange.value.from && yearRange.value.to) {
    emit('update:modelValue', {
      start: `${yearRange.value.from}-01-01`,
      end: `${yearRange.value.to}-12-31`
    })
  }
}

const emitUpdate = () => {
  if (props.rangeType === 'date') {
    emit('update:modelValue', {
      start: dateRange.value.from,
      end: dateRange.value.to
    })
  }
}

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.rangeType === 'date') {
      dateRange.value = {
        from: newValue.start,
        to: newValue.end
      }
    } else {
      const startYear = new Date(newValue.start).getFullYear()
      const endYear = new Date(newValue.end).getFullYear()
      yearRange.value = {
        from: startYear,
        to: endYear
      }
    }
  }
}, { immediate: true })

onMounted(() => {
  if (!props.modelValue) {
    const currentYear = new Date().getFullYear()
    if (props.rangeType === 'year') {
      yearRange.value = {
        from: currentYear,
        to: currentYear
      }
    }
  }
})
</script>

<style scoped>
.q-date {
  box-shadow: none;
  border: none;
}
</style>