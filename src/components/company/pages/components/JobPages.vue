<template>
  <div v-if="isLoading" class="c-relative" style="min-height: 75px">
    <Loading size="50px" position="left"></Loading>
  </div>
  <CExpansionItem
  v-if="!isLoading"
    v-for="subjob in subJobs"
    :key="subjob.uuid"
    :title="subjob.title"
    v-model="expandedStates[subjob.uuid]"
    @update:model-value="handleExpansion(subjob.uuid, $event)"
  >
    <template #icon>
      <q-icon name="flag" color="green" size="24px" class="q-pr-xs"></q-icon>
    </template>
    <template #option>
      <span class="c-box-subtitle c-smaller">&nbsp;-&nbsp;{{ subjob.pageCount }} </span>
    </template>
    <div>
      <PageTable
        v-if="expandedStates[subjob.uuid]"
        :audience-uuid="audienceUuid"
        :subjob-uuid="subjob.uuid"
      ></PageTable>
    </div>
  </CExpansionItem>
</template>

<script lang="ts" setup>
import { useJTBDStore } from "~/src/stores/JTBDStore";
import PageTable from "./PageTable.vue";

const props = defineProps<{
  audienceUuid: string;
}>();

const companyUuid: string | undefined = inject<string>("companyUuid");

const jtbdStore = useJTBDStore();
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

const subJobs = computed(() => jtbdStore.subjobs);

const loadSubJobs = () => {
  jtbdStore.list(1, 10, {
    audienceUuid: props.audienceUuid,
    isChild: true,
    clientUuid: companyUuid ?? "",
    withPage: true,
  });
};

onMounted(() => {
  loadSubJobs();
});
</script>
