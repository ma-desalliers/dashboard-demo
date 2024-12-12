
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


 <!-- Collapsible list section -->
 <div class="">
    <MultiSelect 
      v-model="selectedPersonaIds"
      :options="personaList"
      :hover-buttons="hoverButtonList"
      :label-name="'title'"
      label="Audience"
      allow-add
      :add-component="'EditPersonaBox'"
      :add-function="addPersona">
    </MultiSelect>
  </div>
</template>
<script setup lang="ts">
import { Persona } from '~/src/repository/persona/Persona';
import { useClientStore } from '~/src/stores/clientStore';
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';

const props = defineProps({
modelValue:String
})
const emit = defineEmits(['update:modelValue', 'persona-selected'])

const clientStore = useClientStore()
const mainDisplayStore = useMainDisplayStore()

const selectedPersonaIds = computed({
get: () => props.modelValue || [],
set: (value: string[]) =>{ 
  emit('update:modelValue', value)
  emitPersona(value)
}
})

const theClient = computed(()=>{
return clientStore.theClient
})

const personaList = computed(()=>{
return clientStore.theClient.personas || []
})



const hoverButtonList = computed(() => {
return [
 {
   icon: 'fa fa-pen',
   action: viewPersonaDescription,
   color: 'default',
   textColor: '#333333'
 }
]
})

const addPersona = (event : Event) =>{
  const persona = new Persona(null)
  persona.clientUuid = theClient.value.uuid
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const popup = {
    client: theClient.value,
    view: 'EditPersonaBox',
    isOpen: true,
    item:persona,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

// Add view persona function
const viewPersonaDescription = async (event: Event, persona: Persona) => {
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const popup = {
    client: theClient.value,
    view: 'EditPersonaBox',
    isOpen: true,
    item: persona,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}


const emitPersona = (selectedPersonaIds:any) =>{
  const fullPersonas = personaList.value.filter(persona => 
    selectedPersonaIds.includes(persona.uuid)
  )
  emit('persona-selected', fullPersonas[0])
}

onMounted(() => {
  if (selectedPersonaIds.value?.length) {
    const fullPersonas = personaList.value.filter(persona => 
      selectedPersonaIds.value == persona.uuid
    )
    emit('persona-selected', fullPersonas)
  }
})



</script>