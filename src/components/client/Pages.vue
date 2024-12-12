<template>
  <div>
    <div class="row q-col-gutter-sm q-mb-md">
      <q-select
        v-model="statusFilter"
        :options="statusOptions"
        @update:model-value="loadPages()"
        label="Status"
        dense
        outlined
        class="col-12 col-sm-2"/>
    </div>

    <q-list separator class="c-client-list">
    <q-item class="header-row">
      <q-item-section side class="rs-column">
        <div class="text-subtitle1 text-weight-medium">RS</div>
      </q-item-section>
      <q-item-section class="title-column">
        <div class="text-subtitle1 text-weight-medium">Title</div>
      </q-item-section>
      <q-item-section class="type-column">
        <div class="text-subtitle1 text-weight-medium">Status</div>
      </q-item-section>
      <q-item-section class="date-column">
        <div class="text-subtitle1 text-weight-medium">Date</div>
      </q-item-section>
      <q-item-section class="feedback-column">
        <div class="text-subtitle1 text-weight-medium">Feedback</div>
      </q-item-section>
    </q-item>

    <q-item v-for="page in paginatedPages" :key="page.uuid" class="">
      <q-item-section side class="rs-column">
        <ScoreDisplay :score="page.score"></ScoreDisplay>
    
      </q-item-section>
      
      <q-item-section class="title-column">
        <hover-button :buttons="hoverButtonList" :item="page" :show-extra="true">
          <div class="title-wrapper c-pointer">
            {{ page.title }}
          </div>

          <template #dropdown-content-0="{ formData, 'onUpdate:formData': updateData }">
              <language-select v-model="formData.lang" default="English"></language-select>
            </template>
        </hover-button>
      </q-item-section>

      <q-item-section class="type-column">
        <div class="text-body2 text-grey-7">
          <q-chip
            :class="{'c-bg-primary-lighten': page.hasContent}"
            :color="page.hasContent ? '' : 'grey-3'"
            :label="page.hasContent ? 'Rédigé' : 'Idée'"
          />
        </div>
      </q-item-section>

      <q-item-section class="date-column">
        <div class="text-body2 text-grey-7">
          {{ dateHandler.formatDayMonth(page.createdAt) }}
        </div>
      </q-item-section>

      <q-item-section class="feedback-column">
        <div class="row q-gutter-sm justify-end">
          <q-btn flat round size="sm" :color="page.positiveLikes? 'positive':'green-2'" class="c-relative"  icon="thumb_up">
            <q-badge floating color="grey" class="c-bottom-badge" v-if="page.positiveLikes">
              {{ page.positiveLikes }}
            </q-badge>
          </q-btn>
          <q-btn flat round size="sm" :color="page.negativeLikes? 'negative':'red-2'"  class="c-relative" icon="thumb_down">
            <q-badge floating color="red" class="c-bottom-badge" v-if="page.negativeLikes">
              {{ page.negativeLikes }}
            </q-badge>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
  <div class="row justify-center q-mt-md">
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
import { Client } from '~/src/repository/client/Client'
import dateHandler from '~/src/asset/composable/date';
import { Pages } from '@/src/repository/pages/Page';
import { date, event } from 'quasar';
import { Feedback } from '../../repository/feedback/Feedback';
import type { FeedbackObject } from '~/src/repository/feedback/Interface';

// Rest of your constants...
const statusOptions = ['Tous', 'Generated', 'Idea'] as const
const publishOptions = ['Tous', 'Publié'] as const

const hoverButtonList = computed(()=>{

  return [
  {
    icon: 'fa fa-eye',
    action:  viewPage,
    color: 'default',
    title:'view page',
    textColor:'#333333',
    condition: {param:'hasContent', value:true}
  },
  {
    isDropdown: true,
    icon: 'fa fa-bolt',
    action: ()=>{ console.log('SUUP')},
    color: 'white',
    textColor:'secondary',
    title:"Generate the page",
    condition: {param:'hasContent', value:false},
    description: '',
      actionButtonColor:'secondary',
      actionButtonText: 'Generate',
      onConfirm: async (formData:any, page: any) => {
        generateThePage(formData,page)
      },
  },
  {
    icon: 'fa-solid fa-envelope',
    action:  sendPage,
    color: 'default',
    label:'Send Email ?',
    textColor:'positive',
    requireConfirm:true,
    condition: {param:'hasContent', value:true}
  },
  {
    icon: 'fa fa-users',
    action: viewMarket,
    color: 'default',
    textColor:'#333333'
  },
  {
    icon: 'fa fa-pen',
    action: viewPageDescription,
    color: 'default',
    textColor:'#333333'
  },
 /* {
    isDropdown: true,
    icon: 'delete',
    color: 'negative',
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item?',
    actionButtonText: 'Delete',
    onConfirm: async (formData:any) => {
      console.log('Deleting with data:', formData);
    },
    showHeader:false,
    showButton:false
  }*/
]}) 

