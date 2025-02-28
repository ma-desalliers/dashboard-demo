<template>
  <div class="">
    <div v-if="title" class="row items-center q-mb-md">
      <div class="text-subtitle2">{{ title }}</div>
      <q-icon 
        v-if="tooltip" 
        name="info" 
        size="18px" 
        class="q-ml-sm text-grey-6"
      >
        <q-tooltip>{{ tooltip }}</q-tooltip>
      </q-icon>
    </div>

    <div class="row q-col-gutter-md">
      <div 
        v-for="option in options" 
        :key="option.value"
        :class="[`col-12 col-sm-${12/columns}`]"
      >
       
        <q-btn
          class="option-selector full-width"
          :class="{ 'selected': modelValue === option.value }"
          flat
          align="left"
          :disable="option.comingSoon"
          @click="updateValue(option.value)"
        >

        <coming-soon-tooltip v-if="option.comingSoon"></coming-soon-tooltip>
          <div class="full-width column q-col-gutter-sm items-center no-wrap">
            <q-icon
              v-if="option.icon"
              :name="option.icon"
              size="30px"
              class="q-mr-sm"
              :class="modelValue === option.value ? 'text-primary' : 'text-grey-7'"
            />
            <div class="full-width">
              <div 
                class="text-weight-medium text-transform-unset" 
                :class="modelValue === option.value ? 'text-primary' : 'text-dark'"
              >
                {{ option.label }}
              </div>
              <div 
                v-if="option.description" 
                class="text-caption text-grey-7"
              >
                {{ option.description }}
              </div>
            </div>
          </div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  label: string
  value: string
  description?: string
  icon?: string
  comingSoon?:boolean
}

interface Props {
  modelValue: string
  options: SelectOption[]
  title?: string
  tooltip?: string
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 2
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateValue = (value: string) => {
  emit('update:modelValue', value);
}
</script>

<style lang="scss">
.option-selector {
  min-height: 90px;
  border: 1px solid #DDE3E8;
  border-radius: 8px;
  background-color: #F8FAFC;
  padding: 12px 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #F1F5F9;
  }

  &.selected {
    background-color: var(--q-green-lighten);
    border-color: var(--q-green);
    box-shadow:1px 1px 8px #aaaaaa ;
    &:hover {
    }
  }

}

.text-transform-unset{
  text-transform: unset !important;
}


.text-dark {
  color: #222F3E;
}
</style>