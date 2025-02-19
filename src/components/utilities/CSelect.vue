<template>
  <q-select
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="handleModelUpdate"
    class="c-custom-select"
    :class="{ 'c-select-right': align === 'right' }"
    dropdown-icon="chevron-down"
    borderless
    :popup-content-class="align === 'right' ? 'c-select-right' : ''"
    :multiple="multiple"
    input-debounce="300"
    @filter="filterOptions"
    :options="filteredOptions"
    :hide-selected="hideSelected"
    :fill-input="false"
  >
    <!-- Handle selected items display -->
    <template #selected>
      <template v-if="multiple && displayMode === 'count' && selectedItems.length">
        {{ selectedItems.length }} items selected
      </template>
      <template v-else-if="multiple">
        <q-chip
          v-for="item in selectedItems"
          :key="getItemValue(item)"
          removable
          dense
          class="q-mr-xs"
          @remove="removeItem(item)"
        >
          {{ getItemLabel(item) }}
        </q-chip>
      </template>
      <template v-else>
        {{ getSelectedDisplay }}
      </template>
    </template>

    <!-- Handle option display -->
    <template #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="q-pa-none">
        <q-item-section side v-if="multiple">
          <div class="row items-center">
            <q-checkbox
              :model-value="selected"
              @click="toggleOption(opt)"
            />
          </div>
        </q-item-section>
        <q-item-section class="q-pa-none">
          <q-item-label class="q-pa-sm">{{ getOptionLabel(opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <!-- Forward all other slots -->
    <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'

interface Props {
  modelValue?: any | any[]
  align?: 'left' | 'right'
  multiple?: boolean
  useSearch?: boolean
  hideSelected?: boolean
  displayMode?: 'chips' | 'count'
  optionValue?: string
  optionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
  multiple: false,
  useSearch: false,
  hideSelected: false,
  displayMode: 'chips',
  optionValue: 'value',
  optionLabel: 'label',
  emitValue: false,
  mapOptions: false
})

const emit = defineEmits(['update:modelValue'])

const filteredOptions = ref<any[]>([])

const selectedItems = computed(() => {
  if (!props.modelValue) return []
  return Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]
})

const getSelectedDisplay = computed(() => {
  if (!props.modelValue) return ''
  
  if (props.emitValue && props.mapOptions && Array.isArray(props.$attrs.options)) {
    const option = props.$attrs.options.find((opt: any) => opt[props.optionValue] === props.modelValue)
    return option ? option[props.optionLabel] : ''
  }
  
  return props.modelValue[props.optionLabel] || props.modelValue.toString()
})

const getItemValue = (item: any): any => {
  return typeof item === 'object' ? item[props.optionValue] : item
}

const getItemLabel = (item: any): string => {
  if (!item) return ''
  return typeof item === 'object' ? item[props.optionLabel] : item.toString()
}

const getOptionLabel = (option: any): string => {
  return typeof option === 'object' ? option[props.optionLabel] : option.toString()
}

const handleModelUpdate = (value: any) => {
  emit('update:modelValue', value)
}

const removeItem = (item: any) => {
  if (!props.multiple) return
  
  const newValue = selectedItems.value.filter(
    i => getItemValue(i) !== getItemValue(item)
  )
  emit('update:modelValue', newValue)
}

const filterOptions = (val: string, update: (callback: () => void) => void) => {
  update(() => {
    if (!props.useSearch) return
    
    const searchValue = val.toLowerCase()
    filteredOptions.value = Array.isArray(props.$attrs.options) 
      ? props.$attrs.options.filter((opt: any) => {
          const label = getOptionLabel(opt).toLowerCase()
          return label.includes(searchValue)
        })
      : []
  })
}
</script>

<style scoped lang="scss">
.c-custom-select {
  :deep(.q-field__control) {
    padding-right: 0;
  }

  :deep(.q-field__marginal) {
    margin-left: 4px;
  }

  &.c-select-right {
    :deep(.q-field__native) {
      justify-content: end;
    }

    :deep(.q-field__append) {
      padding-right: 0;
    }
  }

  :deep(.q-select__dropdown-icon) {
    font-size: 14px;
  }

  :deep(.q-field__input) {
    border: none;
    outline: none;
    padding: 0;
    max-width: 100%;
    width: auto;
    line-height: inherit;
    font-size: inherit;
  }
}

.q-chip {
  margin: 2px;
}
</style>