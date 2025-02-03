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
        label="Sub Job"
        outlined
        dense
        clearable
        emit-value
        map-options
        :disable="!selectedJob"
      />
    </div>
  </div>
  <div>
    <CTable
      v-model="selectedPages"
      :columns="columns"
      :rows="pages"
      :loading="loading"
      :batch-actions="batchActions"
      :pagination="pagination"
      :hover-buttons="hoverButtonList"
      row-key="uuid"
      @update:pagination="$emit('update:pagination', $event)"
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
          {{ props.value }}
        </div>
      </template>
    </CTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Page {
  uuid: string
  title: string
  review: boolean
  relevancy: 'Excellent' | 'Good' | 'Average'
  channel: string
  buyingStage: string
  format: string
  creationDate: string
}

const props = defineProps<{
  loading?: boolean
  pages:any[]
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

// Temporary options (to be replaced with actual data)
const audienceOptions = [
  { label: 'Audience 1', value: 'audience1' },
  { label: 'Audience 2', value: 'audience2' },
  { label: 'Audience 3', value: 'audience3' }
]

const jobOptions = [
  { label: 'Job 1', value: 'job1' },
  { label: 'Job 2', value: 'job2' },
  { label: 'Job 3', value: 'job3' }
]

const subJobOptions = [
  { label: 'Sub Job 1', value: 'subjob1' },
  { label: 'Sub Job 2', value: 'subjob2' },
  { label: 'Sub Job 3', value: 'subjob3' }
]

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
      action: (e: Event, item: any) => { window.open(item.url, '_blank') },
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
    case 'Average':
      return 'negative'
    default:
      return 'grey'
  }
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
      return 'help'
  }
}
</script>