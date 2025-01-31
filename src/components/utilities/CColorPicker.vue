<template>
  <div>
    <div class="text-subtitle1 q-mb-sm" v-if="label">{{ label }}</div>
    <q-btn
      :style="{ backgroundColor: modelValue || defaultColor }"
      class="color-preview-btn"
      @click="showPicker = true"
      flat
    >
      <q-tooltip>
        {{ modelValue || defaultColor }}
      </q-tooltip>
    </q-btn>

    <q-dialog v-model="showPicker">
      <q-card class="q-pa-md">
        <q-color
          v-model="selectedColor"
          default-view="palette"
          class="q-mb-md"
          no-header
          no-footer
        />
        <div class="row justify-end q-gutter-sm">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn 
            color="primary" 
            label="Select" 
            @click="selectColor"
            v-close-popup
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string
  label?: string
  defaultColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultColor: '#42d392'
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const selectedColor = ref(props.modelValue || props.defaultColor)

const selectColor = () => {
  emit('update:modelValue', selectedColor.value)
}

watch(() => props.modelValue, (newValue) => {
  selectedColor.value = newValue || props.defaultColor
})
</script>

<style scoped>
.color-preview-btn {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: transform 0.2s;
}

.color-preview-btn:hover {
  transform: scale(1.02);
}
</style>