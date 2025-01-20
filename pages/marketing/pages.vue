<template>
  <MarketingLayout>
    <!-- List Header -->
    <template #list-header>
      <span class="text-h6">Content marketing</span>
    </template>

    <!-- List Content -->
    <template #list>
      <!-- Filter Section -->
      <div class="row q-col-gutter-md q-mb-lg q-px-md">
        <div class="col-12 col-sm-6">
          <MultiSelect
            v-model="productFilter"
            :options="products"
            label-name="name"
            label="Products"
            :display-selected="'number'"
            dense
          />
        </div>
        <div class="col-12 col-sm-6">
          <MultiSelect
            v-model="audienceFilter"
            :options="audiences"
            label-name="title"
            label="Audiences"
            :display-selected="'number'"
            dense
          />
        </div>
      </div>

      <!-- Content List -->
      <PageList
        v-model="selectedPage"
        :product-filter="productFilter"
        :audience-filter="audienceFilter"
        :small-version="true"
      />
    </template>

    <!-- Main Content -->
    <template #content>
      <SinglePageDetail 
        v-if="selectedPage"
        :page="selectedPage"
      />
      <div 
        v-else
        class="column items-center justify-center full-height q-pa-lg text-grey-7"
      >
        <q-icon name="description" size="48px" />
        <div class="text-h6 q-mt-md">Select a page to view details</div>
      </div>
    </template>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MarketingLayout from '@/src/layout/marketing/Marketing.vue'
import PageList from '@/src/components/demo/campaign/PageList.vue'
import SinglePageDetail from '@/src/components/demo/campaign/SinglePageDetail.vue'

// Import your data sources
import products from '~/src/repository/product'
import audiences from '~/src/repository/audience'

// Filters state
const productFilter = ref<string[]>([])
const audienceFilter = ref<string[]>([])
const selectedPage = ref<any>(null)


// Watch for filter changes
watch([productFilter, audienceFilter], () => {
  // Reset selected page when filters change
  selectedPage.value = null
}, { deep: true })

// Provide selected page to child components if needed
provide('selectedPage', selectedPage)
</script>

<style lang="scss" scoped>
.full-height {
  height: 100%;
  min-height: 400px;
}
</style>