<template>
  <q-card class="" style="max-width: 500px">
    
      <div class="q-pl-md c-box-title">Campaign recurrence</div>
    

    <q-card-section>
      <q-form @submit="saveRecurrency">
        <div class="row q-col-gutter-x-md">
          <!-- Range Type Selection -->
          <q-select
          dense
            v-model="theRecurrence.recurrenceFrequency"
            :options="rangeOptions"
            @update:model-value="calculateTotal"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Select Range Type"
            class="col-6"
            outlined
            :rules="[val => !!val || 'Range type is required']"
          />

          <!-- Number per Range -->
          <q-input
          dense
            v-model.number="theRecurrence.quantity"
            @update:model-value="calculateTotal"
            type="number"
            :label="`Number per ${theRecurrence.recurrenceFrequency}`"
            outlined
            class="col-6"
            :rules="[
              val => !!val || 'Number is required',
              val => val > 0 || 'Number must be greater than 0'
            ]"
          />

          <!-- Start Date -->
          <q-input
            dense
            v-model="startDate"
            label="Start Date"
            outlined
            class="col-6"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date 
                    v-model="startDate"
                    mask="YYYY-MM-DD"
                    @update:model-value="updateStartDate"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            dense
            v-model.number="durationMonths"
            type="number"
            label="Duration (months)"
            outlined
            class="col-6"
            @update:model-value="updateEndDate"
            :rules="[val => val > 0 || 'Duration must be greater than 0']"
          />
          <div class="col-12 q-pb-md">
            <q-select
              outlined
              dense
              v-model="theRecurrence.type"
              :options="typeOptions"
              option-label="label"
              emit-value
              map-options
              label="Type"
            ></q-select>
          </div>
          <p class="text-weight-bold col-6">Total: {{ total }}</p>
          <p class="text-weight-bold col-6">End Date: {{ formattedEndDate }}</p>
          <div class="col-12 row justify-end" v-if="!props.isStandAlone">
            <q-btn flat label="cancel" @click="closeRecursion" class="q-mr-md" color="white" text-color="#999999" />
            <q-btn label="start" type="submit" color="primary" />
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { MarketRecurrence } from '~/src/repository/marketRecurrence/MarketRecurrence'
import dateHandler from '~/src/asset/composable/date'

const emit = defineEmits(['mounted','update:modelValue'])
const mainDisplayStore = useMainDisplayStore()

const props = defineProps({
  modelValue: MarketRecurrence,
  isStandAlone:{
    type:Boolean,
    default:false
  }
})

const startDate = ref(dateHandler.formatYearMonthDay( new Date()))
const durationMonths = ref(12)
const theRecurrence = computed({

  get:()=>{

  if(!props.isStandAlone){
  const item = mainDisplayStore.popup.item as MarketRecurrence
    if (!item) {
      return new MarketRecurrence(null)
    }
    // Ensure default values are set
    if (!item.recurrenceFrequency) {
      item.recurrenceFrequency = 'daily'
    }
    if (!item.quantity) {
      item.quantity = 1
    }
    if(!item.startDate){
      item.startDate = new Date().getTime()
    }
    
    return item
  }
  else{
    return props.modelValue || new MarketRecurrence(null)
  }
},
set:(value)=>{
  emit('update:modelValue', value)
}
})

const formattedEndDate = computed(() => {
  if (!theRecurrence.value.endDate) return ''
  return date.formatDate(theRecurrence.value.endDate, 'YYYY-MM-DD')
})


const total = ref<number| undefined>(0)

// Constants
const rangeOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]

const typeOptions = [
  {
    label:'Free trial' , value : 'free-trial'
  },
  {
    label:'Smart Campaign' , value : 'smart-campaign'
  }
]

const calculateTotal = () => {
  total.value = theRecurrence.value.calculateTotalArticle()
  console.log(theRecurrence.value.startDate, theRecurrence.value.endDate)
  emit('update:modelValue', theRecurrence.value)
}


const updateStartDate = (newDate: string) => {
  const timestamp = date.extractDate(newDate, 'YYYY-MM-DD').getTime()
  theRecurrence.value.startDate = timestamp
  updateEndDate()
}

const updateEndDate = () => {
  if (!theRecurrence.value.startDate) return
  
  const endTimestamp = date.addToDate(new Date(theRecurrence.value.startDate), { 
    months: durationMonths.value 
  }).getTime()
  
  theRecurrence.value.endDate = endTimestamp
  calculateTotal()
}

const saveRecurrency = () => {
  if (theRecurrence.value.create) {
    theRecurrence.value.create()
  }
  closeRecursion()
}

const closeRecursion = () => {
  mainDisplayStore.updatePopupDisplay({ isOpen: false })
}

onMounted(() => {
  emit('mounted', { width: '500px', height: '400px' })
  updateEndDate ()
})
</script>