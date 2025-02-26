<template>
  <SidePanel v-model="isVisible" :width="700">
    <div class="bg-white w-full">
      <!-- Header Navigation Bar -->
      <q-header class="bg-white text-grey" >
        <q-toolbar class="q-px-md">
          <q-btn flat round dense text-color="#666666" icon="chevron_left" :label="$t('close')" @click="closeSidePanel" />
          <q-space />
          <q-btn flat round dense icon="refresh" />
          <q-btn flat round dense icon="more_vert" />
        </q-toolbar>
      </q-header>

      <!-- Main Content -->
      <div class="">
        <div class="c-sticky q-px-lg" style="--c-top:0px;">
        <!-- Title Section -->
        <div class="c-section-bigtitle q-pb-md">
          {{thePage?.title}}
        </div>

        <!-- Meta Tags Section -->
        <div class="row items-center q-gutter-md q-mb-lg" v-if="thePage">
          <!-- Approbation Dropdown -->
          <StatusPopup :current-item="thePage.status"  :options="[]"></StatusPopup>
            
          <q-separator vertical />

          <!-- How-To-Guide Tag -->
          <div class="row items-center q-gutter-x-sm">
            <q-icon name="grid_view" color="primary" size="sm" />
            <span class="text-blue-8 text-caption">{{$t('how-to-guide')}}</span>
          </div>

          <q-separator vertical />

          <!-- Progress Indicator -->
          <SectionBar :active-count="1"></SectionBar>
        </div>

        <!-- Tab Navigation -->
        <q-tabs
          v-model="activeTab"
          class="text-grey-7 c-tabs"
          dense
          align="left"
          indicator-color="green-5"
          active-color="green-5"
        >
          <q-tab name="content" :label="$t('content')" />
          <q-tab name="overview" :label="$t('overview')" />
          <q-tab name="monetization" :label="$t('monetization')" />
          <q-tab name="distribution" :label="$t('distribution')" />
        </q-tabs>
      </div>
        <q-tab-panels
          v-model="activeTab"
          :class="{ 'c-scroll': activeTab == 'keywords' }"
          class="q-pa-lg"
        >
          <q-tab-panel name="overview">
            <PageOverview></PageOverview>
          </q-tab-panel>
          <!-- Preview Panel -->
          <q-tab-panel name="content" class="q-pa-none">
            <ContentViewer></ContentViewer>
          </q-tab-panel>
          <q-tab-panel name="monetization" class="q-pa-none">
            <PageMonetization></PageMonetization>
          </q-tab-panel>
          <q-tab-panel name="distribution">
            <PageDistribution></PageDistribution>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </SidePanel>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { usePageStore } from "~/src/stores/pageStore";
import ContentViewer from "./components/PageViewer.vue/ContentViewer.vue";
import PageOverview from "./components/PageViewer.vue/PageOverview.vue";
import PageDistribution from "./components/PageViewer.vue/PageDistribution.vue";
import PageMonetization from "./components/PageViewer.vue/PageMonetization.vue";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const pageStore = usePageStore();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const thePage = computed(() => pageStore.thePage);

const activeTab = ref("content");

const closeSidePanel = () => {
  isVisible.value = false;
};
</script>

<style scoped>
.q-toolbar {
  min-height: 56px;
}

.q-btn {
  text-transform: none;
}

/* Override Quasar's default header shadow */
.q-header {
  box-shadow: none;
}

.c-sticky{
  box-shadow:0 2px 12px #aaaaaa;
}
</style>
