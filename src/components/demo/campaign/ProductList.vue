<template>
  <q-list separator class="content-list">
    <!-- Product Items with Expansion -->
    <q-expansion-item
    v-for="product in filteredProducts" 
    :key="product.uuid"
    class="content-item"
    @click="selectProduct(product)"
    expand-separator
    >
    <template #header>
      <q-item-section v-if="false" side style="width: 40px" class="q-mr-md">
        <img :src="product.image || '' " alt="Product Image" class="c-list-product-picture"/>
      </q-item-section>
      
      <q-item-section class="clickable c-product-item" >
        <div class="content-info">
          <div >
            <span class="text-subtitle2"> {{ product.name }} &nbsp;</span>
          </div>
          <div class="text-caption text-grey-7 text-truncate">
            <span  class="text-primary"  v-if="product.pageCount"><i class="fa-regular fa-file"></i> {{ product.pageCount }} • </span>
            {{ product.subcategory?.name }}
          </div>
        </div>
      </q-item-section>
      
      <SelectedElementIndicator 
        :rounded="false" 
        color="bg-primary" 
        :show="selectedProduct?.uuid === product.uuid"
      />
    </template>
    
    <!-- Expansion Content - PageList -->
    <div class="q-pb-md">
      <PageList
        :product-filter="[product.uuid]"
        :audience-filter="audienceFilter"
        v-model="selectedPage"
        :small-version="true"
        />
     <!-- <q-tabs
        v-model="activeTab"
        class="text-grey row justift-start"
        active-color="primary"
        indicator-color="primary"
        dense
        align="left"
      >
      <q-tab name="content" label="Content" />
      <q-tab name="audience" label="Audience" />
      <q-tab name="knowledge" label="Knowledge" />
    </q-tabs>
    <q-tab-panels v-model="activeTab">
      <q-tab-panel name="content">
  
      </q-tab-panel>
      <q-tab-panel name="audience">
        <PageList
        :hide-header="true"
        :product-filter="[product.uuid]"
        :audience-filter="audienceFilter"
        v-model="selectedPage"
        />
      </q-tab-panel>
      <q-tab-panel name="knowledge">
        <PageList
        :hide-header="true"
        :product-filter="[product.uuid]"
        :audience-filter="audienceFilter"
        v-model="selectedPage"
        />
      </q-tab-panel>
    </q-tab-panels>-->
    </div>
  </q-expansion-item>
</q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import PageList from './PageList.vue'
import products from '~/src/repository/product'
interface Product {
  uuid: string
  clientUuid: string
  name: string
  description: string | null
  image: string | null
  score: number
  ctaName: string | null
  ctaLink: string | null
  benefits: any | null
  createdAt: number
}

const props = defineProps<{
  modelValue?: any,
  filter?: string[]
  audienceFilter: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const selectedPage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedProduct = ref<any>(null)

const activeTab= ref('content')

const filteredProducts = computed(() => {
  if (!props.filter || !props.filter.length) return products
  
  return products.filter(product => props.filter?.includes(product.uuid))
})

const selectProduct = (product: any) => {
  selectedProduct.value = product
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style lang="scss">
.content-list {
  border:none;
}

.header-row {
  background-color: var(--main-gray);
  min-height: 40px;
}

.content-item {
  min-height: 60px;
}

.content-info {
  overflow: hidden;
}

.clickable {
  cursor: pointer;
}


.c-list-product-picture{
  height:40px;
  width:40px;
  object-fit: cover;
  border-radius: 4px;
}

.q-expansion-item--expanded .q-item:has(.c-product-item) {
  //box-shadow: 0px 9px 5px -8px #8c8c8c;
  position: sticky;
  top:0;
  z-index: 12;
  background-color: white;
}

</style>