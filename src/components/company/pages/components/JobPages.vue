<template>
  <div v-if="isLoading" class="c-relative" style="min-height: 75px">
    <Loading size="50px" position="left"></Loading>
  </div>
  <CExpansionItem
    v-for="(job, index) in jobs.slice(0, motivationNumber + 1)"    
    v-if="!isLoading"
    :key="job.uuid"
    :title="job.title"
    v-model="expandedStates[job.uuid]"
    @update:model-value="handleExpansion(job.uuid, $event)"
  >
    <template #icon>
      <q-icon name="flag" color="green" size="24px" class="q-pr-xs"></q-icon>
    </template>
    <template #option>
      <span class="c-box-subtitle c-smaller">&nbsp;-&nbsp;{{ job.pageCount }} </span>
      <q-chip v-if="index == motivationNumber" square color="green" text-color="white" size="sm" >{{ $t('new') }}</q-chip>
    </template>
    <div v-if="currentView == 'list'">
      <PageTable
        v-if="expandedStates[job.uuid]"
        :audience-uuid="audienceUuid"
        :job-uuid="job.uuid"
      ></PageTable>
    </div>
    <div v-if="currentView == 'card'">
      <PageCards
        v-if="expandedStates[job.uuid]"
        :audience-uuid="audienceUuid"
        :job-uuid="job.uuid"
      ></PageCards>
    </div>
  </CExpansionItem>
</template>

<script lang="ts" setup>
import { useJTBDStore } from "~/src/stores/JTBDStore";
import PageTable from "./PageTable.vue";
import PageCards from "./PageCards.vue";
import { useLocalStorage } from "~/src/asset/composable/localStore";
import { useMainDisplayStore } from "~/src/stores/mainDisplayStore";

const props = defineProps<{
  audienceUuid: string;
}>();

const companyUuid: string | undefined = inject<string>("companyUuid");

const jtbdStore = useJTBDStore();
const mainDisplayStore = useMainDisplayStore()
const localStore = useLocalStorage('motivation-number', 0)
const motivationNumber = ref( localStore.data.value)
const currentView = inject('currentView')

const selectedJob = ref<string | null>(null);
const expandedStates = ref<Record<string, boolean>>({});

const isLoading = computed(() => jtbdStore.loading);
const elementReload = computed(()=> mainDisplayStore.elementReload)

// Toggle this constant to switch between single and multiple expansion
const SINGLE_EXPANSION = true;

const handleExpansion = (uuid: string, isExpanded: boolean) => {
  if (SINGLE_EXPANSION && isExpanded) {
    // Close all other items
    Object.keys(expandedStates.value).forEach((key) => {
      if (key !== uuid) {
        expandedStates.value[key] = false;
      }
    });
  }
  expandedStates.value[uuid] = isExpanded;
};

const jobs = computed(() => jtbdStore.jobs);

const loadJobs = async (forceReload = false) => {
  console.log('loadingJbos')
  await jtbdStore.list(1, 10, {
    audienceUuid: props.audienceUuid,
    isChild: false,
    clientUuid: companyUuid ?? "",
    withPage: true,
  }, forceReload);
};

const initExpandedItem = () => {
 // if(selectedGroup.value == 'audience'){
  console.log('init', jobs.value)
    handleExpansion(jobs.value[jobs.value.length -1].uuid, true)
  //}
}


onMounted(async() => {
  await loadJobs();
  nextTick(()=>{
    initExpandedItem()
  })
});

watch(()=> elementReload.value, ()=> {
  loadJobs(true)
  motivationNumber.value = localStore.getStoredValue()
})
</script>
