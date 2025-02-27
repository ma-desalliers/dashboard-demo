<template>
  <div class="">
    <span class="c-main-title">{{ $t('marketing-content') }}</span>
  </div>
  <div class="q-pt-md">
    <ProgressSteps :steps="progressStep" :title="$t('content-phase')" :active-step="activeStep"
      @update-active-step="(step) => activeStep = step"></ProgressSteps>
  </div>
  <div class="row q-py-lg q-col-gutter-lg">
    <div>
      <ToggleButtons v-model="currentView" :options="toggleBtnOptions"
        @update-selection="(value: any) => currentView = value"> </ToggleButtons>
    </div>
    <div class="col-12 col-md-2">
      <q-input v-model="searchQuery" dense placeholder="Rechercher" clearable @update:model-value="onSearch">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- Group By Dropdown -->
    <div class="col-12 col-md-2">
      <q-input v-model="selectedGroup" dense readonly placeholder="Group by" @click="toggleDropdown"
        class="cursor-pointer">
        <template v-slot:prepend>
          <q-icon name="o_layers" @click="toggleDropdown" />
          <span class="c-box-subtitle c-smaller" @click="toggleDropdown">{{ $t('group-by') }}: </span>
        </template>
        <template v-slot:append>
          <q-btn-dropdown ref="dropdownRef" flat dense dropdown-icon="arrow_drop_down" aria-label="Group by"
            class="no-padding">
            <q-list>
              <q-item v-for="option in groupOptions" :key="option.value" clickable v-close-popup
                @click="selectedGroup = option.label">
                <q-item-section>{{ option.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </q-input>
    </div>

    <!-- Date Period Selector -->
    <div class="col-12 col-md-2">
      <q-input v-model="selectedDate" dense readonly placeholder="Période">
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
        <template v-slot:append>
          <q-btn-dropdown flat dense dropdown-icon="arrow_drop_down" aria-label="Select period" class="no-padding">
            <q-list>
              <q-item v-for="option in dateOptions" :key="option.value" clickable v-close-popup
                @click="selectedDate = option.label">
                <q-item-section>{{ option.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </template>
      </q-input>
    </div>
  </div>
  <div class="">
    <CExpansionItem v-for="(audience, index) in audienceOptions" v-model="expandedStates[audience.value]"
      :key="audience.value" :title="audience.label" title-class="c-section-bigtitle" main-element class="q-mb-lg"
      @update:model-value="handleExpansion(audience.value, $event)">
      <JobPages v-if="expandedStates[audience.value]" :audience-uuid="audience.value"></JobPages>
    </CExpansionItem>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Page } from '~/src/repository/pages/Interfaces';
import { useAudienceStore } from '~/src/stores/audienceStore'
import { useCompanyStore } from '~/src/stores/companyStore'
import { useJTBDStore } from '~/src/stores/JTBDStore';
import { usePageStore } from '~/src/stores/pageStore'
import { useI18n } from 'vue-i18n';
import PageViewer from '~/src/components/shared/PageViewer.vue';
import ProgressSteps from '@/src/components/shared/ProgressSteps.vue';
import JobPages from './components/JobPages.vue';

// interface Page {
//   uuid: string
//   title: string
//   review: boolean
//   relevancy: 'Excellent' | 'Good' | 'Average'
//   channel: string
//   buyingStage: string
//   format: string
//   creationDate: string
// }

const props = defineProps<{
  loading?: boolean
  pages: Page[]
  pagination?: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
  }
  onEdit?: (page: Page) => void
  onDelete?: (page: Page) => void
  onBatchDelete?: (pages: Page[]) => void
}>()

const emit = defineEmits(['update:pagination'])

const selectedAudience = ref<string | null>(null)
const selectedJob = ref<string | null>(null)
const selectedSubJob = ref<string | null>(null)
const subJobsLoading = ref<boolean>(false)
const sidePanelVisible = ref<boolean>(false)
const currentView = ref<string>('list')


// Group by options
const groupOptions = [
  { label: 'Audience', value: 'audience' },
  { label: 'Job', value: 'job' },
  { label: 'Sub Job', value: 'subjob' },
  { label: 'Date', value: 'date' }
];
const selectedGroup = ref('Audience');

const expandedStates = ref<Record<string, boolean>>({})

const dropdownRef = ref(null)

const toggleDropdown = () => {
  // Access the q-btn-dropdown component and toggle it
  dropdownRef.value?.toggle()
}

const activeStep = ref(1)
const toggleBtnOptions = ref([{
  value: 'list',
  icon: 'list'
},
{
  value: 'card',
  icon: 'o_style'
},
{
  value: 'calendar',
  icon: 'calendar_today'
}])

const SINGLE_EXPANSION = true

const handleExpansion = (uuid: string, isExpanded: boolean) => {
  if (SINGLE_EXPANSION && isExpanded) {
    // Close all other items
    Object.keys(expandedStates.value).forEach(key => {
      if (key !== uuid) {
        expandedStates.value[key] = false
      }
    })
  }
  expandedStates.value[uuid] = isExpanded
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'createdAt',
  descending: true,
  rowsNumber: 0
});

const progressStep = [{ label: "selection", value: 1 }, { label: "production", value: 2 }, { label: "révision", value: 3 }, { label: "publication", value: 3 }, { label: "monetisation", value: 3 }]

provide('currentView', currentView)
const audienceStore = useAudienceStore()
const companyStore = useCompanyStore()
const pageStore = usePageStore()
const jtbdStore = useJTBDStore()
const { t } = useI18n()

// Use audience data from store
const audienceOptions = computed({
  get: () => {
    return audienceStore.audiences.map((audience) => ({
      label: audience.name,
      value: audience.uuid,
      isOpen: false
    }))
  },
  set: (value) => {
    audienceOptions.value = value
  }
}
)

const jobOptions = computed(() =>
  jtbdStore.jobs.map((job) => ({
    label: job.title,
    value: job.uuid
  }))
)

const subJobOptions = computed(() =>
  jtbdStore.subjobs.map((job) => ({
    label: job.title,
    value: job.uuid
  }))
);

const fetchPages = async () => {
  console.log(selectedSubJob.value)
  await pageStore.list(pagination.value.page, pagination.value.rowsPerPage, {
    clientUuid: companyStore.theCompany.uuid,
    audienceUuid: selectedAudience.value || undefined,
    jobUuid: selectedJob.value || undefined,
    subjobUuid: selectedSubJob.value || undefined,
    withContent: true
  });
  pagination.value = {
    ...pagination.value,
    rowsNumber: pageStore.totalRecords
  };
};

onMounted(async () => {
  await audienceStore.init(companyStore.theCompany.uuid)
  await jtbdStore.list(1, 100, {
    clientUuid: companyStore.theCompany.uuid,
    isChild: false
  })
})

watch(selectedJob, async (newValue) => {
  selectedSubJob.value = null
  if (!newValue) return

  try {
    subJobsLoading.value = true
    await jtbdStore.list(1, 100, {
      clientUuid: companyStore.theCompany.uuid,
      parentUuid: newValue,
      isChild: true
    })
  } finally {
    subJobsLoading.value = false
  }
})

watch(selectedAudience, async (newValue) => {
  await fetchPages();
});

watch(selectedSubJob, async (newValue) => {
  await fetchPages();
});
</script>
