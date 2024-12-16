<template>
  <q-list separator class="content-list">
    <!-- audience Items with Expansion -->
    <q-expansion-item
    v-for="audience in filteredAudiences" 
    :key="audience.uuid"
    class="content-item"
    @click="selectAudience(audience)"
    expand-separator
    >
    <template #header>
    
      
      <q-item-section class="clickable c-audience-item" >
        <div class="content-info">
          <div >
            <span class="text-subtitle2"> {{ audience.title }} &nbsp;</span>
            <span class="text-grey"> {{ audience.pageCount }} <i class="fa-regular fa-file"></i></span>
          </div>
          <div class="text-caption text-grey-7 text-truncate">
            {{ audience.subIndustryName || audience.description }}
          </div>
        </div>
      </q-item-section>
      
      <SelectedElementIndicator 
        :rounded="false" 
        color="bg-primary" 
        :show="selectedAudience?.uuid === audience.uuid"
      />
    </template>
    
    <!-- Expansion Content - PageList -->
    <div class="q-pb-md">
      <PageList
        :product-filter="productFilter"
        :audience-filter="[audience.uuid]"
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
        :audience-filter="[audience.uuid]"
        :audience-filter="audienceFilter"
        v-model="selectedPage"
        />
      </q-tab-panel>
      <q-tab-panel name="knowledge">
        <PageList
        :hide-header="true"
        :audience-filter="[audience.uuid]"
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
import Audiences from '@/src/repository/audience'
interface audience {
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
  productFilter: string[]
}>()

const emit = defineEmits(['update:modelValue'])

const selectedPage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectedAudience = ref<any>(null)

const activeTab= ref('content')

const filteredAudiences = computed(() => {
  if (!props.filter || !props.filter.length) return Audiences
  
  return Audiences.filter(audience => props.filter?.includes(audience.uuid))
})

const selectAudience = (audience: any) => {
  selectedAudience.value = audience
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


.c-list-audience-picture{
  height:40px;
  width:40px;
  object-fit: cover;
  border-radius: 4px;
}

.q-expansion-item--expanded .q-item:has(.c-audience-item) {
  //box-shadow: 0px 9px 5px -8px #8c8c8c;
  position: sticky;
  top:0;
  z-index: 12;
  background-color: white;
}

</style>