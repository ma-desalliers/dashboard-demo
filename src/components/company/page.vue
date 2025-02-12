<template>
  <div class="row q-pa-md q-col-gutter-md">
    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedAudience"
        :options="audienceOptions"
        label="Audience"
        outlined
        dense
        clearable
        emit-value
        map-options
        update:model-value="fetchPages"
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedJob"
        :options="jobOptions"
        label="Job"
        outlined
        dense
        clearable
        emit-value
        map-options
      />
    </div>
    <div class="col-12 col-sm-4">
      <q-select
        v-model="selectedSubJob"
        :options="subJobOptions"
        :loading="subJobsLoading"
        label="Sub Job"
        outlined
        dense
        clearable
        emit-value
        map-options
        :disable="!selectedJob"
        update:model-value="fetchPages"
      />
    </div>
  </div>
  <div>
    <CTable
      v-model="selectedPages"
      :columns="columns"
      :rows="formattedPages"
      :loading="loading"
      :batch-actions="batchActions"
      :pagination="pagination"
      :hover-buttons="hoverButtonList"
      row-key="uuid"
      @request="onRequest"
      @update:pagination="updatePagination"
    >
      <!-- Custom cell templates -->
      <template #cell-review="props">
        <div class="row items-center q-gutter-x-sm">
          <q-btn
            :icon="props.row.review ? 'thumb_up' : 'thumb_down'"
            :color="props.row.review ? 'positive' : 'negative'"
            dense
            flat
            round
            size="sm"
          />
        </div>
      </template>

      <template #cell-relevancy="props">
        <q-chip
          dense
          :color="getRelevancyColor(props.value)"
          text-color="white"
          :label="props.value"
        />
      </template>

      <template #cell-buyingStage="props">
        <q-chip
          outline
          dense
          color="primary"
          :label="props.value"
        />
      </template>

      <template #cell-channel="props">
        <div class="row items-center">
          <q-icon
            :name="getChannelIcon(props.value)"
            size="sm"
            class="q-mr-xs"
          />
          {{ props.value ?? 'Search Engine' }}
        </div>
      </template>
    </CTable>
    <PageViewer v-model="sidePanelVisible"></PageViewer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Page } from '~/src/repository/pages/Interfaces';
import { useAudienceStore } from '~/src/stores/audienceStore'
import { useCompanyStore } from '~/src/stores/companyStore'
import { useJTBDStore } from '~/src/stores/JTBDStore';
import { usePageStore } from '~/src/stores/pageStore'
import PageViewer from '~/src/components/shared/PageViewer.vue';
import page from '~/src/components/company/page.vue';

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

const selectedPages = ref<Page[]>([])
const selectedAudience = ref<string | null>(null)
const selectedJob = ref<string | null>(null)
const selectedSubJob = ref<string | null>(null)
const subJobsLoading = ref<boolean>(false)
const sidePanelVisible = ref<boolean>(false)
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'createdAt',
  descending: true,
  rowsNumber: 0
});


const audienceStore = useAudienceStore()
const companyStore = useCompanyStore()
const pageStore = usePageStore()
const jtbdStore = useJTBDStore()

// Use audience data from store
const audienceOptions = computed(() =>
  audienceStore.audiences.map((audience) => ({
    label: audience.title,
    value: audience.uuid
  }))
)

const formattedPages = computed(() => {
  return pageStore.pages.map((page) => ({
    uuid: page.uuid,
    title: page.title,
    review: false,
    relevancy: getRelevancyText(page.relevancyScore || 0),
    channel: 'Search Engine',
    buyingStage: 'N/A',
    format: page.type || 'Unknown',
    creationDate: new Date(page.createdAt).toLocaleDateString()
  }));
});

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

const columns = [
  {
    name: 'title',
    label: 'Content',
    field: 'title',
    align: 'left' as const,
    type: 'hover',
    sortable: true
  },
  {
    name: 'review',
    label: 'Review',
    field: 'review',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'relevancy',
    label: 'Relevancy',
    field: 'relevancy',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'channel',
    label: 'Channel',
    field: 'channel',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'buyingStage',
    label: 'Buying stage',
    field: 'buyingStage',
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'format',
    label: 'Format',
    field: 'format',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'creationDate',
    label: 'Creation date',
    field: 'creationDate',
    align: 'left' as const,
    sortable: true
  }
]

const batchActions = computed(() => {
  const actions = []

  if (props.onBatchDelete) {
    actions.push({
      label: 'Delete Selected',
      icon: 'delete',
      color: 'negative',
      handler: (selected: Page[]) => props.onBatchDelete?.(selected)
    })
  }

  return actions
})

const hoverButtonList = computed(() => {
  return [
    {
      icon: 'fa fa-eye',
      action: (e: Event, item: any) => { openPageViewer(item) },
      color: 'white',
      textColor: '#333333'
    },
    {
      icon: 'fa fa-pen',
      action: (e: Event, item: any) => props.onEdit?.(item),
      color: 'white',
      textColor: '#333333'
    }
  ]
})

const getRelevancyColor = (relevancy: string): string => {
  switch (relevancy) {
    case 'Excellent':
      return 'positive'
    case 'Good':
      return 'warning'
    default:
      return 'negative'
  }
}

const getRelevancyText = (relevancy: number): string => {
  if (relevancy >= 8) return 'Excellent'
  if (relevancy >= 5) return 'Good'
  return 'Average'
}

const getChannelIcon = (channel: string): string => {
  switch (channel) {
    case 'Search Engine':
      return 'fab fa-google'
    case 'LinkedIn':
      return 'fab fa-linkedin'
    case 'Facebook':
      return 'fab fa-facebook'
    case 'X':
      return 'fab fa-x-twitter'
    case 'Newsletter':
      return 'mail'
    case 'Google Profile':
      return 'fab fa-google'
    default:
      return 'fab fa-google'
  }
}

const fetchPages = async () => {
  console.log(selectedSubJob.value)
  await pageStore.list(pagination.value.page, pagination.value.rowsPerPage, {
    clientUuid: companyStore.theCompany.uuid,
    audienceUuid: selectedAudience.value || undefined,
    subjobUuid: selectedSubJob.value || undefined
  });
  pagination.value = {
    ...pagination.value,
    rowsNumber: pageStore.totalRecords
  };
};

const onRequest = (props: { pagination: any }) => {
  pagination.value = { ...props.pagination };
  fetchPages();
};

const updatePagination = async (newPagination: any) => {
  if (Object.hasOwnProperty.call(newPagination, 'pagination')) {
    pagination.value = { ...newPagination.pagination };
  } else {
    pagination.value = { ...newPagination };
  }
  await fetchPages();
};

const openPageViewer = async (page:Page)=>{
  console.log('sup', page)
  await pageStore.current(page.uuid)
  sidePanelVisible.value = true
}

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
