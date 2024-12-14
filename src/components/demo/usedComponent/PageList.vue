<template>
              <q-list separator >
            <!-- Headers -->
            <q-item v-if="!hideHeader" class="header-row text-grey-7 c-sticky" >
              <q-item-section side style="width: 48px">
                <div class="text-caption">RS</div>
              </q-item-section>
              <q-item-section>
                <div class="text-caption c-text-truncate">Title</div>
              </q-item-section>
              <q-item-section side style="width: 200px; text-align: center">
                <div class="text-caption">Visitors</div>
              </q-item-section>
              <q-item-section side style="width: 200px; text-align: center; align-items: center">
                <div class="text-caption">Leads</div>
              </q-item-section>
            </q-item>
            
            <!-- Content Items -->
            <q-item v-for="page in filteredPages" :key="page.uuid" class="c-list-row clickable q-pa-md" :class="{'c-bg-primary-lighten':page.uuid == selectedPage.uuid}">
              <q-item-section side style="width: 48px"  @click="selectPage(page)">
               <ScoreDisplay :score="page.score" size="24px" />
              </q-item-section>
              
              <q-item-section class="clickable"  @click="selectPage(page)"  >

                  <div class="content-info">
                    <div class="text-subtitle2 c-text-truncate">{{ page.title }}</div>
                    <!--<div class="text-caption text-grey-7">
                      Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
                    </div>-->
                  </div>

              </q-item-section>
              
              <q-item-section side style="width: 200px; text-align: center"  @click="selectPage(page)">
                <div class="text-subtitle2">{{ '15,000' }}</div>
              </q-item-section>
              
              <q-item-section side style="width: 200px; text-align: center; align-items: center"  @click="selectPage(page)">
                <div class="text-subtitle2 text-grey-7">{{ '25' }}</div>
              </q-item-section>
              <SelectedElementIndicator :rounded="false" color="bg-primary" :show="selectedPage.uuid == page.uuid"></SelectedElementIndicator>
            </q-item>
          </q-list>
    
</template>
<script lang="ts" setup>

import pages from '~/src/repository/pages';

const props = defineProps<{
    modelValue?:any,
    productFilter:Array<any>,
    audienceFilter:Array<any>,
    hideHeader?:Boolean
}>()

const emit = defineEmits(['update:modelValue'])
const selectedPage = computed({get:()=>{ return props.modelValue }, set:(value)=>{ emit('update:modelValue', value)}})

const filteredPages = computed(() =>{

return pages.filter(page =>{
   if(props.productFilter.length){

     if(props.audienceFilter.length){
       return props.productFilter.includes(page.productUuid) && props.audienceFilter.includes(page.personaUuid)
     }
     return props.productFilter.includes(page.productUuid)
   }
   return true
})
})


const selectPage = (page : any)=>{
    selectedPage.value = page
}

</script>  