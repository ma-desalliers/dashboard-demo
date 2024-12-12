
<template>
    <!-- Always visible header -->

      <!-- <q-select
        label="category"
        v-model="section.selected"
        :options="section.options"
        multiple
        outlined
        dense
        class="col-6"
      />-->

  <div class="">
    <MultiSelect 
      v-model="selectedProductIds"
      :options="productList"
      :hover-buttons="hoverButtonList"
      :label-name="'name'"
      label="Product"
      allow-add
      :add-component="'EditProductBox'"
      :add-function="addProduct">
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import { Product } from '~/src/repository/product/Product';
import { useClientStore } from '~/src/stores/clientStore';
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';

const props = defineProps({
  modelValue:String
})
const emit = defineEmits(['update:modelValue']) 

const clientStore = useClientStore()
const mainDisplayStore = useMainDisplayStore()

const selectedProductIds = computed({
  get: () => props.modelValue || [],
  set: (value: string[]) => emit('update:modelValue', value)
})

const theClient = computed(()=>{
  return clientStore.theClient
})

const productList = computed(()=>{
  return clientStore.theClient.products || []
})

const hoverButtonList = computed(() => {
  return [
    {
      icon: 'fa fa-pen',
      action: viewProductDescription,
      color: 'default',
      textColor: '#333333'
    }
  ]
})

const addProduct = (event : Event) =>{
  const product = new Product(null)
  product.clientUuid = theClient.value.uuid
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const popup = {
    client: theClient.value,
    view: 'EditProductBox',
    isOpen: true,
    item:product,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

// Add view product function
const viewProductDescription = async (event: Event, product: Product) => {
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const popup = {
    client: theClient.value,
    view: 'EditProductBox',
    isOpen: true,
    item: product,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}



</script>