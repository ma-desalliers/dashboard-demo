<template>

  <div class="c-relative">
    <Loading v-if="isLoading" size="75px"></Loading>

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
          <ThumbsReview v-model="props.row.review"></ThumbsReview>
        </div>
      </template>

      <template #cell-relevancy="props">
        <q-chip
        square
          dense
          outline
          class="c-custom-chips"
          :color="getRelevancyColor(props.value)"
          :label="props.value"
        />
      </template>

      <template #cell-channel="props">
        <div class="row items-center">
          <SocialMediaIcon :name="'search engine'" size="24px" ></SocialMediaIcon>
          <span class="q-pl-sm"> {{ props.value ?? 'Search Engine' }}</span>
        </div>
      </template>
    </CTable>
    
  </div>

    <PageViewer v-model="sidePanelVisible"></PageViewer>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageStore } from '@/src/stores/pageStore'
import { useCompanyStore } from '@/src/stores/companyStore'
import type { Page } from '@/src/repository/pages/Interfaces'
import PageViewer from '@/src/components/shared/PageViewer.vue'

const props = defineProps<{
  audienceUuid?: string
  jobUuid?: string
  onEdit?: (page: Page) => void
  onDelete?: (page: Page) => void
  onBatchDelete?: (pages: Page[]) => void
}>()

const emit = defineEmits(['update:pagination'])

const selectedPages = ref<Page[]>([])
const sidePanelVisible = ref<boolean>(false)
const loading = ref<boolean>(false)

const { t } = useI18n()
const pageStore = usePageStore()
const companyStore = useCompanyStore()

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'createdAt',
  descending: true,
  rowsNumber: 0
})

const formattedPages = computed(() => {
  return isLoading.value ? [] : pageStore.pages.map((page) => ({
    uuid: page.uuid,
    title: page.title,
    status: page.status,
    relevancy: getRelevancyText(page.relevancyScore || 8),
    channel: page.channel,
    buyingStage: 1,
    format: page.type || 'Unknown',
    creationDate: new Date(page.createdAt).toLocaleDateString()
  }))
})

const isLoading = computed(()=> pageStore.listLoading)

const columns = [
  {
    name: 'title',
    label: t('content'),
    field: 'title',
    align: 'left' as const,
    type: 'hover',
    sortable: true
  },
  {
    name: 'status',
    label: t('status'),
    field: 'status',
    type: 'badge',
    options: [
      { label: 'selection', uuid: 'selection' },
      { label: 'production', uuid: 'production' },
      { label: 'revision', uuid: 'revision' },
      { label: 'publication', uuid: 'publication' },
      { label: 'monetisation', uuid: 'monetisation' }
    ],
    style:{
      minWidth:'150px'
    },
    align: 'center' as const,
    sortable: true
  },
  {
    name: 'buyingStage',
    label: t('buying-stage'),
    field: 'buyingStage',
    align: 'left' as const,
    type: 'bar',
    style:{
      minWidth:'200px'
    },
    sortable: true
  },
  {
    name: 'channel',
    label: t('channel'),
    field: 'channel',
    align: 'left' as const,
    style:{
      minWidth:'200px'
    },
    sortable: true
  },

  {
    name: 'format',
    label: t('format'),
    field: 'format',
    align: 'left' as const,
    sortable: true
  },
  {
    name: 'creationDate',
    label: t('creation-date'),
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
      icon: 'o_visibility',
      action: (e: Event, item: any) => { openPageViewer(item) },
    },
    {
      icon: 'o_edit',
      action: (e: Event, item: any) => props.onEdit?.(item),
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

const getChannelText = (channel: string): string => {
  switch (channel) {
    case 'search engine':
      return 'Search Engine';
  }
}

const fetchPages = async () => {
  try {
    await pageStore.list(pagination.value.page, pagination.value.rowsPerPage, {
      clientUuid: companyStore.theCompany.uuid,
      audienceUuid: props.audienceUuid,
      jobUuid: props.jobUuid,
      withContent: true
    })
    pagination.value = {
      ...pagination.value,
      rowsNumber: pageStore.totalRecords
    }
  } finally {
   
  }
}

const onRequest = (props: { pagination: any }) => {
  pagination.value = { ...props.pagination }
  fetchPages()
}

const updatePagination = async (newPagination: any) => {
  if (Object.hasOwnProperty.call(newPagination, 'pagination')) {
    pagination.value = { ...newPagination.pagination }
  } else {
    pagination.value = { ...newPagination }
  }
  await fetchPages()
}

const openPageViewer = async (page: Page) => {
  await pageStore.current(page.uuid)
  sidePanelVisible.value = true
}

onMounted(() => {
  fetchPages()
})

watch(() => props.audienceUuid, () => {
  fetchPages()
})

watch(() => props.jobUuid, () => {
  fetchPages()
})
</script>