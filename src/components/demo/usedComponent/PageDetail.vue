<template>
    <div class="page-detail q-pa-lg" :class="{'isMobile': isMobile}">
    <div >
      <div class="c-section-bigtitle q-pb-sm">{{ page.title }}</div>
      <div class="column">
        <div class="q-pb-md" v-if="page.subjob">
          <span class="c-box-subtitle c-smaller">Sub-job&nbsp;:&nbsp;</span><span>{{ page.subjob?.title }}</span>
        </div>
        <div class="q-pb-md" v-if="page.job">
          <span class="c-box-subtitle c-smaller">Job&nbsp;:&nbsp;</span><span>{{ page.job?.title }}</span>
        </div>
        <div class="q-pb-md" v-if="page.job">
          <span class="c-box-subtitle c-smaller">Type&nbsp;:&nbsp;</span><span>{{ page.job?.type }}</span>
        </div>
       
      </div>
    </div>
    <div class="business-profile  ">
      <div class="header q-pb-md  ">
        <div class="row items-center q-gutter-x-sm">
            <q-btn rounded dense class="bg-green-1 br-green" text-color="green" icon="edit" />
            <q-btn rounded dense class="bg-green-1 br-green" text-color="green" icon="publish" />
            <q-btn rounded dense class="bg-green-1 br-green" text-color="green" icon="tune"  />
        </div>
      </div>
  
      <q-expansion-item
        label="Audience"
        header-class="c-section-subtitle q-pl-none"
        :class="{ 'custom-expansion': true }"
        :style="{ '--expansion-bg-color': 'coor white' }"
        class="q-mb-md"
        :default-opened="true"
        hide-expand-icon
      >
      <template v-slot:header>
        <div class="row items-center q-gutter-sm full-width c-expansion-header-hover">
          <div class="row items-center" >
            <span class="c-section-subtitle">Audiences</span>
          </div>
          <div>
            <q-btn size="12px" bordered class="c-border-primary c-ai-btn" color="white">
              <div class="row q-pr-sm" style="max-width:33px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 20 220 180" class="col-6" style="transform:scale(1.5)">
                  <!-- Large star - left (moved up) -->
                  <path d="M40 40 L60 100 L120 120 L60 140 L40 200 L20 140 L-40 120 L20 100 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - top right (moved left) -->
                  <path d="M120 20 L130 50 L160 60 L130 70 L120 100 L110 70 L80 60 L110 50 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - bottom right -->
                  <path d="M140 120 L150 150 L180 160 L150 170 L140 200 L130 170 L100 160 L130 150 Z" 
                        fill="#213343"/>
                </svg>
              <span class="q-pl-sm text-primary c-btn-text-sm col-6">AI</span>
            </div>
            </q-btn>
          </div>
        </div>
      </template>
  
        <div class="content-wrapper q-pa-lg">
         
  
          <div class="business-details">
            <div class="text-h6 q-mb-md">{{ theAudience?.title }}</div>
            
            <div class="column q-col-gutter-sm">
        
              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Sector&nbsp;:&nbsp;</span>
                  {{ theAudience?.sectorName }}
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Industry&nbsp;:&nbsp;</span>
                  {{ theAudience?.subIndustryName }}
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Sub-industry&nbsp;:&nbsp;</span>
                  {{ theAudience?.subIndustryName }}
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Location&nbsp;:&nbsp;</span>
                  {{theAudience?.countryName}} - {{theAudience?.stateName}} - {{theAudience?.cityName }} 
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Model&nbsp;:&nbsp;</span>
                  {{ model }}
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Annual revenue&nbsp;:&nbsp;</span>
                  {{ theAudience?.revenue }}
                </span>
              </div>
          
            </div>
          </div>
        </div>
      </q-expansion-item>
  
      <q-expansion-item
        label="Product"
        header-class="c-section-subtitle q-pl-none"
        :class="{ 'custom-expansion': true }"
        :style="{ '--expansion-bg-color': 'white' }"
        :default-opened="true"
        hide-expand-icon
      >
      <template v-slot:header>
        <div class="row items-center q-gutter-sm full-width c-expansion-header-hover">
          <div class="row items-center" >
            <span class="c-section-subtitle">Products</span>
          </div>
          <div>
            <q-btn size="12px" bordered class="c-border-primary c-ai-btn" color="white">
              <div class="row q-pr-sm" style="max-width:33px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 20 220 180" class="col-6" style="transform:scale(1.4)">
                  <!-- Large star - left (moved up) -->
                  <path d="M40 40 L60 100 L120 120 L60 140 L40 200 L20 140 L-40 120 L20 100 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - top right (moved left) -->
                  <path d="M120 20 L130 50 L160 60 L130 70 L120 100 L110 70 L80 60 L110 50 Z" 
                        fill="#213343"/>
                  <!-- Smaller star - bottom right -->
                  <path d="M140 120 L150 150 L180 160 L150 170 L140 200 L130 170 L100 160 L130 150 Z" 
                        fill="#213343"/>
                </svg>
              <span class="q-pl-sm text-primary c-btn-text-sm col-6">AI</span>
            </div>
            </q-btn>
          </div>
        </div>
        </template>
        <div class="content-wrapper q-py-lg">
          <q-img
            :src="theProduct?.image || ''"
            height="160px"
            class="rounded-borders q-mb-md"
          />
  
          <div class="business-details">
            <div class="text-h6 q-mb-md">{{ theProduct?.name }}</div>
            
            <div class="column q-col-gutter-sm">
      

                <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Category&nbsp;:&nbsp;</span>
                  {{  theProduct?.category?.name}}
                </span>
              </div>

              <div class="row">
                <span>
                  <span class="c-box-subtitle c-smaller">Sub-category&nbsp;:&nbsp;</span>
                  
                  <span>{{ theProduct?.subcategory?.name }}</span>
                </span>
              </div>

            </div>
          </div>
        </div>
      </q-expansion-item>
    </div>
