<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="row justify-between"> 
        <div class="c-box-title">Edit Client Profile</div>
        <div class="row q-col-gutter-sm">
          <div>
            <q-btn size="sm" round color="warning">
              <i class="fa fa-times"></i>
            </q-btn>  
          </div>
          <div>
            <q-btn size="sm" type="submit" round color="positive" @click="saveChanges">
              <i class="fa fa-check"></i>
            </q-btn>  
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-md">
      
        <q-input
          v-model="preferredColor"
          outlined
          label="Preferred Color"
          class="q-mb-md col-6"
        >
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-color v-model="preferredColor" />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      <q-input outlined 
        v-model="favicon"
        label="Favicon Url" 
        class="q-mb-md col-6"></q-input>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { useClientStore } from  '@/src/stores/clientStore'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['mounted'])

const mainDisplayStore = useMainDisplayStore()
const clientStore = useClientStore()
const { popup } = storeToRefs(mainDisplayStore)
const bio = ref('')
const preferredColor = ref('#000000')
const favicon = ref('')

const theClient = computed(()=>{
  return clientStore.theClient
})

const saveChanges = async () => {
  if (bio.value !== theClient.value.bio.bio) {
    theClient.value.bio.bio = bio.value
    await theClient.value.createBio()
  }   
  const colorChanged =  !theClient.value.style || preferredColor.value !== theClient.value.style.primaryColor
  const faviconChanged = !theClient.value.style || favicon.value !== theClient.value.style.favicon
  if (colorChanged || faviconChanged) {
    await theClient.value.updateStyle(preferredColor.value, favicon.value)
  }
//https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://cameleonmedia.com&size=256
  mainDisplayStore.setPopupOpen(false)
}

const setupValues = ()=>{
  if(!theClient.value) return
  if(!theClient.value.bio){
    theClient.value.bio = {bio: ''}
  }
  bio.value = theClient.value.bio.bio

  if(!theClient.value.style){
    preferredColor.value = '#000000'
    favicon.value = ''
  }
  else{
    preferredColor.value = theClient.value.style.primaryColor
    favicon.value = theClient.value.style.favicon
  }
}

onMounted(()=>{
  if(theClient.value && theClient.value.uuid){
    setupValues()
  }

  emit('mounted', {width: '750px', height:'550px'})
})

watch(() => theClient.value.uuid, (newUuid) => {
  if (newUuid) {
    setupValues()
  }
})
</script>