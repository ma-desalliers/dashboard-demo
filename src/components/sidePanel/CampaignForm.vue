<template>
  <side-panel v-model="showSidePanel" :btn-action="createCampaign" @show="atShow" title="Nouvelle Campagne" :width="550">
  <div class="" v-if="showSidePanel">
    <!-- Section 1: Simple Q-Expansion-Item -->
     <div class="section-container">
    <q-expansion-item
      :default-opened="false" 
      icon="settings"
      label="General Settings"
      class="q-mb-md c-no-border q-pt-sm"
    >
    <template #header>
      <span class="c-box-title">
        Entreprise
      </span>
    </template>
      <q-card :bordered="false">
        <q-card-section>
         <ClientForm></ClientForm>  
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>

  <div class="section-container q-pa-md column q-col-gutter-md">
    <div class="c-box-title">Market</div>
    <SelectProduct v-model="selectedProductIds"></SelectProduct>

    <SelectPersona v-model="selectedPersonaIds" @persona-selected="onPersonaSelected"> </SelectPersona>

    <sector-industry-selector v-model="theMarketRecurrence.subIndustryId" :gics="theMarketRecurrence.gics" class="col-6"></sector-industry-selector>
    <location-editor
      v-model:country-id="theMarketRecurrence.countryId"
      v-model:state-id="theMarketRecurrence.stateId"
      v-model:city-id="theMarketRecurrence.cityId"
      class="col-12"></location-editor>
  </div>
 
  <div class="section-container q-mb-md">
    <!-- Always visible header -->
    <div class="row q-px-md justify-between">
      <span class="c-box-title">Topic</span>
     <!-- <q-select
        v-model="section.selected"
        :options="section.options"
        multiple
        outlined
        dense
        class=""
      />-->
    </div>

    <!-- Collapsible list section 
    <q-expansion-item class="c-no-border">
      <template #header>
        <div class="text-subtitle2">Selected Items ({{ section.selected.length }})</div>
      </template>

      <q-card>
        <q-card-section>
          <q-list>
            <q-item v-for="item in section.selected" :key="item">
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-expansion-item>-->
  </div>
  
    <!-- Section 5: Campaign Recursion Form -->

    <div class="section-container">
     <MarketRecurrency v-model="theMarketRecurrence" :is-stand-alone="true" flat></MarketRecurrency>
    </div>
  </div>
</side-panel>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Product } from '~/src/repository/product/Product';
import { useClientStore } from '~/src/stores/clientStore';
 import { useMainDisplayStore} from '@/src/stores/mainDisplayStore';
import { Persona } from '~/src/repository/persona/Persona';
import MarketRecurrency from '@/src/components/mainDisplay/MarketRecurrency.vue';
import { MarketRecurrence } from '~/src/repository/marketRecurrence/MarketRecurrence';
import { Market } from '~/src/repository/market/Market';

import SelectProduct from './campaignForm/SelectProduct.vue';
import SelectPersona from './campaignForm/SelectPersona.vue';
import CampaignLocation from '../utilities/LocationEditor.vue';
import ClientForm from '../mainDisplay/ClientForm.vue';

const clientStore = useClientStore()
const mainDisplayStore = useMainDisplayStore()
const theMarketRecurrence: MarketRecurrence = reactive(new MarketRecurrence(null))


const selectedProductIds = ref<string>()
const selectedPersonaIds = ref<string>()
const showSidePanel = ref(false)

const theClient = computed(()=>{
  return clientStore.theClient
})

const atShow =() =>{
  console.log('showung')
  showSidePanel.value = true
}

const onPersonaSelected = (persona : Persona | undefined) =>{
  if(!persona) return
  
  theMarketRecurrence.gics = persona.gics
  theMarketRecurrence.subIndustryId = persona.subIndustryId

  theMarketRecurrence.countryId = persona.countryId
  theMarketRecurrence.stateId = persona.stateId
  theMarketRecurrence.cityId = persona.cityId
}

const createCampaign  = async () =>{
  const market = new Market(null)
  market.clientUuid = theClient.value.uuid
  market.productUuid = selectedProductIds.value || ''
  market.personaUuid = selectedPersonaIds.value || ''

  await market.create()

  theMarketRecurrence.marketUuid = market.uuid

  await theMarketRecurrence.create()

  selectedProductIds.value = ''
  selectedPersonaIds.value = ''
  showSidePanel.value = false
}


</script>

<style scoped>
.q-expansion-item :deep(.q-expansion-item__container) {
  border: 1px solid #ddd;
  border-radius: 4px;
}


.section-container{
  border-bottom:1px #dddddd solid;
}

.q-item.clickable {
  cursor: pointer;
}

.q-item.clickable:hover {
  background-color: #f5f5f5;
}

</style>