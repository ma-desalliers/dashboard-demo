<template>
  <div class="q-gutter-y-xs">
    <template v-for="(item, index) in visibleItems" :key="index">
      <div class="row items-center bg-grey-2 rounded-borders q-py-xs q-px-sm text-body2">
        <div class="col">{{ item }}</div>
        <div class="col-auto">
          <q-btn
            round
            dense
            flat
            color="grey-6"
            icon="close"
            size="sm"
            @click="handleRemove(index)"
          />
        </div>
      </div>
    </template>
    
    <q-btn
      v-if="!isExpanded && localItems.length > 3"
      flat
      class="full-width bg-grey-3"
      @click="isExpanded = true"
    > 
      +{{ remainingCount }} more items
    </q-btn>
    
    <q-btn
      v-if="isExpanded && localItems.length > 3"
      flat
      class="full-width bg-grey-3"
      @click="isExpanded = false"
    >
      Show less
    </q-btn>
    
    <q-input
      v-model="inputValue"
      type="textarea"
      dense
      outlined
      autogrow
      :placeholder="$t('add-new-item')"
      @keydown.enter.prevent="handleEnter"
    >
      <template v-slot:append>
        <q-btn
          round
          dense
          flat
          color="primary"
          icon="add"
          @click="handleEnter"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: string[] | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const isExpanded = ref(false)
const inputValue = ref('')
const localItems = ref<string[]>([])

// Initialize localItems with props value
watch(() => props.modelValue, (newValue) => {
  if(newValue){
    localItems.value = [...newValue]
    return
  }
  localItems.value = []
}, { immediate: true })

const visibleItems = computed(() => {
  if (localItems.value.length <= 3) return localItems.value
  return isExpanded.value ? localItems.value : localItems.value.slice(0, 2)
})

const remainingCount = computed(() => 
  localItems.value.length - 2
)

const handleEnter = () => {
  if (!inputValue.value.trim()) return

  const newItems = inputValue.value
    .split('\n')
    .map(item => item.trim())
    .filter(item => item)

  if (newItems.length > 0) {
    localItems.value = [...localItems.value, ...newItems]
    emit('update:modelValue', localItems.value)
    inputValue.value = ''
  }
}

const handleRemove = (index: number) => {
  localItems.value = localItems.value.filter((_, i) => i !== index)
  emit('update:modelValue', localItems.value)
}
</script>

<style scoped>
.q-input :deep(.q-field__native) {
  min-height: 40px;
  line-height: 1.4;
}
</style>