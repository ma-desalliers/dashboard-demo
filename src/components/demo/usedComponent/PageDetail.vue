<template>
    <div class="page-detail">
    <div class="content-info q-px-md">
      <div class="c-section-bigtitle q-pb-sm">{{ page.title }}</div>
      <div class="c-font-16 text-grey q-pb-md">
        Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
      </div>
    </div>
    <div class="business-profile  ">
      <div class="header q-pb-md q-mb-md q-px-md">
        <div class="row items-center q-gutter-x-sm">

            <q-btn rounded dense class="bg-green-1 br-green" text-color="primary" icon="edit" />
            <q-btn rounded dense class="bg-green-1 br-green" text-color="primary" icon="publish" />
            <q-btn rounded dense class="bg-green-1 br-green" text-color="primary" icon="tune"  />

        </div>
      </div>
  
      <q-expansion-item
        label="Audience"
        header-class="c-section-subtitle"
        :class="{ 'custom-expansion': true }"
        :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
        class="q-mb-md"
        :default-opened="true"
        hide-expand-icon
      >
      <template v-slot:header>
        <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
          <div class="row items-center" >
            <span class="c-section-subtitle">Audiences</span>
          </div>
          <div>
            <q-btn size="12px" bordered class="c-border-primary c-ai-btn" color="white">
              <i class="fa-solid fa-wand-magic-sparkles text-black c-btn-text-sm"></i>
              <span class="q-pl-sm text-primary c-btn-text-sm">AI</span>
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
        header-class="c-section-subtitle"
        :class="{ 'custom-expansion': true }"
        :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
        :default-opened="true"
        hide-expand-icon
      >
      <template v-slot:header>
        <div class="row items-center justify-between q-gutter-sm full-width c-expansion-header-hover">
          <div class="row items-center" >
            <span class="c-section-subtitle">Products</span>
          </div>
          <div>
            <q-btn size="12px" bordered class="c-border-primary c-ai-btn" color="white">
              <i class="fa-solid fa-wand-magic-sparkles text-black c-btn-text-sm"></i>
              <span class="q-pl-sm text-primary c-btn-text-sm">AI</span>
            </q-btn>
          </div>
        </div>
        </template>
        <div class="content-wrapper q-pa-lg">
          <q-img
            :src="theProduct?.image || ''"
            height="160px"
            class="rounded-borders q-mb-md"
          />
  
          <div class="business-details">
            <div class="text-h6 q-mb-md">{{ theProduct?.name }}</div>
            
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Category</div>
                  <div>{{ theProduct?.subcategory?.name }}</div>
                </div>
                
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Industry</div>
                  <div>{{ industry }}</div>
                </div>
                
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Sub-industry</div>
                  <div>{{ subIndustry }}</div>
                </div>
              </div>
              
              <div class="col-12 col-md-6">
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Location</div>
                  <div>{{ location }}</div>
                </div>
                
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Model</div>
                  <div>{{ model }}</div>
                </div>
                
                <div class="detail-item q-mb-sm">
                  <div class="c-box-subtitle c-smaller">Annual revenue</div>
                  <div>{{ revenue }}</div>
                </div>
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
  
  // Sample data - replace with actual data from your application
  const businessName = ref('Heavy Equipment Resellers')
  const sector = ref('Material')
  const industry = ref('Material')
  const subIndustry = ref('Industrial Machinery & Supplies & Components')
  const location = ref('United-States • English')
  const model = ref('B2B, B2G')
  const revenue = ref('2M to 50M')


const props = defineProps<{
  page?: any
}>()


const theAudience = computed(()=>{
  return audience.find(a => a.uuid == props.page?.personaUuid)
})

const theProduct = computed(()=>{
  return products.find(a => a.uuid == props.page?.productUuid)
})

  </script>
  
  <style scoped lang="scss">
  .business-profile {
    .header {
      border-bottom: 1px solid #e0e0e0;
    }
  
    .content-wrapper {
      background-color: #fff;
      padding:24px;
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
    font-size: 16px;
  }
  .page-detail{
    position:sticky;
    top:20px;
    z-index:12;
    max-height:calc(100vh - 50px);
    overflow-y: auto;
  }

  .c-btn-text-sm{
    font-size: 14px;

  }

  .c-ai-btn{
    padding:4px 8px;
  }
  </style>