// Reactive state
const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')

const mainDisplayStore = useMainDisplayStore()
const { main} = storeToRefs(mainDisplayStore)

const theClient = inject<Reactive<Client | undefined>>('theClient')

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const paginatedPages = ref<Pages[]>([])
const filter = reactive<{generatedOnly: boolean | null}>({
  generatedOnly : null
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

onMounted(async () => {
  await loadPages()
})

const formatDate = (dateString:string) => {
  return date.formatDate(dateString, 'D MMM.')
}

const giveFeedback = (page:Pages, liked:boolean) => {
  page.addFeedback(liked)
}

const viewPageDescription = async (event:Event, page: Pages) => {
  try {
    //mainDisplayStore.setcustomViewLoading(true)
    
    await Promise.all([
      page.getMarkets(),
      page.getFullPage()
    ])

    console.log(page)

    const mainDisplayValues = {
      client:theClient,
      view: 'PageDescription',
      item: page,
    }
    mainDisplayStore.updateMainDisplay(mainDisplayValues)

  } catch (error) {
    console.error('Error loading page:', error)
  } finally {
   // mainDisplayStore.setcustomViewLoading(false)
  }
}

const loadPages = async () => {
  if (!theClient) return

  if(statusFilter.value == 'Tous'){
    filter.generatedOnly = null
  }
  if(statusFilter.value == 'Generated'){
    filter.generatedOnly = true
  }
  if(statusFilter.value == 'Idea'){
    filter.generatedOnly = false
  }

  try {
    const response = await theClient.getPages(currentPage.value, itemsPerPage.value, filter)
    paginatedPages.value = response.data
    totalItems.value = response.pagination.totalItems
  } catch (error) {
    console.error('Error loading pages:', error)
  }
}

const viewPage = (event:Event, page: Pages) => {
  console.log('here')

  const feedback =  page.getFeedback()
  console.log(feedback)
  const mainDisplayValues = {
    client:theClient,
    view: 'Iframe',
    item:  `https://ai.cameleonmedia.com/content/${page.uuid}`,
  }
  mainDisplayStore.updateMainDisplay(mainDisplayValues)
}

const viewMarket = async  (event:Event, page: Pages) => {
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  const market =  await page.getMarkets()

  const popup = {
    client: theClient,
    view: 'MarketEditor',
    isOpen: true,
    item:market,
    triggerElement:triggerRect
  }

  mainDisplayStore.updatePopupDisplay(popup)
}

const generateThePage = async (formData:any, page: Pages) =>{
  page.language = formData.lang
  console.log(formData, page.language)
  await page.generate()
}

const sendPage= async (event:any, page:Pages) =>{
  console.log('sendingPage')
  await page.email()
}

watch(currentPage, async () => {
  await loadPages()
})

</script>

<style scoped lang="scss">
h1 {
  color: #42b983;
}


.c-client-list {
  .q-item {
    padding: 8px 16px;
    min-height: 48px;
    position: relative;
  }

  .header-row {
    border-bottom: 1px solid #ddd;
  }

  // Column layouts
  .rs-column {
    flex-grow: 0.3;
   /* width: 48px;
    min-width: 48px;*/
  }

  .title-column {
    /*min-width: 200px;
    max-width: 300px;*/
    flex-grow:5.5;
    .title-wrapper {
      width: 100%;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .type-column {
    flex-grow: 1;  // Allow type column to take remaining space
    padding-left: 16px;
    padding-right: 16px;
  }

  .date-column {
    flex-grow:1;
    //min-width: 100px;
  }

  .feedback-column {
    flex-grow:1.1;
    /*width: 100px;
    min-width: 100px;*/

    .q-btn {
      margin: 0 4px;
      opacity: 0.7;
      
      &:hover {
        opacity: 1;
      }
    }
  }

  // Adjust feedback buttons container
  .row.q-gutter-sm {
    margin: 0 -4px;
  }
}


.c-bottom-badge {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  height:12px;
  width:20px;
}
</style>