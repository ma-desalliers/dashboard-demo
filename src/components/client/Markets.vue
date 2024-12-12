<template>
  <div>
    <div class="row justify-between q-mb-md">
      <div class="row q-col-gutter-sm col-11">
        <q-input
          v-model="search"
          class="col-12 col-sm-4"
          dense
          outlined
          placeholder="Rechercher">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          label="Status"
          dense
          outlined
          class="col-12 col-sm-2"/>

        <q-select
          v-model="publishFilter"
          :options="publishOptions"
          label="Publication"
          dense
          outlined
          class="col-12 col-sm-2"/>
      </div> 
        <div class="col-1 row justify-end">
          <div >
            <q-btn size="sm" round color="positive" @click="addMarket($event)"><i class="fa fa-plus"></i></q-btn>
          </div>
        </div>
    </div>

    <q-list separator class="c-client-list">
      <q-item class="header-row">
        <q-item-section side class="rs-column">
          <div class="text-subtitle1 text-weight-medium">Active</div>
        </q-item-section>
        <q-item-section class="title-column">
          <div class="text-subtitle1 text-weight-medium">Title</div>
        </q-item-section>
        <q-item-section class="type-column">
          <div class="text-subtitle1 text-weight-medium">Type</div>
        </q-item-section>
        <q-item-section class="date-column">
          <div class="text-subtitle1 text-weight-medium">Date</div>
        </q-item-section>
        <q-item-section class="feedback-column">
          <div class="text-subtitle1 text-weight-medium">Feedback</div>
        </q-item-section>
      </q-item>

      <q-item v-for="market in theClient?.markets" :key="market.uuid" class="">
        <q-item-section side class="rs-column">
          <span v-if="market.isActive"><i class="fa fa-check fa-fw text-positive"></i></span>
          <span v-else><i class="fa fa-times fa-fw text-negative"></i></span>
        </q-item-section>
        
        <q-item-section class="title-column">
          <hover-button :buttons="hoverButtonList" :item="market" :show-extra="true"> 
            <div class="title-wrapper c-pointer" >
              Persona: {{ market.persona?.title }} <br> Product : {{ market.product?.name}}
            </div>
            <template #dropdown-content-2="{ formData, 'onUpdate:formData': updateData }">
              <div class="c-box-title">
                Recurrences : 
              </div>
              <q-list class="q-pb-sm">
                <q-item class="q-pl-none row items-center" v-for="recurrence in market.recurrences?.filter(recurrence => recurrence.uuid)" >
                  <span class="q-pr-sm">{{ recurrence.state }} - </span>
                  <span>{{ recurrence.type }} &nbsp;</span>
                  <span v-if="recurrence.startDate">{{ dateHandler.formatDayMonth(new Date(recurrence.startDate)) }}
                    <span v-if="recurrence.endDate"> - {{ dateHandler.formatDayMonth(new Date(recurrence.endDate)) }}</span>
                  </span>

                  <div class="q-mb-xs q-pl-sm row q-col-gutter-sm">
                    <div v-if="recurrence.state == 'active'">
                      <q-btn  round dense size="sm" color="default" text-color="warning" @click="pauseRecurrence(recurrence)"><i class="fa fa-pause"></i></q-btn>
                    </div>
                    <div v-if="recurrence.state == 'paused'">
                      <q-btn  round dense size="sm" color="default" text-color="positive" @click="resumeRecurrence(recurrence)"><i class="fa fa-play"></i></q-btn>
                    </div>
                    <div v-show="false" v-if="recurrence.state == 'paused'">

                      <q-btn round dense size="sm" color="default" text-color="negative" @click="stopRecurrence(recurrence)"><i class="fa fa-stop"></i></q-btn>
                    </div>
                  </div>
                </q-item>
              </q-list>
              <div v-if="!market.recurrences" class="row justify-center q-pa-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
              <div class="row justify-between">
                <div>
                  <q-btn color="default" text-color="#333333" label="See all"></q-btn>
                </div>
                <div>
                  <q-btn icon="fa fa-plus" color="positive" @click="setRecurrency($event, market)"></q-btn>
                </div>
              </div>
            </template>
            <template #dropdown-content-3="{ formData, 'onUpdate:formData': updateData }">
              <language-select v-model="formData.lang" default="English"></language-select>
            </template>

          </hover-button>
        </q-item-section>

        <q-item-section class="type-column">
          <div class="text-body2 text-grey-7">
            market
          </div>
        </q-item-section>

        <q-item-section class="date-column">
          <div class="text-body2 text-grey-7">
            {{ dateHandler.formatDayMonth(market.createdAt) }}
          </div>
        </q-item-section>

        <q-item-section class="feedback-column">
          <div class="row q-gutter-sm justify-end">
            <q-btn flat round size="sm" color="green" icon="thumb_up" />
            <q-btn flat round size="sm" color="red" icon="thumb_down" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {  ref, type Reactive  } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import MarketExpensionItem from '@/src/components/client/MarketExpensionItem.vue'
import { Client } from '@/src/repository/client/Client'
import { Market } from '~/src/repository/market/Market';
import { Product } from '~/src/repository/product/Product';
import { Persona } from '~/src/repository/persona/Persona'; 
import dateHandler from '~/src/asset/composable/date';
import type { marketObject } from '~/src/repository/market/Interface';
import { MarketRecurrence } from '~/src/repository/marketRecurrence/MarketRecurrence';
import { date } from 'quasar';

