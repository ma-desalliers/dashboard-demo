<template>
  <q-editor
    v-model="localModel"
    :readonly="readonly"
    :min-height="minHeight"
    :max-height="maxHeight"
    :toolbar="toolbar"
    :placeholder="placeholder"
    :definitions="definitions"
    :fonts="fonts"
    @input="emitInput"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import * as quasar from 'quasar';

// Props
defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  },
  minHeight: {
    type: String,
    default: '200px'
  },
  maxHeight: {
    type: String,
    default: ''
  },
  toolbar: {
    type: Array as () => quasar.QEditorToolbar,
    default: () => [
      ['bold', 'italic', 'underline', 'strike'],
      ['quote', 'unordered', 'ordered', 'link'],
      ['undo', 'redo']
    ]
  },
  placeholder: {
    type: String,
    default: 'Type your content here...'
  },
  definitions: {
    type: Object as () => quasar.QEditorDefinitions,
    default: () => ({})
  },
  fonts: {
    type: Array as () => quasar.QEditorFonts,
    default: () => []
  }
});

// Emit
defineEmits(['update:modelValue']);

// Local State
const localModel = ref(modelValue);

// Watch the v-model to sync with parent
watch(() => modelValue, (newValue) => {
  localModel.value = newValue;
});

// Emit changes to parent
const emitInput = () => {
  emit('update:modelValue', localModel.value);
};
</script>

<style scoped>
.q-editor {
  border: 1px solid var(--q-color-grey-3);
  border-radius: 4px;
}
</style>
