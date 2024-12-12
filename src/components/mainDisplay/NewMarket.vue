<template>
  <div class="create-market">
    <div class="c-box-title q-pa-md">Create new Campaign</div>
    <WizardForm
      :steps="steps"
      @complete="handleMarketCreation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import SelectProduct from '@/src/components/mainDisplay/newMarket/SelectProduct.vue'
import SelectPersona from '@/src/components/mainDisplay/newMarket/SelectPersona.vue'
import Confirm from '@/src/components/mainDisplay/newMarket/Confirm.vue'
import { Product } from '~/src/repository/product/Product';
import { Persona } from '~/src/repository/persona/Persona';
import  { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import Personas from '@/src/components/client/Personas.vue';


const emit = defineEmits(['mounted'])

const mainDisplayStore = useMainDisplayStore()

interface MarketData {
  product?: {
    uuid: string
    name: string
    // Add other product properties as needed
  }
  persona?: {
    uuid: string
    title: string
    // Add other persona properties as needed
  }
}

const theMarket = computed(()=>{
  return mainDisplayStore.popup.item
})

const marketData = ref<MarketData>({})

const steps =  [
  { 
    component: SelectProduct,
    value: new Product(null)
  },
  { 
    component: SelectPersona,
    value: new Persona(null)
  },
  { 
    component: Confirm,
    value: null
  }
]
provide('steps', steps)

const handleMarketCreation = async (values: any[]) => {
  const [product, persona, confirmed] = values
  
  if (confirmed) {
    await theMarket.value.create()
    theMarket.value.persona = persona
    theMarket.value.product = product
    mainDisplayStore.popup.client?.addmarkets(theMarket.value)
  }

  mainDisplayStore.updatePopupDisplay({isOpen:false})
}

onMounted(()=>{
  emit('mounted', {width: '650px', height:'450px'})
})
</script>