// Rest of your constants...
const statusOptions = ['Tous', 'Prospects', 'Client'] as const
const publishOptions = ['Tous', 'Publié'] as const

// Reactive state
const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')

const mainDisplayStore = useMainDisplayStore()

const theClient = inject<Reactive<Client | null>>('theClient')

  const hoverButtonList = computed(()=>{
    return [
    {
      icon: 'fa fa-box',
      action:  viewProduct,
      color: 'default',
      title:'View Product',
      textColor:'#333333'
    },
    {
      icon: 'fa fa-user',
      action:  viewPersona,
      color: 'default',
      textColor:'#333333'
    },
    {
      isDropdown: true,
      icon: 'fa-solid fa-list',
      color: 'default',
      textColor:'#333333',
      title: 'See the recurrence',
      description: '',
      actionButtonText: '',
      showHeader:false,
      showButton:false,
      onOpen:onRecurrenceDropdownOpen
    },
    {
      isDropdown: true,
      icon: 'fa-regular fa-lightbulb',
      color: 'default',
      textColor: 'secondary',
      title: 'Generate Idea',
      description: '',
      actionButtonColor:'secondary',
      actionButtonText: 'Generate',
      onConfirm: async (formData:any, market: any) => {
        generateIdeas(formData,market)
      },
    }
]}) 

onMounted(async () => {
  console.log('mounted')
  if(theClient){
    const products = await theClient.getMarkets()

    console.log(products) 
  }

  console.log(theClient)
})

const viewMarket = (market : Market)=>{
  const mainDisplayValues = {
    client:theClient,
    view: 'MarketEditor',
    item: market,
  }
  mainDisplayStore.updateMainDisplay(mainDisplayValues)
}

const addMarket = async (event:Event) =>{
  const market = new Market(null)
  if(theClient?.uuid){
    market.clientUuid = theClient?.uuid
    const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
    await theClient.getPersonas()
    await theClient.getProducts()

    const popup = {
      client: theClient,
      view: 'NewMarket',
      isOpen: true,
      item:market,
      triggerElement:triggerRect
    }
    mainDisplayStore.updatePopupDisplay(popup)
  }
} 

const generateIdeas = async (params:any, market:marketObject) =>{
  const theMarket = new Market(market)
  await theMarket.generateIdeas(params.lang)
}

const viewProduct = (event:Event, market:Market) =>{
  if(!market.product) return
  const theProduct = new Product(market.product)
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const popup = {
    client: theClient,
    view: 'EditProductBox',
    isOpen: true,
    item:theProduct,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const viewPersona =  (event:Event, market:Market) =>{
  if(!market.persona) return
  const thePersona = new Persona(market.persona)

  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const popup = {
    client: theClient,
    view: 'EditPersonaBox',
    isOpen: true,
    item:thePersona,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const onRecurrenceDropdownOpen = (market:Market) =>{
  market.getRecurrences()
}

const setRecurrency = (event:Event, market:Market) =>{
  console.log('set recurrency')
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const theRecurrence = new MarketRecurrence(null)
  theRecurrence.marketUuid = market.uuid
  theRecurrence.type = 'free-trial'
   theRecurrence.recurrenceFrequency = 'weekly'

  if(!market.recurrences) market.recurrences = []
  market.recurrences.push(theRecurrence)
  const popup = {
    client: theClient,
    view: 'MarketRecurrency',
    isOpen: true,
    item:theRecurrence
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const pauseRecurrence = (recurrence:MarketRecurrence) =>{
  recurrence.pause()
}

const resumeRecurrence = (recurrence:MarketRecurrence) =>{
  recurrence.resume()
}
const stopRecurrence = (recurrence:MarketRecurrence) =>{
  recurrence.stop()
}
</script>

<style scoped lang="scss">
h1 {
  color: #42b983;
}

.c-client-list {
  .q-item {
    padding: 8px 16px;
    min-height: 48px;
    position: relative;
  }

  .header-row {
    border-bottom: 1px solid #ddd;
  }

  // Avatar styling
  .q-avatar {
    font-size: 12px;
    background: rgba(244, 143, 177, 0.15) !important;
    color: #d81b60 !important;
  }

  // Column layouts
  .rs-column {
    flex-grow: 0.3;
   /* width: 48px;
    min-width: 48px;*/
  }

  .title-column {
    /*min-width: 200px;
    max-width: 300px;*/
    flex-grow:5.5;
    .title-wrapper {
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .type-column {
    flex-grow: 1;  // Allow type column to take remaining space
    padding-left: 16px;
    padding-right: 16px;
  }

  .date-column {
    flex-grow:1;
    //min-width: 100px;
  }

  .feedback-column {
    flex-grow:1.1;
    /*width: 100px;
    min-width: 100px;*/

    .q-btn {
      margin: 0 4px;
      opacity: 0.7;
      
      &:hover {
        opacity: 1;
      }
    }
  }

  // Adjust feedback buttons container
  .row.q-gutter-sm {
    margin: 0 -4px;
  }
}
</style>