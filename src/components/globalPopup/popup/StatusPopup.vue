<template>
  <div class="status-trigger" ref="triggerRef">
    <div class="row d-flex align-items-center">
      <q-chip
        square
        :color="color || ''"
        text-color="black"
        class="cursor-pointer"
        @click="showPopup = true"
        clickable
      >
        {{ currentItem?.[optionLabel] || $t('none') }}
      </q-chip>
      <div class="next-status cursor-pointer row items-center" @click="handleQuickNext">
        <q-icon name="o_play_arrow"/>
      </div>
      <!--<q-btn
        v-if="quickNext"
        flat
        round
        dense
        color="primary"
        
        class="q-ml-sm"
      >
        <q-icon name="play_arrow" />
      </q-btn>-->
    </div>
  </div>

  <PopupContainer
    v-model="showPopup"
    ref="popupRef"
    @hide="handleHide"
  >
    <div class="badge-selector q-pa-md">
      <div class="text-subtitle1 q-mb-sm">Select Status</div>
      <div class="column q-col-gutter-sm">
        <div 
          v-for="badge in options" 
          :key="badge.value"
        >
          <div>
            <q-chip
              square
              :color="color || 'grey'"
              :label="badge.label"
              text-color="white"
              class="option-badge full-width row justify-center text-center"
              clickable
              @click="selectBadge(badge.value)"
            />
          </div>
        </div>
      </div>
    </div>
  </PopupContainer>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import PopupContainer from '../PopupContainer.vue'

const props = withDefaults(defineProps<{
  currentItem?: any 
  optionValue?: string
  optionLabel?: string
  color?: string
  options: {value: string; label: string}[]
  quickNext?: boolean
}>(), {
  currentItem: {},
  optionValue: 'uuid',
  optionLabel: 'name',
  quickNext: true
})

const emit = defineEmits<{
  (e: 'updateValue', value: string): void
}>()

const { t } = useI18n()

const triggerRef = ref<HTMLElement>()
const popupRef = ref()
const showPopup = ref(false)

const currentIndex = computed(() => {
  const currentValue = props.currentItem?.[props.optionValue]
  return props.options.findIndex(option => option.value === currentValue)
})

const handleQuickNext = () => {
  const nextIndex = (currentIndex.value + 1) % props.options.length
  const nextStatus = props.options[nextIndex].value
  emit('updateValue', nextStatus)
}

const getStatusLabel = (status: string | undefined) => {
  if(!status) return t('not-found')

  const currentOption = props.options.find(option => option.value == status)

  if(currentOption) return currentOption.label
  return t('not-found')
}

const selectBadge = (value: string) => {
  emit('updateValue', value)
  showPopup.value = false
}

const handleHide = () => {
  showPopup.value = false
}

watch(showPopup, (isOpen) => {
  if (isOpen && triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '300px',
        maxHeight: '500px'
      })
    })
  }
})

onMounted(() => {
})
</script>

<style scoped lang="scss">
.option-badge {
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  * {
    justify-content: center
  }
}

.q-chip {
  border-radius: 4px 0 0 4px;
  margin-right: 2px;
  margin-left:0px;
}

.status-trigger {
  display: inline-block;
}

.badge-selector {
  min-width: 300px;
}

.badge-btn {
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &.selected {
    border-color: var(--q-primary);
    background: #f0f7ff;
  }
}

.next-status{
  background-color: #e0e0e0;
  width:30px;
  height:28px;
  margin-top:4px;
  padding-left:1px;
  text-align: left;
  
  clip-path: polygon(0 0, 0 100%, 80% 100%, 100% 50%, 80% 0);
  &:hover{
    background:  #cecece;
  }
}

.q-icon{
  font-size:22px;
  
}
</style>