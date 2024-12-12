<template>
  <q-expansion-item
    v-model="isExpanded"
    :label="client.name"
    :caption="client.status"
    expand-separator
    hide-expand-icon
    @click="selectClient(client)"
    :class="{'c-selected-client': client.uuid == clientStore.theClient.uuid}">
    <!-- Client icon and name -->
    <template v-slot:header>
      <HoverButton :buttons="hoverButtonList" :item="client" :show-extra="true" :hide-background="true">
        <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
          <div class="row items-center" >
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="business" color="primary" />
              </q-avatar>
            </q-item-section>
            <span class="c-title">{{ client.name }}</span>
          </div>
        </div>
        <template #dropdown-content-1="{ formData, 'onUpdate:formData': updateData }">
          <q-list>
            <q-item ref="productBtn" clickable @click.stop="(e)=> openNewProduct(client, e)">
              product
            </q-item>
            <q-item clickable @click.stop="openNewPersonna(client, $event)">
              audience
            </q-item>
            <q-item clickable v-close-popup @click.stop="openNewMarket(client, $event)">
              campaign
            </q-item>
          </q-list>
        </template>

      </HoverButton>
    </template>

    <!-- Expanded content -->
    <q-card v-if="isExpanded">
      <q-tabs
        :model-value="tab"
        @update:model-value="updateTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        no-transition
        narrow-indicator>
        <q-tab name="page" label="Pages" />
        <q-tab name="marketRecurrence" label="Campaigns" />
        <q-tab name="market" label="market" />
        <q-tab name="product" label="Products" />
        <q-tab name="customer" label="Audiences" />
        <q-tab name="knowledge" label="Knowledges" />
      </q-tabs>

      <q-separator />

      <q-tab-panels :model-value="tab" no-transition >
        <q-tab-panel name="page">
          <Pages></Pages>
        </q-tab-panel>
        <q-tab-panel name="marketRecurrence">
          <MarketRecurrence></MarketRecurrence>
        </q-tab-panel>

        <q-tab-panel name="market">
          <Markets></Markets>
        </q-tab-panel>

        <q-tab-panel name="product">
          <Products></Products>
        </q-tab-panel>

        <q-tab-panel name="customer">
          <Personas></Personas>
        </q-tab-panel>
        
        <q-tab-panel name="knowledge">

        </q-tab-panel>

      </q-tab-panels>
    </q-card>
    <CampaignForm v-model="showCampaignForm"></CampaignForm>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { ref, provide, reactive } from 'vue';
import type { clientObject } from '@/src/repository/client/Interface'
import { Client } from '~/src/repository/client/Client';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { useClientStore } from '~/src/stores/clientStore';
import Markets from '@/src/components/client/Markets.vue';
import Pages from '@/src/components/client/Pages.vue';
import Products from '@/src/components/client/Products.vue';
import Personas from '@/src/components/client/Personas.vue';
import { Product } from '~/src/repository/product/Product';
import { Persona } from '~/src/repository/persona/Persona';
import { Market } from '@/src/repository/market/Market'
import MarketRecurrence from './MarketRecurrence.vue';

import CampaignForm from '~/src/components/sidePanel/CampaignForm.vue'
// PROPS - EMIT
const props = defineProps<{
  client: clientObject;
}>();

const emit = defineEmits(['setCurrentClient'])

// MAIN OBJECT SETUP 

let theClient = reactive<Client>(new Client(null))

provide('theClient', theClient)

// REF - REACTIVE - VAR
const mainDisplayStore = useMainDisplayStore()
const clientStore = useClientStore()
const showCampaignForm = ref(false)
const tab = ref('page')
const isExpanded = ref(false) // Track the expansion state
const hoverButtonList = computed(()=> { return [
{
    icon: 'fa fa-pen',
    action: editClient,
    color: 'white',
    textColor:'secondary'
  },
{
    isDropdown: true,
    icon: 'fa fa-plus',
    color: 'positive',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item?',
    actionButtonText: 'Delete',
    onConfirm: async (formData:any, event:Event) => {
      console.log('Deleting with data:', formData);
    },
    showHeader:false,
    showButton:false
  },
]})

// FUNCTION

const updateTab = (value: string) => {
  tab.value = value
};

const selectClient = (client: clientObject) => {
  console.log('selecting client')
 setupTheClient(client)
  //mainDisplayStore.setCurrentClient(theClient)
 /* if(theClient.uuid != client.uuid){
    console.log(client)
    Object.assign(theClient, new Client(client))

    console.log(theClient)
  }
  else{
    // If you want to clear the client:
    // Object.assign(theClient, new Client(null))


  }*/
}

const editClient = async (event:Event) => {
  //e.preventDefault();
  setupTheClient(props.client)
  // Set the trigger rect before is disapear from the page
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  await theClient.getBio();
  await theClient.getStyle();

  if(!theClient.style){
    await theClient.createStyle()
  }

  const popup = {
    client: theClient,
    view: 'ClientEditor',
    isOpen: true,
    triggerElement: triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const openNewProduct = (client:clientObject, event:Event)=>{
  console.log('helo')
  setupTheClient(client)
  //tab.value = 'product'
  //isExpanded.value = true
  const product = new Product(null)
  product.clientUuid = theClient.uuid
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const popup = {
    client: theClient,
    view: 'EditProductBox',
    isOpen: true,
    item:product,
    triggerElement: triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)

}

const openNewPersonna = (client:clientObject, event:Event)=>{
  console.log('helo')
  setupTheClient(client)
  const persona = new Persona(null)


  persona.clientUuid = theClient.uuid
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const popup = {
    client: theClient,
    view: 'EditPersonaBox',
    isOpen: true,
    item:persona,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const openNewMarket = (client:clientObject, event:Event)=>{
  console.log('helo')
  setupTheClient(client)

  theClient.getPersonas()
  theClient.getProducts()

  showCampaignForm.value = true

}

const setupTheClient = (client:clientObject) =>{
  if(!theClient.uuid){
   Object.assign(  theClient , new Client(client))
  }
  console.log(theClient)
  clientStore.setClient(theClient)
}
</script>

<style lang="scss">
.c-expansion-header-btn{
  opacity: 0;
  transition:0.25s;
}

.c-expansion-header-hover:hover{
  .c-expansion-header-btn{
      opacity: 1;
    }
}

.c-title{
  font-size:16px;
}
</style>