</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import products from '@/src/repository/product';
  import audience from '@/src/repository/audience';
  import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
  
  // Sample data - replace with actual data from your application
  const businessName = ref('Heavy Equipment Resellers')
  const sector = ref('Material')
  const industry = ref('Material')
  const subIndustry = ref('Industrial Machinery & Supplies & Components')
  const location = ref('United-States • English')
  const model = ref('B2B, B2G')
  const revenue = ref('2M to 50M')
const mainDisplayStore = useMainDisplayStore()

const props = defineProps<{
  page?: any
}>()


const theAudience = computed(()=>{
  return audience.find(a => a.uuid == props.page?.personaUuid)
})

const theProduct = computed(()=>{
  return products.find(a => a.uuid == props.page?.productUuid)
})

const isMobile = computed(()=> mainDisplayStore.isMobile)

  </script>
  
  <style scoped lang="scss">
  .business-profile {
    .header {
    }
  
    .content-wrapper {
      background-color: #fff;
      padding:24px 8px;
    }
  
    .business-details {
      .detail-item {
        .text-subtitle2 {
          color: #666;
          font-weight: 500;
        }
      }
    }
  
    :deep(.q-expansion-item__container) {

      border-radius: 8px;
      margin-bottom: 1rem;
    }
  
    :deep(.q-expansion-item__content) {
      background-color: #fff;
    }
  }


  .text-h6{
    
    line-height:1.5 !important;
    font-size: 16px;
  }
  .page-detail{
    position:sticky;
    top:20px;
    z-index:12;
    max-height:calc(100vh - 70px);
    overflow-y: auto;
    scrollbar-color: #eeeeee transparent;
    scrollbar-width:thin;
    &.isMobile{
      position:unset
    }
  }

.page-detail::-webkit-scrollbar-thumb {
 // background: #eeeeee !important;
  border-radius: 4px;
}

.page-detail::-webkit-scrollbar-thumb:hover {
  background: #eeeeee;
}

  .c-btn-text-sm{
    font-size: 14px;

  }

  .c-ai-btn{
    padding:4px 8px;
  }

  .custom-expansion{
    border-top:1px solid #e7e7e7
  }
  </style>