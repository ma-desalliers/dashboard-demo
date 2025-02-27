<template>
  <div class="row q-col-gutter-md">
    <AgentMessage></AgentMessage>

    <CExpansionItem 
      v-model="audience" 
      class="c-border-bottom full-width" 
      :title="$t('audience')"
    >
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

// Define reactive variables for each expansion item
const brandVoice = ref(true)
const audience = ref(true)
const products = ref(true)
const pageOutline = ref(true)
</script>