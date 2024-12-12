<template>
  <div class="single-edit-box q-pa-md">
    <div class="q-pb-md">
      <span class="c-box-title ">Edit an Andience</span>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="persona.title"
          label="Title"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="persona.description"
          label="Description"
          type="textarea" input-style="min-height:150px" class="c-textarea" 
          textarea
          outlined
          dense
          autogrow
        />
      </div>
      <sector-industry-selector v-model="persona.subIndustryId" :gics="persona.gics" class="col-12"></sector-industry-selector>
      <revenue-select v-model="persona.revenue" class="col-12"></revenue-select> 
      <location-editor class="col-12"
        v-model:country-id="persona.countryId"
        v-model:state-id="persona.stateId"
        v-model:city-id="persona.cityId" />
   
    </div>
    <div class="q-pt-md row justify-end">
      <q-btn size="sm" color="positive" icon="save" label="save" @click="updatePersona"></q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';

const emit = defineEmits(['mounted'])

const mainDisplayStore = useMainDisplayStore();
const persona = computed(() => mainDisplayStore.popup.item);

const updatePersona = async () => {
  if (persona.value) {
    if(persona.value.uuid){
      console.log(persona.value.countryId)
      await persona.value.update();
    }
    else{
      const thePersona =  await persona.value.create()
       mainDisplayStore.updatePopupDisplay({item:  persona} );
       
       if(mainDisplayStore.popup.client)
        mainDisplayStore.popup.client.addPersona(thePersona)
    }
  }

  mainDisplayStore.updatePopupDisplay({isOpen:false})
};


onMounted(()=>{
  emit('mounted', {width: '650px', height:'6500px'})
})
</script>

<style scoped>
.single-edit-box {
  /* Add any specific styles for the SingleEditBox component here */
}
</style>
