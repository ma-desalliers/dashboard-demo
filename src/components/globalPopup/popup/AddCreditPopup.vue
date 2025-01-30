<template>
  <div class="full-width q-mb-lg" ref="triggerRef" @click="ShowPopup()">
    <slot></slot>
  </div>

  <PopupContainer v-model="showPopup" ref="popupRef" @hide="handleHide" dialog-class="generate-content-popup">
    <div class="credits-dialog q-pa-md" style="width: 500px">
      <!-- Header with back button -->
      <div class="row items-center q-mb-md">
        <q-btn
          flat
          dense
          icon="arrow_back"
          label="Back to order"
          @click="$emit('close')"
          class="text-grey-8"
        />
      </div>

      <!-- Title Section -->
      <div class="text-center q-mb-lg">
        <div class="text-h6 q-mb-sm">Not Enough Credits</div>
        <div class="text-grey-7">You need {{ requiredCredits }} more credits to generate this content</div>
      </div>

      <!-- One-time Purchase Card -->
      <q-card flat bordered class="q-pa-md q-mx- q-mb-md">
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center">
            <q-icon name="description" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1">One-time Purchase</div>
          </div>
          <div>
            <div class="text-h6">${{ oneTimePrice.toFixed(2) }}</div>
            <div class="text-grey-7 text-caption">${{ (oneTimePrice/requiredCredits).toFixed(3) }}/credit</div>
          </div>
        </div>
        <div class="text-grey-7 q-mb-md">Quick purchase of exactly what you need</div>
        <q-btn
          unelevated
          color="grey-4"
          text-color="grey-9"
          class="full-width"
          label="Buy credits"
          @click="buyCredits"
        />
      </q-card>

      <!-- Upgrade Plan Card -->
      <q-card flat bordered class="q-pa-md q-mb-md bg-green-1 c-border-green">
        <q-badge color="green" class="c-position-tag q-ma-sm q-px-md q-py-xs">
          Recommended
        </q-badge>
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center">
            <q-icon name="card_membership" size="sm" class="q-mr-sm" />
            <div class="text-subtitle1">Upgrade to Platinum</div>
          </div>
          <div>
            <div class="text-h6">${{ upgradePrice.toFixed(2) }}</div>
            <div class="text-grey-7 text-caption">
              ${{ (upgradePrice/requiredCredits).toFixed(3) }}/credit
              <span class="text-green">(25% off)</span>
            </div>
          </div>
        </div>
        <div class="text-grey-7">Upgrade from Pro to Platinum plan</div>
        <div class="q-py-md">
          <div class="row items-center q-mb-sm">
            <q-icon name="check" size="xs" class="q-mr-sm text-green" />
            <div>25% off all future credits</div>
          </div>
          <div class="row items-center q-mb-sm">
            <q-icon name="check" size="xs" class="q-mr-sm text-green" />
            <div>200 monthly credits</div>
          </div>
          <div class="row items-center q-mb-sm">
            <q-icon name="check" size="xs" class="q-mr-sm text-green" />
            <div>Priority support & advanced features</div>
          </div>
        </div>
        <q-btn
          unelevated
          color="green"
          class="full-width q-mb-sm"
          label="Upgrade plan"
          @click="upgradePlan"
        />
        <div class="text-center">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="Compare all plans"
            icon-right="open_in_new"
            @click="comparePlans"
          />
        </div>
      </q-card>

      <!-- Footer -->
      <div class="text-center text-grey-7 q-mb-md">
        <div class="row justify-center q-mb-sm">
          <q-icon name="lock" size="xs" class="q-mr-sm" />
          Secure payment
          <q-separator vertical class="q-mx-md" />
          <q-icon name="security" size="xs" class="q-mr-sm" />
          SSL Encrypted
        </div>
        <div>
          Questions about pricing?
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="Contact sales"
            @click="contactSales"
          />
        </div>
      </div>
    </div>
  </PopupContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import PopupContainer from '../PopupContainer.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore'
interface ContentSlider {
  id: string
  label: string
  value: number
  max: number
  tooltip: string
}

// State
const loading = ref(false)
const advancedMode = ref(false)
const showPopup = ref(false)
const triggerRef = ref<HTMLElement>()
const popupRef = ref()


const mainDisplayStore = useMainDisplayStore()


interface Props {
  requiredCredits?: number
}

const props = withDefaults(defineProps<Props>(), {
  requiredCredits: 100
})

const oneTimePrice = ref(10.00)
const upgradePrice = ref(15.00)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'buyCredits'): void
  (e: 'upgradePlan'): void
  (e: 'comparePlans'): void
  (e: 'contactSales'): void
}>()

const buyCredits = () => {
  emit('buyCredits')
}

const upgradePlan = () => {
  emit('upgradePlan')
}

const comparePlans = () => {
  emit('comparePlans')
}

const contactSales = () => {
  emit('contactSales')
}


const handleHide = () => {
  showPopup.value = false
}

const ShowPopup = () => {
  showPopup.value = true
  if (triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '500px',
        maxHeight: '800px'
      })
    })
  } 

  mainDisplayStore.setOverlay('content')
}


</script>

<style >
.content-generator {
  max-width: 600px;
  margin: 0 auto;
}

.content-sliders {
  width: 100%;
}

.rounded-borders {
  border-radius: 8px;
}

.generate-content-popup{
  transform: translateX(25px)
}

.c-position-tag{
  position:absolute;
  right:10px;
  top:-10px;
  border-radius: 20px !important;
  margin:0;
}
</style>
