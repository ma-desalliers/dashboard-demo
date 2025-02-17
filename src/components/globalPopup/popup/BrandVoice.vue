<template>
  <div class="" ref="triggerRef" @click="showPopup()">
    <slot></slot>
  </div>

  <PopupContainer v-model="isVisible" ref="popupRef" @hide="handleHide" dialog-class="generate-content-popup"  :position="{ top: '50px' }">
  <q-card flat bordered class="bg-white">
    <q-card-section class="q-pb-sm">
      <div class="row items-center q-gutter-sm">
        <q-icon name="settings" size="sm" class="text-grey-7" />
        <div class="text-h6">Content Personalization</div>
      </div>
      <div class="text-caption text-grey-7 q-mt-sm">
        Customize how your content attributes are displayed and managed across your experience
      </div>
    </q-card-section>

    <q-card-section class="q-gutter-y-md">
      <q-card
        v-for="attribute in attributes"
        :key="attribute.name"
        flat
        bordered
        class="bg-grey-1"
      >
        <q-card-section>
          <div class="row items-start q-gutter-md q-mb-md">
            <q-checkbox class="col-auto"
              v-model="settings[attribute.name].enabled"
              @update:model-value="setPopupRect"
              dense
            />
            <div class="col">
              <div class="text-subtitle2">{{ attribute.label }}</div>
              <div class="text-caption text-grey-7">{{ attribute.description }}</div>
            </div>
          </div>

          <template v-if="settings[attribute.name].enabled">
            <div class="q-gutter-y-lg q-ml-xl">
              <!-- Frequency Control -->
              <div>
                <div class="row items-center q-gutter-x-lg q-mb-sm">
                  <div class="text-caption text-grey-8" style="width: 80px">Frequency</div>
                  <c-slider
                    v-model="settings[attribute.name].frequency"
                    :min="0"
                    :max="100"
                    :step="1"
                    class="col"
                  />
                </div>
                <div class="q-ml-xl">
                  <div class="text-body2">
                    {{ settings[attribute.name].frequency }} - {{ getFrequencyLabel(settings[attribute.name].frequency) }}
                  </div>
                  <div class="text-caption text-grey-7 italic">
                    {{ getFrequencyDescription(settings[attribute.name].frequency, attribute.label) }}
                  </div>
                </div>
              </div>

              <!-- Explicitness Control -->
              <div>
                <div class="row items-center q-gutter-x-lg q-mb-sm">
                  <div class="text-caption text-grey-8" style="width: 80px">Explicitness</div>
                  <c-slider
                    v-model="settings[attribute.name].explicitness"
                    :min="1"
                    :max="10"
                    :step="1"
                    class="col"
                  />
                </div>
                <div class="q-ml-xl">
                  <div class="text-body2">
                    {{ settings[attribute.name].explicitness }} - {{ getExplicitnessLabel(settings[attribute.name].explicitness) }}
                  </div>
                  <div class="text-caption text-grey-7 italic">
                    {{ getExplicitnessDescription(settings[attribute.name].explicitness) }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</PopupContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PopupContainer from '../PopupContainer.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore'
interface Settings {
  enabled: boolean
  frequency: number
  explicitness: number
}

interface SettingsState {
  [key: string]: Settings
}

const loading = ref(false)
const advancedMode = ref(false)
const isVisible = ref(false)
const triggerRef = ref<HTMLElement>()
const popupRef = ref()


const mainDisplayStore = useMainDisplayStore()


const settings = ref<SettingsState>({
  desiredOutcome: {
    enabled: true,
    frequency: 50,
    explicitness: 5
  },
  nickname: {
    enabled: false,
    frequency: 30,
    explicitness: 5
  },
  painPoints: {
    enabled: false,
    frequency: 40,
    explicitness: 5
  }
})

const attributes = [
  {
    name: 'desiredOutcome',
    label: 'Desired Outcome',
    description: 'Define the goals and objectives you want to achieve with your content'
  },
  {
    name: 'nickname',
    label: 'Nickname',
    description: 'Customize how personal identifiers appear in your content'
  },
  {
    name: 'painPoints',
    label: 'Pain Points',
    description: 'Manage the visibility of challenges and issues in your content'
  }
]



const getExplicitnessLabel = (value: number): string => {
  const labels: { [key: number]: string } = {
    10: 'Overt',
    9: 'Strongly Explicit',
    8: 'Explicit',
    7: 'Moderately Explicit',
    6: 'Somewhat Explicit',
    5: 'Neutral',
    4: 'Somewhat Implicit',
    3: 'Implicit',
    2: 'Strongly Implicit',
    1: 'Highly Subtle'
  }
  return labels[value]
}

const getExplicitnessDescription = (value: number): string => {
  const descriptions: { [key: number]: string } = {
    10: 'Information will be stated explicitly, directly, and unambiguously with no room for interpretation',
    9: 'Message will be very clear with direct wording, allowing for minor nuances',
    8: 'Information will be clearly stated but might require slight contextual understanding',
    7: 'Key message will be mostly clear but may contain indirect phrasing',
    6: 'Information will be present but requires some interpretation',
    5: 'Content will balance explicit and implicit meaning equally',
    4: 'Key ideas will be hinted at but not directly stated',
    3: 'Message will be suggested rather than stated, using indirect language',
    2: 'Meaning will be embedded in subtext, requiring significant interpretation',
    1: 'Information will be mostly unstated, requiring deep inference to understand'
  }
  return descriptions[value]
}

const getFrequencyLabel = (value: number): string => {
  if (value < 30) return 'Low'
  if (value < 60) return 'Medium'
  return 'High'
}

const getFrequencyDescription = (value: number, attribute: string): string => {
  if (value < 30) {
    return `${attribute} will be shown occasionally, focusing only on essential updates`
  }
  if (value < 60) {
    return `${attribute} will be shown regularly, providing a balanced view of updates`
  }
  return `${attribute} will be shown frequently, ensuring comprehensive coverage`
}

const handleHide = () => {
  isVisible.value = false
}

const showPopup = () => {
  isVisible.value = true
 setPopupRect()

  //mainDisplayStore.setOverlay('content')
}

const setPopupRect = () =>{
  if (triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '500px',
        maxHeight: '800px'
      })
    })
  } 
}

</script>

<style scoped>
.q-slider {
  min-width: 200px;
}
</style>