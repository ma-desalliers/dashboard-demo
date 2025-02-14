<template>
  <SidePanel v-model="isVisible" :width="1000" hide-header>
  <div class="bg-white w-full">
    <!-- Header Navigation Bar -->
    <q-header class="bg-white text-black" bordered>
      <q-toolbar class="q-px-md">
        <q-btn flat round dense icon="arrow_back" @click="closeSidePanel" />
        <q-space />
        <q-btn flat round dense icon="refresh" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <div class="q-pa-md">
      <!-- Title Section -->
      <div class="c-section-bigtitle text-grey-9 q-pb-md">
        10 Best Practices for Testing Surface Durability in Valve Manufacturing
      </div>

      <!-- Meta Tags Section -->
      <div class="row items-center q-gutter-md q-mb-lg">
        <!-- Approbation Dropdown -->
        <q-btn
          outline
          dense
          color="grey-7"
          label="Approbation"
          class="bg-grey-3"
        >
          <q-icon name="expand_more" class="q-ml-sm" />
        </q-btn>

        <q-separator vertical />

        <!-- How-To-Guide Tag -->
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="grid_view" color="primary" size="sm" />
          <span class="text-blue-8 text-caption">How-To-Guide</span>
        </div>

        <q-separator vertical />

        <!-- Progress Indicator -->
        <div class="row items-center q-gutter-x-md">
          <span class="text-grey-8 text-caption">Awareness</span>
          <div class="row q-gutter-x-xs">
            <div
              v-for="n in 4"
              :key="n"
              class="bg-green-5"
              style="width: 16px; height: 8px; border-radius: 2px;"
            />
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <q-tabs
        v-model="activeTab"
        class="text-grey-7"
        dense
        align="left"
        indicator-color="green-5"
        active-color="green-5"
      >
        <q-tab name="overview" label="Overview" />
        <q-tab name="content" label="Content" />
        <q-tab name="monetization" label="Monetization" />
        <q-tab name="distribution" label="Distribution" />
      </q-tabs>

      <q-tab-panels v-model="activeTab" :class="{'c-scroll': activeTab == 'keywords'}"  >
        <q-tab-panel name="overview">
          <AgentMessage></AgentMessage>
        </q-tab-panel>
      
      <!-- Preview Panel -->
      <q-tab-panel name="content">
        <ContentViewer></ContentViewer>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</SidePanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ContentViewer from './components/PageViewer.vue/ContentViewer.vue';
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
  const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const activeTab = ref('overview')

const  closeSidePanel = () => {
  isVisible.value = false
}

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
</style>