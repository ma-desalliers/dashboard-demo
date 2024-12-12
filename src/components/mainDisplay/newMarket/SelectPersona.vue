<template>
  <div class="select-persona">
    <span class="c-box-title">Select Persona</span>
    <q-list separator>
      
      <q-item 
        v-if="theClient?.uuid"
        v-for="item in theClient.personas"
        :key="item.uuid"
        clickable
        :active="props.modelValue?.uuid === item.uuid"
        active-class="bg-primary text-white"
        @click="selectPersona(item)"
      >
        <q-item-section>
          {{ item.title }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { QList, QItem, QItemSection } from 'quasar'

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const props = defineProps<{
  modelValue: any
}>()

const store = useMainDisplayStore()

const theClient = computed(() => store.popup.client)
const theMarket = computed(() => store.popup.item)

const selectPersona = (persona: any) => {
  // Update the store
  theMarket.value.personaUuid = persona.uuid
  store.updateMainDisplay({
    item: {
      ...theMarket.value,
    }
  })
  
  // Emit the selected persona for the wizard
  emit('update:modelValue', persona)
}
</script>

<style scoped>
.select-persona {
  width: 100%;
}

.header-row {
  background-color: #f5f5f5;
}
</style>