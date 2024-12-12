<template>
  <div class="confirm">
    <div class="summary">

          <div class="c-box-title">Market Summary</div>
          <div class="q-mt-md">
            <div class="row items-center q-mb-sm">
              <div class="text-subtitle1 text-weight-medium">Product:</div>
              <div class="q-ml-md">{{ getProductName  }}</div>
            </div>
            <div class="row items-center">
              <div class="text-subtitle1 text-weight-medium">Persona:</div>
              <div class="q-ml-md">{{ getPersonaTitle  }}</div>
            </div>
          </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMainDisplayStore } from '@/src//stores/mainDisplayStore'
import { QCard, QCardSection } from 'quasar'

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const steps = inject('steps') as any []

const store = useMainDisplayStore()

const theClient = computed(() => store.popup.client)
const theMarket = computed(() => store.popup.item)

const getProductName = computed(() => {

  return theClient.value?.products?.find(p => p.uuid === theMarket.value.productUuid)?.name || ''
})

const getPersonaTitle = computed(() => {
  return theClient.value?.personas?.find(p => p.uuid === theMarket.value.personaUuid)?.title || ''
})

// Emit true when component is mounted to indicate the summary is ready
emit('update:modelValue', true)
</script>

<style scoped>
.confirm {
  width: 100%;
}
</style>