<template>
  <div class="column q-col-gutter-xs q-px-sm">
    <span>Custom period</span>
    <div>
      <q-btn-dropdown
        outline
        class="full-width"
        :menu-anchor="menuPosition === 'top' ? 'top middle' : 'bottom middle'" 
        :menu-self="menuPosition === 'top' ? 'bottom middle' : 'top middle'"
        @show="onShow"
      >
        <template #label>
          <div class="row items-center no-wrap">
            <q-icon name="event" class="q-mr-sm" />
            <span>{{ displayLabel }}</span>
          </div>
        </template>

        <q-card style="min-width:500px; max-width:500px">
          <q-card-section class="row no-wrap">
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
          </q-card-section>
        </q-card>
      </q-btn-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  modelValue?: { start: string; end: string }
}>()

const emit = defineEmits(['update:modelValue'])

const dateRange = ref({ from: '', to: '' })
const menuPosition = ref('bottom')
const showCustom = ref(false)

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

const displayLabel = computed(() => {
  if (dateRange.value.from && dateRange.value.to) {
    return `${formatDate(dateRange.value.from)} - ${formatDate(dateRange.value.to)}`
  }
  return 'Select Date Range'
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
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

const cancel = () => {
  dateRange.value = { from: '', to: '' }
}

const applyCustomRange = () => {
  if (dateRange.value.from && dateRange.value.to) {
    emitUpdate()
    showCustom.value = false
  }
}

const emitUpdate = () => {
  emit('update:modelValue', {
    start: dateRange.value.from,
    end: dateRange.value.to
  })
}

onMounted(() => {
  if (props.modelValue) {
    dateRange.value = {
      from: props.modelValue.start,
      to: props.modelValue.end
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