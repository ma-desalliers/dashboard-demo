<template>
  <q-card class="q-pa-md">
    <!-- Header Section -->
    <q-card-section>
      <div class="row justify-between"> 
        <div class="c-box-title">Editor</div>
        <div class="row q-col-gutter-sm">
          <div>
            <q-btn size="sm" round color="warning" @click="cancelChanges">
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
    <!-- Main Section -->
    <q-card-section>
      <div class="row q-col-gutter-md">
        <!-- Editor Component -->
        <Editor v-model="editorContent"  class="col-12" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { useClientStore } from '@/src/stores/clientStore';
import { storeToRefs } from 'pinia';
import Editor from '@/src/components/utilities/Editor.vue';

const emit = defineEmits(['mounted']);

const mainDisplayStore = useMainDisplayStore();
const clientStore = useClientStore();
const { popup } = storeToRefs(mainDisplayStore);

const editorContent = computed({
  get:() => {
  const currentPopup = mainDisplayStore.popupStack.find((popup) => popup.view == 'WysywygEditor')
  return currentPopup?.item || '';
  },
  set:(value) => {
    const currentPopup = mainDisplayStore.popupStack.find((popup) => popup.view == 'WysywygEditor')
    currentPopup.item = value
  }
})

const theClient = computed(() => clientStore.theClient);

const cancelChanges = () => {
  mainDisplayStore.popPopup();
};

onMounted(() => {
  emit('mounted', { width: '750px', height: '550px' });
});

watch(() => theClient.value.uuid, (newUuid) => {
  if (newUuid) {
    setupValues();
  }
});
</script>

<style scoped>
.c-box-title {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
