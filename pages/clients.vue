<template>
  <div class="row q-col-gutter-md q-pa-md">
    <!-- Search and filters section -->
    <div :class="{'col-7':resolveComponent, 'col-12' :!resolvedComponent}">
      <div class="row q-col-gutter-sm q-mb-md">
        <q-input
          v-model="filter.search"
          @update:model-value="(val:any) => handlePageChange(currentPage)"
          debounce="1000"
          class="col-12 col-sm-4"
          dense
          autofocus
          outlined
          placeholder="Rechercher">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <!--<q-select
          v-model="statusFilter"
          :options="statusOptions"
          label="Status"
          dense
          outlined
          class="col-12 col-sm-2" />

        <q-select
          v-model="publishFilter"
          :options="publishOptions"
          label="Publication"
          dense
          outlined
          class="col-12 col-sm-2" />-->
      </div>
      <!-- Client list with accordion -->
      <q-list bordered separator class="c-client-list">

        <ClientExpansionItem
          v-for="client in clientList"
          :key="client.uuid"
          :client="client"
          :tab="tab" />

        <!-- Pagination controls -->
        <div class="row justify-center q-pa-md">
          <q-pagination
            v-model="currentPage"
            :max="clientStore.pagination.totalPages"
            :max-pages="6"
            boundary-numbers
            direction-links
            @update:model-value="handlePageChange"
          />
        </div>
        <div v-if="clientStore.loading" class="row justify-center q-pa-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </q-list>
    </div>

    <div :class="{'col-5':resolveComponent}" style="margin-top: 55px;">
      <q-card square bordered flat style="height:calc(100vh - 160px)"> 
        <q-card-section style="height:100%; overflow: auto;">
          <q-inner-loading :showing="false" color="primary">
            <q-spinner-dots size="40px" color="primary" />
          </q-inner-loading>
          <component :is="resolvedComponent" :key="main.view"/>
        </q-card-section>
      </q-card>
    </div>
    <JobPanel>  </JobPanel>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, markRaw, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/src/stores/clientStore'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import ClientExpansionItem from '@/src/components/client/ClientExpansionItem.vue'
import HelloWorld from '@/src/components/HelloWorld.vue'
import Iframe from '@/src/components/mainDisplay/Iframe.vue'
import TranscriptViewer from '@/src/components/mainDisplay/TranscriptViewer.vue'
import PageDescription from '@/src/components/mainDisplay/PageDescription.vue'
import EditProductBox from '@/src/components/mainDisplay/EditProductBox.vue' 
import EditPersonaBox from '@/src/components/mainDisplay/EditPersonaBox.vue'
import MarketEditor from '@/src/components/mainDisplay/MarketEditor.vue'
import ClientEditor from '~/src/components/mainDisplay/ClientEditor.vue'


import JobPanel from '~/src/components/sidePanel/JobPanel.vue'


const componentMap = {
  HelloWorld : markRaw(HelloWorld),
  Iframe : markRaw(Iframe),
  TranscriptViewer : markRaw(TranscriptViewer),
  PageDescription : markRaw(PageDescription),
  EditProductBox : markRaw(EditProductBox),
  EditPersonaBox : markRaw(EditPersonaBox),
  MarketEditor : markRaw(MarketEditor),
  ClientEditor : markRaw(ClientEditor),
} as const;

const statusOptions = ['Tous', 'Prospects', 'Client'] as const
const publishOptions = ['Tous', 'Publié'] as const

const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')
const tab = ref<string>('page')
const currentPage = ref(1)

const filter = reactive({
  search:''
})

const clientStore = useClientStore()
const mainDisplayStore = useMainDisplayStore()
const { main } = storeToRefs(mainDisplayStore)

const theClient = computed(()=>{
  return {}
})

const clientList = computed(() => {
  const clients = [...clientStore.clients];
 /* if(theClient.value?.uuid){
    const client = theClient.value;
    const index = clients.findIndex(c => c.uuid === client.uuid);
    if (index > -1) {
      clients.splice(index, 1);
      clients.unshift(client);
    }
    return clients;
  }*/

  return clients
});

const resolvedComponent = computed(() => {
  return componentMap[main.value.view as keyof typeof componentMap] || null
})

const handlePageChange = async (page: number) => {
  await clientStore.fetchClients(page, clientStore.pagination.itemsPerPage, filter)
}


// Reload clients when filters change
watch([search, statusFilter], () => {
  currentPage.value = 1
  handlePageChange(1)
})

onMounted(async () => {
  await clientStore.fetchClients(1, 10, filter)
})

watch(() => main.value.view, (newView, oldView) => {
  console.log('View changed:', {
    old: oldView,
    new: newView,
    resolvedComponent: componentMap[newView as keyof typeof componentMap]
  })
})
</script>

<style scoped>
.q-expansion-item__content {
  background-color: #f5f5f5;
}

.c-client-list{
  max-height: calc(100vh - 160px);
  overflow: auto;
}
</style>