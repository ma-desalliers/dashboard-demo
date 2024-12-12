<template>
  <div class="single-edit-box q-pa-md">
    <div class="q-pb-md">
      <span class="c-box-title">Edit Category</span>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
          v-model="category.name"
          label="Title"
          outlined
          dense
        />
      </div>
      <div class="col-12">
        <q-input
          v-model="category.description"
          label="Description"
          type="textarea" 
          input-style="min-height:150px" 
          class="c-textarea" 
          outlined
          dense
          autogrow
        />
      </div>
    </div>
    <div class="q-pt-md row justify-end">
      <q-btn size="sm" color="positive" icon="save" label="save" @click="updateCategory"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { useClientStore } from '~/src/stores/clientStore';
const emit = defineEmits(['mounted'])
const mainDisplayStore = useMainDisplayStore()
const clientStore = useClientStore()

const category = computed(() => mainDisplayStore.popup.item)
const theClient = computed(()=> clientStore.theClient)

const updateCategory = async () => {
  if (category.value) {
    if(category.value.uuid){
      await category.value.update()
    } else {
      category.value.clientUuid = theClient.value.uuid
      const newCategory = await category.value.create()
      theClient.value.addCategory(newCategory)
    }
  }
  mainDisplayStore.updatePopupDisplay({isOpen:false})
}

onMounted(() => {
  emit('mounted', {width: '650px', height:'350px'})
})
</script>