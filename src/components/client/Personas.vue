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
            <q-btn size="sm" round color="positive" @click="addPersona($event)"><i class="fa fa-plus"></i></q-btn>
          </div>
        </div>
    </div>

    <q-list separator class="c-client-list">
    <q-item class="header-row">
      <q-item-section side class="rs-column">
        <div class="text-subtitle1 text-weight-medium">RS</div>
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

    <q-item v-for="persona in theClient?.personas" :key="persona.uuid" class="">
      <q-item-section side class="rs-column">
        <q-avatar size="24px" color="pink-1" text-color="pink">
          <span>1</span>
        </q-avatar>
      </q-item-section>
      
      <q-item-section class="title-column">
        <hover-button :buttons="hoverButtonList" :item="persona" :show-extra="true">
          <div class="title-wrapper c-pointer">
            {{ persona.title }}
          </div>
        </hover-button>
      </q-item-section>

      <q-item-section class="type-column">
        <div class="text-body2 text-grey-7">
          persona
        </div>
      </q-item-section>

      <q-item-section class="date-column">
        <div class="text-body2 text-grey-7">
          {{dateHandler.formatDayMonth(persona.createdAt)}}
        </div>
      </q-item-section>

      <q-item-section class="feedback-column">
        <div class="row q-gutter-sm justify-end">
          <q-btn flat round size="sm" color="green" icon="thumb_up" @click="giveFeedback(persona.uuid, 'positive')" />
          <q-btn flat round size="sm" color="red" icon="thumb_down" @click="giveFeedback(persona.uuid, 'negative')" />
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
import { Client } from '~/src/repository/client/Client'
import dateHandler from '~/src/asset/composable/date';
import type { personaObject } from '@/src/repository/persona/Interface';
import { Persona } from '~/src/repository/persona/Persona';
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
    icon: 'fa fa-pen',
    action:  viewPersonaDescription,
    color: 'default',
    textColor:'#333333'
  }
]}) 

onMounted(async () => {
  console.log('mounted')
  if(theClient){
    const personas = await theClient.getPersonas()

    console.log(personas) 
  }

  console.log(theClient)
})

const giveFeedback = (personaId:string, type:string) => {
  console.log(`Feedback ${type} given for persona ${personaId}`)
}

const viewPersonaDescription = async (event:Event, persona: Persona) => {
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

const addPersona = (event :Event) =>{
  const persona = new Persona(null)
  if(theClient?.uuid){
    persona.clientUuid = theClient?.uuid

    viewPersonaDescription(event,persona)
  
  }
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