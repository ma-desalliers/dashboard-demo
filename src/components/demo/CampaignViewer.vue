<template>
  <div class="c-content-marketing q-pa-md">
    <!-- Header Section -->
    <div class="text-h6 q-mb-sm">Content marketing <q-icon name="info" size="xs" /></div>
    <div class="text-caption text-grey-7 q-mb-lg">
      Creation de contenu à valeur ajoutée pour votre audience cible.
    </div>

    <!-- Filters Section -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-3">
        <q-select
          label="Products"
          v-model="productFilter"
          :options="[]"
          dense
          outlined
          placeholder="Select a product"
        />
      </div>
      <div class="col-12 col-sm-3">
        <q-select
          label="Audience"
          v-model="audienceFilter"
          :options="[]"
          dense
          outlined
          placeholder="Blast cabinets"
        />
      </div>
    </div>

    <!-- Content List -->
    <q-list separator class="content-list "style="max-height:calc(580px); overflow-y: auto;">
      <!-- Headers -->
      <q-item class="header-row text-grey-7">
        <q-item-section side style="width: 48px">
          <div class="text-caption">RS</div>
        </q-item-section>
        <q-item-section>
          <div class="text-caption">CONTENT</div>
        </q-item-section>
        <q-item-section side style="width: 100px">
          <div class="text-caption">VOLUME</div>
        </q-item-section>
        <q-item-section side style="width: 120px">
          <div class="text-caption">STATUS</div>
        </q-item-section>
      </q-item>

      <!-- Content Items -->
      <q-item v-for="page in pages" :key="page.uuid" class="content-item" >
        <q-item-section side style="width: 48px">
          <ScoreDisplay :score="page.score" size="32px" />
        </q-item-section>

        <q-item-section>
          <hover-button :buttons="hoverButtonList" :item="page" :show-extra="true">
            <div class="content-info">
              <div class="text-subtitle2">{{ page.title }}</div>
              <div class="text-caption text-grey-7">
                Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
              </div>
            </div>

            <template #dropdown-content-0="{ formData, 'onUpdate:formData': updateData }">
              <language-select v-model="formData.lang" default="English" />
            </template>
          </hover-button>
        </q-item-section>

        <q-item-section side style="width: 100px">
          <div class="text-subtitle2">{{ page.positiveLikes || '15,000' }}</div>
        </q-item-section>

        <q-item-section side style="width: 120px">
          <q-btn
            flat
            :label="page.language || 'Programmé'"
            class="text-primary"
            style="text-transform: none"
            icon-right="expand_more"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Pagination -->
    <div class="row justify-center q-mt-lg">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="6"
        boundary-numbers
        direction-links
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {  ref, type Reactive  } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'

import { date, event } from 'quasar';

import pages from '~/src/repository/pages';


// Rest of your constants...
const statusOptions = ['Tous', 'Generated', 'Idea'] as const
const publishOptions = ['Tous', 'Publié'] as const

const hoverButtonList = computed(()=>{

  return [
  
]}) 

// Reactive state
const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')
const productFilter = ref()
const audienceFilter = ref()
const mainDisplayStore = useMainDisplayStore()
const { main} = storeToRefs(mainDisplayStore)

const theClient = inject<Reactive<Client | undefined>>('theClient')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const filter = reactive<{generatedOnly: boolean | null}>({
  generatedOnly : null
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

onMounted(async () => {
})

const formatDate = (dateString:string) => {
  return date.formatDate(dateString, 'D MMM.')
}



</script>

<style lang="scss" scoped>
.c-content-marketing {
  .content-list {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: white;
  }

  .header-row {
    background: #f8f9fa;
    min-height: 40px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .content-item {
    min-height: 72px;
    
    &:hover {
      background: #f8f9fa;
    }
  }

  .content-info {
    .text-subtitle2 {
      font-weight: 500;
      line-height: 1.2;
    }
    
    .text-caption {
      margin-top: 4px;
    }
  }

  .q-item {
    padding: 8px 16px;
  }
}
</style>