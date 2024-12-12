<template>
  <q-layout view="hHh LpR fFf" class="side-panel-layout">
    <q-page-container>
      <slot name="content"></slot>
    </q-page-container>

    <q-btn
      class="tab-trigger"
      flat
      dense
      @click="togglePanel"
      :class="{ 'panel-open': isPanelOpen }"
    >
      <q-icon name="bolt" size="24px" />
    </q-btn>

    <q-drawer
      v-model="isPanelOpen"
      side="right"
      bordered
      :width="300"
      behavior="desktop"
      class="side-drawer"
      @show="openPanel"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item v-for="(item, index) in storageData.jobs" :key="index">
            <q-item-section>
              <q-item-label>{{ item.itemName }} - {{ item.jobId }}</q-item-label>
              <q-item-label caption>{{ item.type }}</q-item-label>
              <q-item-label caption>Status: {{ item.status || checkJobs(item.jobId) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-pa-md">
          <q-btn
            color="primary"
            label="Dismiss"
            @click="handleDismiss"
            class="full-width"
          />
        </div>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalStorageStore } from '~/src/stores/localStorageStore';
import { BaseRepository } from '~/src/repository/BaseRepository';

const localStorageStore = useLocalStorageStore()

interface Item {
  name: string
  status: string
}

interface Props {
  initialItems?: Item[]
}

const props = withDefaults(defineProps<Props>(), {
  initialItems: () => []
})

const emit = defineEmits<{
  (e: 'panel-opened'): void
  (e: 'panel-closed'): void
}>()

const storageData = computed(() => localStorageStore.data)
const jobState = ref()
const isPanelOpen = ref(false)

const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value


}

const closePanel = () => {
  isPanelOpen.value = false
  emit('panel-closed')
}

const updateJobStatuses = () => {
  if (!storageData.value?.jobs) return

  const updatedJobs = storageData.value.jobs.map((job:any) => {
    const jobStatus = checkJobs(job.jobId)
    return {
      ...job,
      status: jobStatus
    }
  })

  localStorageStore.updateField('jobs', updatedJobs)
}

const handleDismiss = () => {
  if (!storageData.value?.jobs) return

  const activeJobs = storageData.value.jobs.filter((job:any) => {
    const status = job.status || checkJobs(job.jobId)
    return status !== 'completed'
  })

  localStorageStore.updateField('jobs', activeJobs)
  closePanel()
}

const checkJobs = (jobid: number) => {
  if (!jobState.value?.length) return ''
  const thejob = jobState.value.find((job: any) => job.data?.job?.id == jobid)

  if (!thejob?.data) return 'completed'
  if (thejob.status == 'failed' || thejob.status == 'unknown') return 'failed'
  return 'in Progress / waiting'
}

const openPanel = async () => {
  try {
    localStorageStore.initializeFromStorage()
    const baseRepo = new BaseRepository()
    
    if (!storageData.value?.jobs?.length) {
      jobState.value = []
      return
    }

    const responses = await Promise.allSettled(
      storageData.value.jobs.map(async (job: any) => {
        try {
          const response = await fetch(`${baseRepo.baseUrl}/api/v1/jobs/${job.jobId}`)
          
          if (response.status === 200) {
            const text = await response.text()
            if (!text) {
              return { data: null, status: 'completed' }
            }
            return { data: JSON.parse(text), status: response.status }
          }
          
          throw new Error(`HTTP error! status: ${response.status}`)
        } catch (error) {
          return {
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
          }
        }
      })
    )

    jobState.value = responses
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter(Boolean)

    updateJobStatuses()
  } catch (error) {
    console.error('Failed to open panel:', error)
    jobState.value = []
  }
}

defineExpose({
  isPanelOpen,
  closePanel,
  togglePanel
})
</script>

<style scoped>
.side-panel-layout {
  min-height: 100vh;
  width: 100%;
}

.tab-trigger {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2000;
  background: #1976D2;
  color: white;
  border-radius: 4px 0 0 4px;
  padding: 8px;
  transition: all 0.20s;
}

.tab-trigger.panel-open {
  right: 300px;
}

:deep(.side-drawer) {
  background: white;
}

:deep(.q-drawer) {
  transition: transform 0.5;
}
</style>