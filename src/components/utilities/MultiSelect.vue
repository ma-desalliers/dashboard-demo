<template>
<!--<StackCounter :count="selectedItems?.length" :size="30" /> --> 
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
    class="full-width"
  >
    <template #selected>
      <template v-if="displaySelected === 'number' && selectedItems?.length > 0">
        <div class="row items-center">
        <StackCounter :count="selectedItems?.length" :size="15" class="col-1" />
        <span class="col q-pl-sm"> {{ selectedItems.length }} {{numberSelectedLabel ?? 'items selected'}} </span>
        </div>
      </template>
      <template v-else-if="displaySelected === 'list'">
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
        {{ numberSelectedLabel }}
      </template>
    </template>

    <template #option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps" class="q-pa-none">
        <q-item-section side>
          <div class="row items-center">
            <q-checkbox
              :model-value="selected"
              @click="toggleOption(opt)"
            />
          </div>
        </q-item-section>
        <q-item-section class="q-pa-none">
          <div
            :buttons="hoverButtons"
            :item="opt"
            :class="{'c-display-content': hoverButtons.length == 0}"
          >
            <q-item-label class="q-pa-sm">{{ opt[labelName] }}</q-item-label>
        </div>
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
  hoverButtons: any[]
  labelName: string
  selectionType?: 'uuid' | 'object'
  addFunction?: (event:Event) => void
  selectedFirst?: boolean
  label?: string
  multiple?: boolean
  displaySelected?: string
  numberSelectedLabel?:string
}

const props = withDefaults(defineProps<Props>(), {
  selectionType: 'uuid',
  displaySelected: 'number',
  selectedFirst: false,
  multiple: false
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

  const  selected = props.options.filter(opt => 
    props.modelValue?.includes(props.selectionType === 'uuid' ? opt.uuid : opt)
  )
  const unselected = props.options.filter(opt => 
    !props.modelValue?.includes(props.selectionType === 'uuid' ? opt.uuid : opt)
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
  const newValue = selectedItems.value.filter(i => i !== getItemValue(item))
  emit('update:modelValue', newValue)
}

</script>