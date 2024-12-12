<template>
  <div class="select-product">
    <span class="c-box-title">Select Product</span>
    <q-list separator>
      <q-item 
        v-if="theClient?.uuid"
        v-for="item in theClient.products"
        :key="item.uuid"
        clickable
        :active="theMarket.productUuid === item.uuid"
        active-class="bg-primary text-white"
        @click="selectProduct(item)"
      >
        <q-item-section>
          {{ item.name }}
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

const selectProduct = (product: any) => {
  // Update the store
  theMarket.value.productUuid = product.uuid
  store.updateMainDisplay({
    item: {
      ...theMarket.value,
    }
  })

  console.log(product)
  
  // Emit the selected product for the wizard
  emit('update:modelValue', product)
}
</script>

<style scoped>
.select-product {
  width: 100%;
}

.header-row {
  background-color: #f5f5f5;
}
</style>