<template>
  <div class="q-pa-md">
    <!-- Header Section -->
    <div class="row justify-end items-center q-mb-md">
      <div class="row q-col-gutter-md">
        <div>
          <DropdownBtn
            v-if="theMarket.uuid"
            :icon="'fa-regular fa-lightbulb'"
            :title="'Generate Ideas'"
            :description="'Confirm generate ideas'"
            :onConfirm="generateIdeas"
          >
          <template #inputs="{ formData, 'onUpdate:formData': updateFormData }">
            <LanguageSelect 
              v-model="lang"
              @update:model-value="(val) => updateFormData({ language: val })"
            />
          </template>
        </DropdownBtn>
        </div>
        <div>
          <q-btn
            v-if="!theMarket.uuid"
            color="primary"
            icon="save"
            label="Save"
            @click="handleSave"
          />
        </div>
      </div>
    </div>
    <div v-if="theMarket.uuid" class="row items-center q-mb-md">
      <!--<LanguageSelect :language="lang"></LanguageSelect>
      <div>
        <q-btn @click="generateIdeas()"><q-item-label>Generate ideas</q-item-label></q-btn>
      </div>-->
    </div>
    <div v-if="!theMarket.uuid">
      <!-- Selected Item Card -->
      <q-card flat bordered  class="q-mb-md">
        <q-card-section>
          <div class="text-h6"></div>
          <div class="row q-col-gutter-md">
            <div class="q-mt-md col-6">
              <div class="c-box-title">Selected Product :</div>
              <div class="q-py-md">
                <div><strong>Title :</strong> {{ theMarket.product?.name }}</div>
                <div class="c-limit-text-height"><strong>Description :</strong> {{ theMarket.product?.description }}</div>
              </div>
            </div>
            <div class="q-mt-md col-6">
              <div class="c-box-title">Selected Persona :</div>
              <div class="q-py-md">
                <div><strong>Title :</strong> {{ theMarket.persona?.title }}</div>
                <div class="c-limit-text-height"><strong>Description :</strong> {{ theMarket.persona?.description }}</div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Dual Lists Container -->
      <div class="row q-col-gutter-md" v-if="!theMarket.uuid">
        <!-- Left List 
        <div class="col-6">
          <q-list separator >
            <q-item class="header-row">
              <q-item-section>
                <div class="text-subtitle1 text-weight-medium">Product list</div>
              </q-item-section>
            </q-item>
            
            <q-item v-if="theClient?.uuid"
              v-for="item in theClient.products"
              :key="item.uuid"
              clickable
              :active="theMarket.productUuid == item.uuid"
              active-class="bg-primary text-white"
              @click="selectProduct(item)">
              <q-item-section>
                {{ item.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>-->

        <!-- Right List -->
        <div class="">
          <q-list separator >
            <q-item class="header-row">
              <q-item-section>
                <div class="text-subtitle1 text-weight-medium">Persona list</div>
              </q-item-section>
            </q-item>
            
            <q-item
              v-for="item in theClient?.personas"
              :key="item.uuid"
              clickable
              :active="theMarket.personaUuid == item.uuid"
              active-class="bg-primary text-white"
              @click="selectPersona(item)"
            >
              <q-item-section>
                {{ item.title }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <div class="v-else">
      <div class="row q-col-gutter-md">
        <div class="col-6 q-pl-none" hidden>
          <q-card bordered flat >
            <q-card-section>
              <div class="row justify-between q-pb-md">
                <div class="c-box-title">Recurrency</div>
                <div class="row q-col-gutter-sm ">
                  <div>
                    <q-btn v-if="!isAddingRecurrency" size="sm" round color="positive"  @click="addRecurrency" >
                      <i class="fa fa-plus"></i>
                    </q-btn>  
                  </div>
                </div>
              </div>
              <div v-if="isAddingRecurrency" class="c-recurrrency-form" :class="{'c-adding-recurrency':isAddingRecurrency}">
                <q-form @submit="createRecurrency" class="q-gutter-md">
                  <q-input outlined v-model="formData.title" label="title"></q-input>
                  <q-input
                    v-model="formData.startDate"
                    type="date"
                    label="Start Date"
                    outlined
                  />

                  <q-input
                    v-model.number="formData.numberOfPages"
                    type="number"
                    label="Number of Pages"
                    outlined
                  />

                  <q-select
                    v-model="formData.timelapse"
                    :options="['daily', 'weekly', 'monthly']"
                    label="Timelapse"
                    outlined
                  />

                  <q-toggle
                    v-model="formData.freeTrial"
                    label="Free Trial"
                  />
                  <q-btn round size="sm" color="positive" type="submit"> <i class="fa fa-save"></i></q-btn>
                </q-form>
              </div>
              <q-list class="q-pl-none">
                <q-item class="q-pl-none" v-for="(item, index) in recurrencyList" :key="index">
                  <q-item-section>
                    <q-item-label>Start Date: {{ item.startDate }}</q-item-label>
                    <q-item-label caption>
                      Pages: {{ item.pages }} | Interval: {{ item.interval }} days
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
        <div class="row col-12 q-col-gutter-md">
        </div>
      </div>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Market } from '~/src/repository/market/Market';
import type { Persona } from '~/src/repository/persona/Persona';
import type { Product } from '~/src/repository/product/Product';
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';


const emit = defineEmits(['mounted'])

interface ListItem {
  id: number
  title: string
  type: string
  date: string
  description?: string
}

// State
const isFreeTrial = ref(false)
const lang = ref('en')

const formData = ref({
  title:'',
  startDate: '',
  numberOfPages: 5,
  timelapse: 'daily',
  freeTrial: false
})

const isAddingRecurrency = ref(false) 

const        recurrencyList= [
          { startDate: '2024-03-20', pages: 50, interval: 7 },
          { startDate: '2024-03-25', pages: 30, interval: 5 },
          { startDate: '2024-04-01', pages: 25, interval: 3 }
        ]

const mainDisplayStore = useMainDisplayStore()
const {popup} = storeToRefs(mainDisplayStore)

const theMarket =  computed(()=>{
  return mainDisplayStore.popup.item as Market
})

const theClient = computed(()=>{
  return mainDisplayStore.popup.client
})


// Methods
const selectProduct = (item: Product) => {
  theMarket.value.productUuid = item.uuid;
  theMarket.value.product = item;
}

const selectPersona = (item: Persona) => {
  theMarket.value.personaUuid = item.uuid;
  theMarket.value.persona = item;
}

const addRecurrency = ()=>{
 isAddingRecurrency.value = true
}

const createRecurrency  = () =>{
  isAddingRecurrency.value = false
}

const generateIdeas = async (params:any) =>{

  console.log(params)
  await theMarket.value.generateIdeas(params.language)

}

const handleSave = () => {
  if(theMarket.value.uuid){
    //theMarket.value.update()
  }
  else{
    theMarket.value.create()
    theClient.value?.addmarkets(theMarket.value)
  }

  mainDisplayStore.updatePopupDisplay({isOpen:false})
}

onMounted(()=>{
  emit('mounted', {width:'1000px', height:'550px'})
})
</script>

<style scoped>


.c-limit-text-height{
  height: 63px;
}
</style>