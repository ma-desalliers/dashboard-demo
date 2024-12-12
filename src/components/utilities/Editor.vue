<template>
  <q-editor
    v-model="content"
    :toolbar="toolbarOptions"
    :fonts="fontOptions"
    class="editor-container"
    :min-height="minHeight"
    outlined
    dense
    @update:model-value="handleUpdate"
  >
    <template v-slot:toolbar-push>
      <q-btn-dropdown dense flat label="Custom Actions">
        <q-list>
          <q-item clickable v-close-popup @click="clearFormat">
            <q-item-section>Clear Formatting</q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="toggleFullscreen">
            <q-item-section>{{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </q-editor>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  modelValue: string
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: '200px'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const $q = useQuasar()
const isFullscreen = ref(false)

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const fontOptions = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana'
}

const toolbarOptions = [
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      options: ['left', 'center', 'right', 'justify']
    }
  ],
  ['bold', 'italic', 'strike', 'underline'],
  ['token', 'hr', 'link', 'custom_btn'],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: 'no-icons',
      options: [
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'code'
      ]
    },
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'size-1',
        'size-2',
        'size-3',
        'size-4',
        'size-5',
        'size-6',
        'size-7'
      ]
    },
    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'default_font',
        'arial',
        'arial_black',
        'comic_sans',
        'courier_new',
        'impact',
        'lucida_grande',
        'times_new_roman',
        'verdana'
      ]
    },
    'removeFormat'
  ],
  ['quote', 'unordered', 'ordered'],
  ['undo', 'redo'],
  [
    {
      label: $q.lang.editor.formatting,
      icon: $q.iconSet.editor.formatting,
      list: 'no-icons',
      options: [
        'subscript',
        'superscript'
      ]
    }
  ],
  [
    {
      label: 'Text Color',
      icon: 'format_color_text',
      options: ['text-red', 'text-blue', 'text-green', 'text-yellow', 'text-black']
    },
    {
      label: 'Background Color',
      icon: 'format_color_fill',
      options: ['bg-red', 'bg-blue', 'bg-green', 'bg-yellow', 'bg-white']
    }
  ]
]

const handleUpdate = (val: string) => {
  emit('update:modelValue', val)
}

const clearFormat = () => {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    document.execCommand('removeFormat', false)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  const editorEl = document.querySelector('.editor-container')
  if (editorEl) {
    if (isFullscreen.value) {
      editorEl.classList.add('fullscreen')
    } else {
      editorEl.classList.remove('fullscreen')
    }
  }
}
</script>

<style lang="scss">
.editor-container {
  border-radius: 4px;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    background: white;
  }

  .q-editor {
    &__content {
      font-family: Arial, sans-serif;
      pre {
        background: #f5f5f5;
        padding: 8px;
        border-radius: 4px;
      }
    }
    
    &__toolbar {
      border-bottom: 1px solid #ddd;
      background: #f8f8f8;
    }
  }
}

// Custom text colors
.text-red { color: #ff0000; }
.text-blue { color: #0000ff; }
.text-green { color: #00ff00; }
.text-yellow { color: #ffff00; }
.text-black { color: #000000; }

// Custom background colors
.bg-red { background-color: #ffebee; }
.bg-blue { background-color: #e3f2fd; }
.bg-green { background-color: #e8f5e9; }
.bg-yellow { background-color: #fffde7; }
.bg-white { background-color: #ffffff; }
</style>