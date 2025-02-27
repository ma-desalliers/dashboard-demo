<template>
  <div v-if="isLoading" class="c-relative" style="min-height: 75px">
    <Loading size="50px" position="left"></Loading>
  </div>
  <CExpansionItem
    v-if="!isLoading"
    v-for="job in jobs"
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

const props = defineProps<{
  audienceUuid: string;
}>();

const companyUuid: string | undefined = inject<string>("companyUuid");

const jtbdStore = useJTBDStore();
const currentView = inject('currentView')

const selectedJob = ref<string | null>(null);
const expandedStates = ref<Record<string, boolean>>({});

const isLoading = computed(() => jtbdStore.loading);

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

const loadJobs = () => {
  jtbdStore.list(1, 10, {
    audienceUuid: props.audienceUuid,
    isChild: false,
    clientUuid: companyUuid ?? "",
    withPage: true,
  });
};

onMounted(() => {
  loadJobs();
});
</script>
