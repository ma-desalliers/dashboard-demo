<template>
  <div>
    <CTable 
      v-model="selectedAudiences" 
      :columns="fullColumns" 
      :rows="audiences" 
      :loading="loading"
      :batch-actions="batchActions" 
      :pagination="pagination" 
      @update:pagination="$emit('update:pagination', $event)"
      :hover-buttons="hoverButtonList" 
      row-key="uuid"
    >
      <!-- Custom cell templates -->
      <template #cell-score="props">
        <div v-if="props.value !== null">
          <q-chip square dense :color="getScoreColor(props.value)" text-color="white">
            {{ props.value }}
          </q-chip>
        </div>
        <span v-else>-</span>
      </template>

      <template #cell-revenue="props">
        <q-chip outline dense color="primary" v-if="props.value">
          {{ props.value }}
        </q-chip>
        <span v-else>-</span>
      </template>

      <template #cell-location="props">
        <q-chip outline dense color="grey" v-if="props.value !== 'N/A'">
          {{ props.value }}
        </q-chip>
        <span v-else>-</span>
      </template>
    </CTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import columns from '~/src/asset/tablesColumn/audience'

interface GICS {
  subIndustryId: number
  subIndustryName: string
  subIndustryDescription: string
  industryId: number
  industryName: string
  industryGroupId: number
  industryGroupName: string
  sectorId: number
  sectorName: string
}

interface Audience {
  uuid: string
  clientUuid: string
  title: string
  description: string
  subIndustryId: number | null
  countryId: number | null
  stateId: number | null
  cityId: number | null
  revenue: string | null
  image: string | null
  score: number | null
  createdAt: number
  gics: GICS | null
}

const props = defineProps<{
  loading?: boolean
  pagination?: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
  }
  onEdit?: (audience: Audience) => void
  onDelete?: (audience: Audience) => void
  onBatchDelete?: (audiences: Audience[]) => void
}>()

const emit = defineEmits(['update:pagination'])

const selectedAudiences = ref<Audience[]>([])

// Sample data - in real implementation, this would come from a store or props
const audiences = ref<Audience[]>([
  {
    "uuid": "f9b07457-3048-4d6f-b184-9eaf2f4515a3",
    "clientUuid": "c0b33f0a-7c14-4842-9e91-638f677553e2",
    "title": "The client",
    "description": "that client want the product",
    "subIndustryId": null,
    "countryId": null,
    "stateId": null,
    "cityId": null,
    "revenue": null,
    "image": null,
    "score": null,
    "createdAt": 1731963721132,
    "gics": null
  },
  {
    "uuid": "c3c877f3-2dea-4b7d-b6a4-c8a709b9c1dc",
    "clientUuid": "c0b33f0a-7c14-4842-9e91-638f677553e2",
    "title": "Industrial metal Company",
    "description": "The ideal client is a B2B metal industrial company...",
    "subIndustryId": 55104010,
    "countryId": 39,
    "stateId": 873,
    "cityId": 16709,
    "revenue": "50000000-100000000",
    "image": null,
    "score": null,
    "createdAt": 1731963231732,
    "gics": {
      "subIndustryId": 55104010,
      "subIndustryName": "Water Utilities",
      "subIndustryDescription": "Companies that purchase and redistribute water...",
      "industryId": 551040,
      "industryName": "Water Utilities",
      "industryGroupId": 5510,
      "industryGroupName": "Utilities",
      "sectorId": 55,
      "sectorName": "Utilities"
    }
  }
])

const batchActions = computed(() => {
  const actions = []

  if (props.onBatchDelete) {
    actions.push({
      label: 'Delete Selected',
      icon: 'delete',
      color: 'negative',
      handler: (selected: Audience[]) => props.onBatchDelete?.(selected)
    })
  }

  return actions
})

const fullColumns = computed(() => columns)

const hoverButtonList = computed(() => {
  return [
    {
      icon: 'fa fa-eye',
      action: (e: Event, item: Audience) => showAudienceDetails(item),
      color: 'white',
      textColor: '#333333'
    },
    {
      icon: 'fa fa-pen',
      action: (e: Event, item: Audience) => editAudience(item),
      color: 'white',
      textColor: '#333333'
    }
  ]
})

const getScoreColor = (score: number): string => {
  if (score >= 8) return 'positive'
  if (score >= 5) return 'warning'
  return 'negative'
}

const showAudienceDetails = (audience: Audience) => {
  console.log('Show audience details:', audience)
  // Implement your logic here
}

const editAudience = (audience: Audience) => {
  console.log('Edit audience:', audience)
  // Implement your logic here
}
</script>