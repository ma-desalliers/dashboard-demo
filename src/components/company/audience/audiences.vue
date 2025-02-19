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
import { useAudienceStore } from '~/src/stores/audienceStore'
import { useCompanyStore } from '~/src/stores/companyStore'

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
  name: string
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

const companyStore = useCompanyStore()
const audienceStore = useAudienceStore()
const selectedAudiences = ref<Audience[]>([])

const audiences = computed(() => audienceStore.audiences)
const loading = computed(() => audienceStore.loading)

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
      icon: 'o_visibility',
      action: (e: Event, item: Audience) => showAudienceDetails(item),
      color: 'white',
      textColor: '#333333'
    },
    {
      icon: 'o_edit',
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

onMounted(async () => {
  audienceStore.init(companyStore.theCompany.uuid)
})
</script>