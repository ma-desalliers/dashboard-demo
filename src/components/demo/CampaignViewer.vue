<template>
  <div class="c-content-marketing c-pa-32">
    <!-- Header Section -->
    <div class="row full-width">
      
      <div class="col-7">
        <div class="text-h6 q-mb-sm">Content marketing <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
        <div class="text-caption text-grey-7 q-mb-lg">
          Creation of value-added content for your target audience.
        </div>
        
        <div class="col-3">
          <!-- Filters Section-->
          <div class="row q-col-gutter-md q-mb-lg">
            <div>
              <q-btn-group unelevated class="c-btn-group">
                <q-btn
                :color="listView == 'products'? 'primary' : 'grey-1'"
                :text-color="listView == 'products'? '' : '#333333'"
                class="q-px-md"
                @click="setListView('products')"
                >
                <i class="fa fa-tree"></i>
              </q-btn>
              
              <q-btn
              :color="listView == 'pages'? 'primary' : 'grey-1'"
              :text-color="listView == 'pages'? '' : '#333333'"
              class="q-px-md"
              @click="setListView('pages')"
              >
              <i class="fa fa-list"></i>
            </q-btn>
          </q-btn-group>
        </div>
        
        <div class="col-12 col-sm-3">
          <MultiSelect dense  v-model="productFilter" :options="products" label-name="name" label="Products" :display-selected="'number'" ></MultiSelect> 
          
        </div>
        <div class="col-12 col-sm-3">
          <MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Brands" :display-selected="'number'" ></MultiSelect> 
          
        </div>
        <div class="col-12 col-sm-3">
          <MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Audiences" :display-selected="'number'" ></MultiSelect> 
          
        </div>
      </div>
      
      <!-- Content List -->
      
      <PageList v-if="listView == 'pages'" v-model="selectedPage"  :product-filter="productFilter" :audience-filter="audienceFilter"></PageList>
      <ProductList v-if="listView == 'products'" v-model="selectedPage"  :audience-filter="audienceFilter" ></ProductList>
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
  <div class="col-5">
    <PageViewer :page="selectedPage"></PageViewer>
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
const listView = ref('pages')


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