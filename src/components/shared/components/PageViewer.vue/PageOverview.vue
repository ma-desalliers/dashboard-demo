<template>
  <div class="row q-col-gutter-md">
    <AgentMessage></AgentMessage>

    <CExpansionItem 
      v-model="audience" 
      class="c-border-bottom full-width" 
      :title="$t('audience')"
    >
    <div class="row q-col-gutter-md">
      <div class="col-6 c-box-subtitle">
        {{ $t('name') }} :
      </div>
      <div class="col-6 ">
        
      </div>
    </div>
    </CExpansionItem>
    <CExpansionItem 
      v-model="products" 
      class="c-border-bottom full-width" 
      :title="$t('products')"
    >
    </CExpansionItem>
    <CExpansionItem 
      v-model="brandVoice" 
      class="c-border-bottom full-width" 
      :title="$t('brand-voice')"
    >
    </CExpansionItem>
    <CExpansionItem 
      v-model="pageOutline" 
      class="c-border-bottom full-width" 
      :title="$t('page-outline')"
    >
    </CExpansionItem>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAudienceStore} from '@/src/stores/audienceStore'
import { useProductStore} from '@/src/stores/productStore'
import { usePageStore} from '@/src/stores/pageStore'
import { StaticMarketRepository } from '~/src/repository/markets/Repository'


const pageStore = usePageStore();
const audienceStore = useAudienceStore();

const thePage = computed(() => pageStore.thePage);

//const theAudience = computed(() =>{ audienceStore.audiences.find(audience => audience.uuid == thePage.value.) })

onMounted(()=>{
  if(thePage.value?.uuid && thePage.value.marketUuid)
    StaticMarketRepository.findByUuid(thePage.value?.marketUuid)
})

// Define reactive variables for each expansion item
const brandVoice = ref(true)
const audience = ref(true)
const products = ref(true)
const pageOutline = ref(true)
</script>