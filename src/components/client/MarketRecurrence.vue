<template>
  <div>
    <div class="row justify-between q-mb-md">
      <div class="row q-col-gutter-sm col-11">
        <q-input
          v-model="search"
          class="col-12 col-sm-4"
          dense
          outlined
          placeholder="Search">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        
        <q-select
          v-model="stateFilter"
          :options="stateOptions"
          label="State"
          dense
          outlined
          multiple
          class="col-12 col-sm-3"/>

        <q-select
          v-model="frequencyFilter"
          :options="frequencyOptions"
          label="Frequency"
          dense
          outlined
          class="col-12 col-sm-2"/>
      </div> 
      <div class="col-1 row justify-end">
        <div>
          <q-btn size="sm" round color="positive" @click="addCampaign($event)">
            <i class="fa fa-plus"></i>
          </q-btn>
        </div>
      </div>
    </div>

    <q-list separator class="c-campaign-list">
      <q-item class="header-row">
        <q-item-section side class="rs-column">
          <div class="text-subtitle1 text-weight-medium">State</div>
        </q-item-section>
        <q-item-section class="title-column">
          <div class="text-subtitle1 text-weight-medium">Campaign Info</div>
        </q-item-section>
        <q-item-section class="type-column">
          <div class="text-subtitle1 text-weight-medium">Type</div>
        </q-item-section>
        <q-item-section class="date-column">
          <div class="text-subtitle1 text-weight-medium">Dates</div>
        </q-item-section>
        <q-item-section class="actions-column">
          <div class="text-subtitle1 text-weight-medium">Actions</div>
        </q-item-section>
      </q-item>

      <q-item v-for="campaign in theClient?.campaigns" :key="campaign.uuid" class="">
        <q-item-section side class="rs-column">
          <q-chip
            dense
            :color="getStateColor(campaign.state)"
            :text-color="getStateTextColor(campaign.state)"
          >
            {{ campaign.state }}
          </q-chip>
        </q-item-section>
        
        <q-item-section class="title-column">
          <hover-button :buttons="hoverButtonList" :item="campaign" :show-extra="true"> 
            <div class="title-wrapper c-pointer">
              {{ campaign.type }} - {{ campaign.recurrenceFrequency }}<br>
              <span class="text-caption text-grey-7" v-if="campaign.gics">
                {{ campaign.gics.subIndustryName }}
              </span>
            </div>
          </hover-button>
        </q-item-section>

        <q-item-section class="type-column">
          <div class="text-body2 text-grey-7">
            {{ campaign.type }}
          </div>
        </q-item-section>

        <q-item-section class="date-column">
          <div class="text-body2 text-grey-7">
            {{ formatDateRange(campaign.startDate, campaign.endDate) }}
          </div>
        </q-item-section>

        <q-item-section class="actions-column">
          <div class="row q-gutter-sm justify-end">
            <q-btn
              v-if="campaign.state === 'active'"
              flat
              round
              size="sm"
              color="warning"
              icon="fa fa-pause"
              @click="pauseCampaign(campaign)"
            />
            <q-btn
              v-if="campaign.state === 'paused'"
              flat
              round
              size="sm"
              color="positive"
              icon="fa fa-play"
              @click="resumeCampaign(campaign)"
            />
            <q-btn
              v-if="campaign.state === 'paused'"
              flat
              round
              size="sm"
              color="negative"
              icon="fa fa-stop"
              @click="stopCampaign(campaign)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { ref, computed, type Reactive } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { Client } from '@/src/repository/client/Client'
import { MarketRecurrence } from '@/src/repository/marketRecurrence/MarketRecurrence'
import dateHandler from '@/src/asset/composable/date'
import type { marketRecurrenceObject } from '@/src/repository/marketRecurrence/Interface'

// Constants
const stateOptions = ['active', 'paused', 'stopped']
const frequencyOptions = ['daily', 'weekly', 'monthly']

// Reactive state
const search = ref('')
const stateFilter = ref<string[]>([])
const frequencyFilter = ref<string>('')

const mainDisplayStore = useMainDisplayStore()
const theClient = inject<Reactive<Client | null>>('theClient')

const hoverButtonList = computed(() => [
  {
    icon: 'fa fa-edit',
    action: editCampaign,
    color: 'default',
    textColor: '#333333'
  },
  {
    icon: 'fa fa-chart-line',
    action: viewStats,
    color: 'default',
    textColor: '#333333'
  }
])

onMounted(async () => {
  if (theClient) {
    await theClient.getCampaigns(1, 100, { states: stateFilter.value })
  }
})

// Utility functions
const getStateColor = (state: string) => {
  switch (state) {
    case 'active': return 'green-1'
    case 'paused': return 'orange-1'
    case 'stopped': return 'red-1'
    default: return 'grey-1'
  }
}

const getStateTextColor = (state: string) => {
  switch (state) {
    case 'active': return 'green'
    case 'paused': return 'orange'
    case 'stopped': return 'red'
    default: return 'grey'
  }
}

const formatDateRange = (startDate?: number, endDate?: number) => {
  if (!startDate) return '-'
  const start = dateHandler.formatDayMonth(new Date(startDate))
  if (!endDate) return start
  return `${start} - ${dateHandler.formatDayMonth(new Date(endDate))}`
}

// Action handlers
const editCampaign = (event: Event, campaign: MarketRecurrence) => {
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const popup = {
    client: theClient,
    view: 'MarketRecurrency',
    isOpen: true,
    item: campaign,
    triggerElement: triggerRect
  }
  mainDisplayStore.updatePopupDisplay(popup)
}

const viewStats = (event: Event, campaign: MarketRecurrence) => {
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const popup = {
    client: theClient,
    view: 'CampaignStats',
    isOpen: true,
    item: campaign,
    triggerElement: triggerRect
  }
  mainDisplayStore.updatePopupDisplay(popup)
}

const addCampaign = (event: Event) => {
  const campaign = new MarketRecurrence(null)
  if (theClient?.uuid) {
    const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
    const popup = {
      client: theClient,
      view: 'MarketRecurrency',
      isOpen: true,
      item: campaign,
      triggerElement: triggerRect
    }
    mainDisplayStore.updatePopupDisplay(popup)
  }
}

const pauseCampaign = (campaign: MarketRecurrence) => {
  campaign.pause()
}

const resumeCampaign = (campaign: MarketRecurrence) => {
  campaign.resume()
}

const stopCampaign = (campaign: MarketRecurrence) => {
  campaign.stop()
}

// Watch for filter changes
watch([stateFilter, search, frequencyFilter], async () => {
  if (theClient) {
    await theClient.getCampaigns(1, 100, {
      states: stateFilter.value
    })
  }
})
</script>

<style scoped lang="scss">
.c-campaign-list {
  .q-item {
    padding: 8px 16px;
    min-height: 48px;
    position: relative;
  }

  .header-row {
    border-bottom: 1px solid #ddd;
  }

  .rs-column {
    flex-grow: 0.3;
  }

  .title-column {
    flex-grow: 5.5;
    .title-wrapper {
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .type-column {
    flex-grow: 1;
    padding-left: 16px;
    padding-right: 16px;
  }

  .date-column {
    flex-grow: 1;
  }

  .actions-column {
    flex-grow: 0.4;
    text-align: right;

    .q-btn {
      margin: 0 4px;
      opacity: 0.7;
      
      &:hover {
        opacity: 1;
      }
    }
  }

  .row.q-gutter-sm {
    margin: 0 -4px;
  }
}
</style>