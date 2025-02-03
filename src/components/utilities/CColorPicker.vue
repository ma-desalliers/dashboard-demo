<template>
  <div class="color-picker-container">
    <div class="text-subtitle1 q-mb-sm" v-if="label">{{ label }}</div>
    <div class="relative-position">
      <div class="row q-col-gutter-sm items-center">
        <div class="col-auto">
          <q-input
            v-model="internalColor"
            outlined
            dense
            :rules="[validateHexColor]"
            @update:model-value="handleInputChange"
          >
            <template v-slot:prepend>
              <div
                class="color-preview"
                :style="{ backgroundColor: modelValue || defaultColor }"
                @click="showPicker = !showPicker"
              />
            </template>
          </q-input>
        </div>
      </div>

      <q-menu
        v-model="showPicker"
        :target="true"
        anchor="bottom left"
        self="top left"
        :offset="[0, 8]"
        persistent
        class="color-picker-menu"
      >
        <q-card style="min-width: 300px">
          <q-card-section>
            <q-tabs
              v-model="activeTab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
            >
              <q-tab name="spectrum" label="Spectrum" />
              <q-tab name="palette" label="Palette" />
            </q-tabs>

            <div class="q-pa-md">
              <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel name="spectrum" class="q-pa-none">
                  <q-color
                    v-model="internalColor"
                    default-view="spectrum"
                    class="q-mb-md"
                    no-header
                    no-footer
                  />
                </q-tab-panel>

                <q-tab-panel name="palette" class="q-pa-none">
                  <div class="row q-col-gutter-sm">
                    <div 
                      v-for="color in predefinedColors" 
                      :key="color"
                      class="col-2 cursor-pointer"
                      @click="selectPredefinedColor(color)"
                    >
                      <div 
                        class="color-swatch"
                        :style="{ backgroundColor: color }"
                      >
                        <q-tooltip>{{ color }}</q-tooltip>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat label="Cancel" color="grey" @click="cancelSelection" />
            <q-btn color="primary" label="Select" @click="selectColor" />
          </q-card-actions>
        </q-card>
      </q-menu>
    </div>
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
const internalColor = ref(props.modelValue || props.defaultColor)
const activeTab = ref('spectrum')

const predefinedColors = [
  '#FF0000', '#FF4500', '#FFA500', '#FFD700', '#FFFF00', '#9ACD32',
  '#008000', '#00FA9A', '#00FFFF', '#00BFFF', '#0000FF', '#4B0082',
  '#8B008B', '#FF00FF', '#FF69B4', '#CD853F', '#8B4513', '#000000',
  '#696969', '#808080', '#C0C0C0', '#FFFFFF'
]

const validateHexColor = (val: string) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(val) || 'Invalid hex color'
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== internalColor.value) {
    internalColor.value = newValue || props.defaultColor
  }
}, { immediate: true })

const handleInputChange = (value: string) => {
  if (validateHexColor(value) === true) {
    emit('update:modelValue', value)
  }
}

const selectColor = () => {
  emit('update:modelValue', internalColor.value)
  showPicker.value = false
}

const cancelSelection = () => {
  internalColor.value = props.modelValue || props.defaultColor
  showPicker.value = false
}

const selectPredefinedColor = (color: string) => {
  internalColor.value = color
  emit('update:modelValue', color)
  showPicker.value = false
}
</script>

<style scoped>
.color-picker-container {
  display: inline-block;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-preview:hover {
  transform: scale(1.1);
}

.color-swatch {
  aspect-ratio: 1;
  border-radius: 4px;
  border: 1px solid #ddd;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-picker-menu {
  max-height: 90vh;
}
</style>