<template>
  <div class="options-badges q-pa-md">
    <div class="q-pb-md">
    </div>
    <div class="column q-col-gutter-sm">
      <div v-for="option in currentItem?.options" :key="option.value" class="col-auto">
        <q-badge
          :label="option"
          :color="selectedOption === option.value ? 'primary' : 'grey-4'"
          :text-color="selectedOption === option.value ? 'white' : 'grey-8'"
          class="option-badge q-pa-sm cursor-pointer full-width row justify-center"
          @click="handleSave(option)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'


const emit = defineEmits(['mounted'])

const mainDisplayStore = useMainDisplayStore()

const currentItem = computed(() => mainDisplayStore.popup.item)

const selectedOption = ref<string | number | null>(null)


const handleSave = async (value : any) => {
  currentItem.value.closeFn({item:currentItem.value.item, value:value})
  mainDisplayStore.popPopup()
}

onMounted(() => {
  emit('mounted', { width: '250px', height: '450px' })
})
</script>

<style scoped lang="scss">
.option-badge {
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>