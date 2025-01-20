<template>
              <q-list separator >
            <!-- Headers -->
            <q-item v-if="!hideHeader" class="header-row text-grey-7 c-sticky" >
              <q-item-section side style="width: 48px"v-if="!smallVersion" >
                <div class="text-caption">RS</div>
              </q-item-section>
              <q-item-section>
                <div class="text-caption c-text-truncate">Title
                  <i class="fa fa-sort clickable-icon" 
                    :class="{
                      'fa-sort-up': sortDirection === 'asc',
                      'fa-sort-down': sortDirection === 'desc',
                      'fa-sort': sortDirection === null
                    }"
                    @click="orderByTitle()"></i>
                </div>
              </q-item-section>
              <q-item-section side style="width: 200px; text-align: center" v-if="!smallVersion">
                <div class="text-caption">Visitors
                  <q-chip squared class="c-indicator-chip bg-orange-1 c-border-orange" text-color="orange" size="sm">
                    <i class="fa fa-arrow-up"></i>
                    <span style="font-size:14px"> 1 </span>
                  </q-chip>
                </div>
                
              </q-item-section>
              <q-item-section side style="width: 200px; text-align: center; align-items: center" v-if="!smallVersion">
                <div class="text-caption">Leads</div>
              </q-item-section>
            </q-item>
            
            <!-- Content Items -->
            <q-item v-for="page in filteredPages"@click="selectPage(page)" clickable :key="page.uuid" class="c-list-row clickable q-pa-md" :class="{'c-bg-primary-lighten':page.uuid == selectedPage?.uuid, 'bg-grey-2':page.hasContent != true}">
              <q-item-section side style="width: 48px"  v-if="!smallVersion">
                <ScoreDisplay :score="page.score" size="24px" />
              </q-item-section>
              
              <q-item-section class="clickable"    >

                  <div class="content-info row q-col-gutter-sm">
                    <span class="text-primary">
                      <i class="fa-regular fa-file"></i>
                    </span>
                    <span class="text-subtitle2 c-text-truncate" style="font-weight: 400;">{{ page.title }}</span>
                    <!--<div class="text-caption text-grey-7">
                      Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
                    </div>-->
                  </div>

              </q-item-section>
              
              <q-item-section side style="width: 200px; text-align: center"  v-if="!smallVersion">
                <div class="text-subtitle2">{{ '15,000' }}</div>
              </q-item-section>
              
              <q-item-section side style="width: 200px; text-align: center; align-items: center"   v-if="!smallVersion">
                <div class="text-subtitle2 text-grey-7">{{ '25' }}</div>
              </q-item-section>
              <SelectedElementIndicator :rounded="false" color="bg-primary" :show="selectedPage?.uuid == page?.uuid"></SelectedElementIndicator>
            </q-item>
          </q-list>
    
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import pages from '@/src/repository/pages'

import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
const props = defineProps<{
    modelValue?: any,
    productFilter: Array<any>,
    audienceFilter: Array<any>,
    hideHeader?: Boolean,
    smallVersion?:Boolean
}>()

const emit = defineEmits(['update:modelValue'])

const mainDisplayStore = useMainDisplayStore()
const isMobile = computed( ()=> mainDisplayStore.isMobile)

// Add sort state
const sortDirection = ref<'asc' | 'desc' | null>(null)

const selectedPage = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const filteredPages = computed(() => {
  // First apply filters
  let filtered = pages.filter(page => {
    if (props.productFilter.length) {
      if (props.audienceFilter.length) {
        return props.productFilter.includes(page.productUuid) && 
          props.audienceFilter.includes(page.personaUuid)
      }
      return props.productFilter.includes(page.productUuid)
    }

    if (props.audienceFilter.length) {
      return props.audienceFilter.includes(page.personaUuid)
    }

    return true
  })

  // Sort by hasContent first
  filtered = [...filtered].sort((a, b) => {
    // Push pages with hasContent true to the top
    if (a.hasContent && !b.hasContent) return -1
    if (!a.hasContent && b.hasContent) return 1
    
    // If hasContent is the same for both pages, apply title sorting if direction is set
    if (sortDirection.value) {
      const titleA = (a.title || '').toLowerCase()
      const titleB = (b.title || '').toLowerCase()
      
      return sortDirection.value === 'asc' 
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA)
    }
    
    return 0
  })

  return filtered
})

const selectPage = (page: any) => {
    selectedPage.value = page

    if(isMobile.value){
      mainDisplayStore.setShowContent(true)
    }
}

const orderByTitle = () => {
    // Cycle through sort states: null -> asc -> desc -> null
    if (sortDirection.value === null) {
        sortDirection.value = 'asc'
    } else if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc'
    } else {
        sortDirection.value = null
    }
}
</script>

<style scoped>
.clickable-icon {
    cursor: pointer;
    margin-left: 4px;
    transition: color 0.3s ease;
}

.clickable-icon:hover {
    color: var(--q-primary);
}

.fa-sort-up, .fa-sort-down {
    color: var(--q-primary);
}

.c-indicator-chip{
  margin-top:-0px;
}
</style>
