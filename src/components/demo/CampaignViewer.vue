<template>
  <div class="row c-px-32 full-width">
    <div class="col-12 q-pb-md">
      <q-tabs
        color="primary"
        :align="'left'"  
              active-color="primary"
      indicator-color="primary"
      >
        <q-tab  name="products" label="Products" @click="setListView('products')" />
        <q-tab  name="pages" label="Posts" @click="setListView('pages')"/>
      </q-tabs>
    </div>
    <div class="c-content-marketing row  col-12">
      <!-- Header Section -->
      <div class="row full-width col-12">
        
        <div :class="showDetail? 'col-3' :'col-6' ">
              <div class="text-h6 q-mb-sm">Content marketing <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
              <div class="text-caption text-grey-7 q-mb-lg">
                Creation of value-added content for your target audience.
              </div>
              
              <div class="col-3">
                <!-- Filter Section-->
                <div class="row q-col-gutter-md q-mb-lg">
              
              <div class="col-12 col-sm-6">
                <MultiSelect dense
                v-model="productFilter"
                :options="products"
                label-name="name"
                label="Products"
                :display-selected="'number'"
                :use-search="true" ></MultiSelect> 
                
              </div>
             <!-- <div class="col-12 col-sm-3">
                <MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Brands" :display-selected="'number'" ></MultiSelect> 
                
              </div>-->
              <div class="col-12 col-sm-6">
                <MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Audiences" :display-selected="'number'" ></MultiSelect> 
                
              </div>
            </div>
            
            <!-- Content List -->
            
            <PageList v-if="listView == 'pages'" v-model="selectedPage"  :product-filter="productFilter" :audience-filter="audienceFilter" :small-version="showDetail"></PageList>
            <ProductList v-if="listView == 'products'" v-model="selectedPage"  :filter="productFilter"  :audience-filter="audienceFilter" ></ProductList>
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
        </div>
        <div class="c-page-detail-container" :class="{'col-3': showDetail}">
          <PageDetail :page="selectedPage"></PageDetail>
        </div>
        <div :class="showDetail? 'col-6' : 'col-6'">
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

import products from '~/src/repository/product';
import audience from '~/src/repository/audience';
import PageViewer from './usedComponent/PageViewer.vue';
import { mdiConsoleLine } from '@quasar/extras/mdi-v4';
import MultiSelect from './usedComponent/MultiSelect.vue';
import PageList from './usedComponent/PageList.vue';
import ProductList from './usedComponent/ProductList.vue';
import pages from '~/src/repository/pages';
import PageDetail from './usedComponent/PageDetail.vue';



// Rest of your constants...
const statusOptions = ['Tous', 'Generated', 'Idea'] as const
const publishOptions = ['Tous', 'Publié'] as const


// Reactive state
const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')
const productFilter = ref<string[]>([])
const audienceFilter = ref<string[]>([])
const mainDisplayStore = useMainDisplayStore()
const { main} = storeToRefs(mainDisplayStore)
const listView = ref('products')
const showDetail = ref(false)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const selectedPage = ref<any>({})
const filter = reactive<{generatedOnly: boolean | null}>({
  generatedOnly : null
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

onMounted(async () => {
  selectedPage.value = pages[0]
})

const formatDate = (dateString:string) => {
  return date.formatDate(dateString, 'D MMM.')
}

const selectPage = (page:any)=>{
  console.log('hello')
  selectedPage.value = page
  
}

const setListView = (listViewName:string) =>{
  listView.value = listViewName
}

watch(selectedPage, (newValue)=>{
  if(newValue.uuid){
    showDetail.value = true
  }
}, {deep:true})

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

.c-page-detail-container{
  
  overflow:hidden;
  transition: 0.25s;
  position:sticky;
  top:10px;
  
}
</style>