<template>
  <div class="c-content-marketing q-pa-md">
    <!-- Header Section -->

    <div class="text-h6 q-mb-sm">Content marketing <q-icon name="fa fa-circle-info" class="c-small-text" /></div>
    <div class="text-caption text-grey-7 q-mb-lg">
      Creation of value-added content for your target audience.
    </div>
    <div>
      <!-- Filters Section-->
      <div class="row q-col-gutter-md q-mb-lg">
        <div>
        <q-btn-group unelevated class="c-btn-group">
          <q-btn
            color="grey-1"
            text-color="#333333"
          >
          <i class="fa fa-tree"></i>
          </q-btn>
        
          <q-btn
           
            unelevated
            color="primary"
          >
          <i class="fa fa-list"></i>
          </q-btn>
        </q-btn-group>
      </div>

        <div class="col-12 col-sm-3">
          <MultiSelect dense  v-model="productFilter" :options="products" label-name="name" label="Products" :display-selected="'number'" ></MultiSelect> 
       
        </div>
        <div class="col-12 col-sm-3">
          <MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Audiences" :display-selected="'number'" ></MultiSelect> 
         
        </div>
      </div>
      
      <!-- Content List -->
      <div class="row full-width">
        <div class="col-7">
          <q-list separator class="content-list ">
            <!-- Headers -->
            <q-item class="header-row text-grey-7">
              <q-item-section side style="width: 48px">
                <div class="text-caption">RS</div>
              </q-item-section>
              <q-item-section>
                <div class="text-caption">Title</div>
              </q-item-section>
              <q-item-section side style="width: 100px">
                <div class="text-caption">Visitors</div>
              </q-item-section>
              <q-item-section style="width: 120px; text-align: center;">
                <div class="text-caption">Leads</div>
              </q-item-section>
            </q-item>
            
            <!-- Content Items -->
            <q-item v-for="page in filteredPages" :key="page.uuid" class="content-item" :class="{'bg-grey-2':page.uuid == selectedPage.uuid}">
              <q-item-section side style="width: 48px">
               <ScoreDisplay :score="page.score" size="18px" />
              </q-item-section>
              
              <q-item-section class="clickable"  @click="selectPage(page)">

                  <div class="content-info">
                    <div class="text-subtitle2">{{ page.title }}</div>
                    <div class="text-caption text-grey-7">
                      Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
                    </div>
                  </div>

              </q-item-section>
              
              <q-item-section side style="width: 100px">
                <div class="text-subtitle2">{{ '15,000' }}</div>
              </q-item-section>
              
              <q-item-section style="width: 120px; text-align: center;">
                <div class="text-subtitle2">{{ 25 }}</div>
              </q-item-section>
              <SelectedElementIndicator :rounded="false" color="bg-primary" :show="selectedPage.uuid == page.uuid"></SelectedElementIndicator>
            </q-item>
          </q-list>
          
          <!-- Pagination 
          <div class="row justify-center q-mt-lg">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="6"
              boundary-numbers
              direction-links
            />
          </div>-->
        </div>
    
        <div class="col-5">
          <PageViewer :page="selectedPage"></PageViewer>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {  ref, type Reactive  } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'

import { date, event } from 'quasar';

import pages from '~/src/repository/pages';
import products from '~/src/repository/product';
import audience from '~/src/repository/audience';
import PageViewer from './usedComponent/PageViewer.vue';
import { mdiConsoleLine } from '@quasar/extras/mdi-v4';
import MultiSelect from './usedComponent/MultiSelect.vue';


// Rest of your constants...
const statusOptions = ['Tous', 'Generated', 'Idea'] as const
const publishOptions = ['Tous', 'Publié'] as const

const hoverButtonList = computed(()=>{
  
  return [
  
  ]}) 
  

  const filteredPages = computed(() =>{

     return pages.filter(page =>{
        if(productFilter.value.length){

          if(audienceFilter.value.length){
            return productFilter.value.includes(page.productUuid) && audienceFilter.value.includes(page.personaUuid)
          }
          return productFilter.value.includes(page.productUuid)
        }
        return true
     })
  })
  // Reactive state
  const search = ref('')
  const statusFilter = ref<typeof statusOptions[number]>('Tous')
  const publishFilter = ref<typeof publishOptions[number]>('Tous')
  const productFilter = ref<string[]>([])
  const audienceFilter = ref<string[]>([])
  const mainDisplayStore = useMainDisplayStore()
  const { main} = storeToRefs(mainDisplayStore)
  const selected = ref('first')
    
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const totalItems = ref(0)
    
    const selectedPage = ref<any>({})
    const filter = reactive<{generatedOnly: boolean | null}>({
      generatedOnly : null
    })
    
    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
    
    onMounted(async () => {
    })
    
    const formatDate = (dateString:string) => {
      return date.formatDate(dateString, 'D MMM.')
    }
    
    const selectPage = (page:any)=>{
      console.log('hello')
      selectedPage.value = page

    }
    
  </script>
  
  <style lang="scss" scoped>
  .c-content-marketing {
    .content-list {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
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