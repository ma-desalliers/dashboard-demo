<template>
    <div class="row q-col-gutter-md q-ml-none q-pl-none">
      <div class="col-12 col-sm-6">
        <q-select
          class="ellipsis-select"
          v-model="selectedSector"
          :options="sectors"
          option-label="name"
          label="Sector"
          outlined
          dense
          emit-value
          map-options
          clearable
          :loading="loadingSectors"
          :display-value="selectedSector?.name"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          class="ellipsis-select"
          v-model="selectedIndustryGroup"
          :options="industryGroups"
          option-label="name"
          label="Industry Group"
          outlined
          dense
          emit-value
          map-options
          clearable
          :disable="!selectedSector"
          :loading="loadingIndustryGroups"
          :display-value="selectedIndustryGroup?.name"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          class="ellipsis-select"
          v-model="selectedIndustry"
          :options="industries"
          option-label="name"
          label="Industry"
          outlined
          dense
          emit-value
          map-options
          clearable
          :disable="!selectedIndustryGroup"
          :loading="loadingIndustries"
          :display-value="selectedIndustry?.name"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          class="ellipsis-select"
          v-model="selectedSubIndustry"
          :options="subIndustries"
          option-label="name"
          label="Sub-Industry"
          outlined
          dense
          emit-value
          map-options
          clearable
          :disable="!selectedIndustry"
          :loading="loadingSubIndustries"
          :display-value="selectedSubIndustry?.name"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { GICS } from '@/src/repository/gics/Gics';
  import type { 
    SectorObject, 
    IndustryGroupObject, 
    IndustryObject, 
    SubIndustryObject 
  } from '@/src/repository/gics/Interface';
  
  interface GicsData {
    industryGroupId: number;
    industryGroupName: string;
    industryId: number;
    industryName: string;
    sectorId: number;
    sectorName: string;
    subIndustryDescription: string;
    subIndustryId: number;
    subIndustryName: string;
  }
  
  const props = defineProps<{
    modelValue?: string| null| undefined;
    gics?: GicsData;
  }>();
  
  const emit = defineEmits(['update:modelValue']);
  
  // Selected values
  const selectedSector = ref<SectorObject | null>(null);
  const selectedIndustryGroup = ref<IndustryGroupObject | null>(null);
  const selectedIndustry = ref<IndustryObject | null>(null);
  const selectedSubIndustry = ref<SubIndustryObject | null>(null);
  
  // Options for each level
  const sectors = ref<SectorObject[]>([]);
  const industryGroups = ref<IndustryGroupObject[]>([]);
  const industries = ref<IndustryObject[]>([]);
  const subIndustries = ref<SubIndustryObject[]>([]);
  
  // Loading states
  const loadingSectors = ref(false);
  const loadingIndustryGroups = ref(false);
  const loadingIndustries = ref(false);
  const loadingSubIndustries = ref(false);
  
  // Fetch functions
  const fetchSectors = async () => {
    loadingSectors.value = true;
    try {
      sectors.value = await GICS.getSectors();
      if (props.gics) {
        // Find and set the sector
        const sector = sectors.value.find(s => s.id === props.gics?.sectorId);
        if (sector) {
          selectedSector.value = sector;
        }
      }
    } catch (error) {
      console.error('Error fetching sectors:', error);
    } finally {
      loadingSectors.value = false;
    }
  };
  
  const fetchIndustryGroups = async (sectorId: number) => {
    loadingIndustryGroups.value = true;
    try {
      const gics = new GICS({ id: sectorId, name: '' });
      industryGroups.value = await gics.getIndustryGroups();
      if (props.gics && sectorId === props.gics.sectorId) {
        // Find and set the industry group
        const industryGroup = industryGroups.value.find(ig => ig.id === props.gics?.industryGroupId);
        if (industryGroup) {
          selectedIndustryGroup.value = industryGroup;
        }
      }
    } catch (error) {
      console.error('Error fetching industry groups:', error);
    } finally {
      loadingIndustryGroups.value = false;
    }
  };
  
  const fetchIndustries = async (industryGroupId: number) => {
    loadingIndustries.value = true;
    try {
      const gics = new GICS({ id: 0, name: '', industryGroupId });
      industries.value = await gics.getIndustries();
      if (props.gics && industryGroupId === props.gics.industryGroupId) {
        // Find and set the industry
        const industry = industries.value.find(i => i.id === props.gics?.industryId);
        if (industry) {
          selectedIndustry.value = industry;
        }
      }
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      loadingIndustries.value = false;
    }
  };
  
  const fetchSubIndustries = async (industryId: number) => {
    loadingSubIndustries.value = true;
    try {
      const gics = new GICS({ id: 0, name: '', industryId });
      subIndustries.value = await gics.getSubIndustries();
      if (props.gics && industryId === props.gics.industryId) {
        // Find and set the sub-industry
        const subIndustry = subIndustries.value.find(si => si.id === props.gics?.subIndustryId);
        if (subIndustry) {
          selectedSubIndustry.value = subIndustry;
        }
      }
    } catch (error) {
      console.error('Error fetching sub-industries:', error);
    } finally {
      loadingSubIndustries.value = false;
    }
  };
  
  // Watchers
  watch(selectedSector, (sector) => {
    if (!sector) {
      selectedIndustryGroup.value = null;
      selectedIndustry.value = null;
      selectedSubIndustry.value = null;
      industryGroups.value = [];
      industries.value = [];
      subIndustries.value = [];
    } else {
      fetchIndustryGroups(sector.id);
    }
    emitUpdate();
  });
  
  watch(selectedIndustryGroup, (industryGroup) => {
    if (!industryGroup) {
      selectedIndustry.value = null;
      selectedSubIndustry.value = null;
      industries.value = [];
      subIndustries.value = [];
    } else {
      fetchIndustries(industryGroup.id);
    }
    emitUpdate();
  });
  
  watch(selectedIndustry, (industry) => {
    if (!industry) {
      selectedSubIndustry.value = null;
      subIndustries.value = [];
    } else {
      fetchSubIndustries(industry.id);
    }
    emitUpdate();
  });
  
  watch(selectedSubIndustry, () => {
    emitUpdate();
  });
  
  // Watch for gics prop changes
  watch(() => props.gics, (newGics) => {
    if (newGics) {
      // If we already have sectors loaded, find and set the sector
      const sector = sectors.value.find(s => s.id === newGics.sectorId);
      if (sector) {
        selectedSector.value = sector;
      } else {
        // If sectors aren't loaded yet, fetch them
        fetchSectors();
      }
    }
  }, { immediate: true });
  
  const emitUpdate = () => {
    emit('update:modelValue', selectedSubIndustry.value?.id);
  };
  
  onMounted(() => {
    fetchSectors();
  });
  </script>
  
  <style scoped>
  .ellipsis-select :deep(.q-field__native) {
    text-overflow: ellipsis;
    white-space: nowrap !important;
    overflow: hidden;
    padding-right: 20px;
  }
  
  .ellipsis-select :deep(.q-field__native > span) {
    text-overflow: ellipsis;
    white-space: nowrap !important;
    overflow: hidden;
    width: 100%;
    display: block;
  }
  
  .ellipsis-select {
    width: 100%;
  }
  
  /* Optional: Add tooltip on hover */
  .ellipsis-select:hover :deep(.q-field__native > span) {
    position: relative;
  }
  
  .ellipsis-select:hover :deep(.q-field__native > span)::after {
    content: attr(data-content);
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1000;
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    white-space: normal;
    word-break: break-word;
    max-width: 300px;
  }
  </style>