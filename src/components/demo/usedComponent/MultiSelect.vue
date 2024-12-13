<template>
  <q-select
    outlined
    dense
    v-model="selectedItems"
    :options="computedOptions"
    :multiple="multiple"
    :label="label"
    emit-value
    map-options
    :option-value="selectionType === 'uuid' ? 'uuid' : value => value"
    :option-label="labelName"
    behavior="menu"
    class="full-width c-select"
  >
    <template #selected>
      <template v-if="displaySelected === 'number' && multiple && selectedItems?.length">
        {{ selectedItems.length }} items selected
      </template>
      <template v-else>
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
    </template>

    <template #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="q-pa-none c-select-item">
        <q-item-section side v-if="multiple">
          <div class="row items-center">
            <q-checkbox
              :model-value="selected"
              @click="toggleOption(opt)"
            />
          </div>
        </q-item-section>
        <q-item-section class="q-pa-none">
          <q-item-label class="q-pa-sm">{{ opt[labelName] }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #no-option>
      <template v-if="addFunction">
        <q-item clickable @click="addFunction" class="q-pa-none">
          <q-item-section side class="q-pl-md">
            <q-icon name="fa fa-plus" color="green" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="q-pa-sm text-green">Add new item</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-else>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>

    <template #after-options>
      <q-item v-if="addFunction" clickable @click="addFunction" class="q-pa-none">
        <q-item-section side class="q-pl-md">
          <q-icon name="fa fa-plus" color="green" size="xs" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="q-pa-sm text-green">Add new item</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: any | any[]
  options: any[]
  hoverButtons?: any[]
  labelName: string
  selectionType?: 'uuid' | 'object'
  addFunction?: (event:Event) => void
  selectedFirst?: boolean
  label?: string
  multiple?: boolean
  displaySelected?: 'number' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  selectionType: 'uuid',
  selectedFirst: true,
  multiple: true,
  displaySelected: 'list'
})

const emit = defineEmits(['update:modelValue'])

const selectedItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const computedOptions = computed(() => {
  if (!props.selectedFirst) return props.options
  
  if (!props.multiple) {
    return props.options
  }

  const selected = props.options.filter(opt => 
    props.modelValue.includes(props.selectionType === 'uuid' ? opt.uuid : opt)
  )
  const unselected = props.options.filter(opt => 
    !props.modelValue.includes(props.selectionType === 'uuid' ? opt.uuid : opt)
  )
  
  return [...selected, ...unselected]
})

const getItemValue = (item: any) => {
  return props.selectionType === 'uuid' ? item.uuid : item
}

const getItemLabel = (item: any) => {
  return props.selectionType === 'uuid' ? 
    props.options.find(opt => opt.uuid === item)?.[props.labelName] :
    item[props.labelName]
}

const removeItem = (item: any) => {
  const newValue = Array.isArray(selectedItems.value) ? 
    selectedItems.value.filter(i => i !== getItemValue(item)) :
    null
  emit('update:modelValue', newValue)
}
</script>