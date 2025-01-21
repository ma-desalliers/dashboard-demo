# SEORankingsTable.vue
<template>
  <CTable
    v-model="selectedRows"
    :columns="columns"
    :rows="rows"
    :loading="loading"
    row-key="id"
  >
    <!-- Custom cell templates for percentage changes -->
    <template #cell-traffic="{ value, row }">
      <div class="row items-center">
        {{ value }}
        <q-chip
          dense
          class="q-ml-sm"
          :color="row.trafficChange > 0 ? 'green-1' : 'red-1'"
          :text-color="row.trafficChange > 0 ? 'green' : 'red'"
        >
          {{ formatPercentage(row.trafficChange) }}
        </q-chip>
      </div>
    </template>

    <template #cell-keywords="{ value, row }">
      <div class="row items-center">
        {{ value }}
        <q-chip
          dense
          class="q-ml-sm"
          :color="row.keywordsChange > 0 ? 'green-1' : 'red-1'"
          :text-color="row.keywordsChange > 0 ? 'green' : 'red'"
        >
          {{ formatPercentage(row.keywordsChange) }}
        </q-chip>
      </div>
    </template>

    <template #cell-position="{ value, row }">
      <div class="row items-center">
        {{ value }}
        <q-chip
          dense
          class="q-ml-sm"
          :color="row.positionChange > 0 ? 'green-1' : 'red-1'"
          :text-color="row.positionChange > 0 ? 'green' : 'red'"
        >
          {{ formatPercentage(row.positionChange) }}
        </q-chip>
      </div>
    </template>

    <template #cell-status="{ value }">
      <q-chip
        dense
        :color="value === 'active' ? 'green-1' : 'orange-1'"
        :text-color="value === 'active' ? 'green' : 'orange'"
      >
        {{ value }}
      </q-chip>
    </template>

    <template #cell-actions="{ row }">
      <div class="row items-center">
        <q-btn
          flat
          dense
          size="sm"
          color="primary"
          icon="edit"
          @click="handleEdit(row)"
        >
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
        <template v-if="row.status === 'inactive'">
          <q-btn
            flat
            dense
            size="sm"
            color="grey"
            icon="file_upload"
            class="q-ml-sm"
            @click="handleExport(row)"
          >
            <q-tooltip>Export</q-tooltip>
          </q-btn>
        </template>
      </div>
    </template>
  </CTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import columns from '@/src/asset/tablesColumn/keywords'

//TODO: Add chart, maybe do a component

interface SEOData {
  id: number
  page: string
  topKeyword: string
  traffic: number
  trafficChange: number
  keywords: number
  keywordsChange: number
  position: number
  positionChange: number
  status: 'active' | 'inactive'
}


// Sample data matching the screenshot
const rows: SEOData[] = [
  {
    id: 1,
    page: 'Cameleon Agence Web',
    topKeyword: 'agence web design',
    traffic: 298,
    trafficChange: 26.6,
    keywords: 57,
    keywordsChange: 12.4,
    position: 2.8,
    positionChange: -15.2,
    status: 'active'
  },
  {
    id: 2,
    page: 'Agence Web Montréal',
    topKeyword: 'agence web montreal',
    traffic: 246,
    trafficChange: 23.8,
    keywords: 99,
    keywordsChange: 8.7,
    position: 3.1,
    positionChange: -5.8,
    status: 'active'
  },
  // Add more sample data as needed
]

const selectedRows = ref<SEOData[]>([])
const loading = ref(false)

const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

const handleEdit = (row: SEOData) => {
  console.log('Edit:', row)
  // Implement edit functionality
}

const handleExport = (row: SEOData) => {
  console.log('Export:', row)
  // Implement export functionality
}
</script>

<style scoped>
.q-table th {
  font-weight: 500;
}

.q-chip {
  min-height: 20px;
  font-size: 0.8rem;
}
</style>