<template>
  <Teleport to="body">
    <template v-for="(popup, index) in store.popupStack" :key="index">
      <q-dialog
        v-model="popup.isOpen"
        position="standard"
        class="c-global-popup"
        :class="[`popup-level-${index}`]"
        transition-show="fade"
        transition-hide="fade"
        @hide="handlePopupHide"
      >
        <q-card
          flat
          bordered
          class="dynamic-popup"
          :style="getPopupStyle(index)"
          :ref="(el:any) => setCardRef(el, index)"
        >
          <q-card-section :style="{ height: '100%', overflow: 'auto' }">
            <q-inner-loading :showing="false" color="primary">
              <q-spinner-dots size="40px" color="primary" />
            </q-inner-loading>
            <component 
              :is="resolveComponent(popup.view)" 
              :key="popup.view" 
              @mounted="(size:any) => handlePopupSize(size, index)" 
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </template>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import BadgeSelect from '@/src/components/shared/BadgeSelect.vue'


import { QCard } from 'quasar'

const componentMap = {
  BadgeSelect: markRaw(BadgeSelect),
} as const;

const store = useMainDisplayStore()
const cardRefs = ref<Map<number, QCard>>(new Map())
const popupStyles = ref<Map<number, any>>(new Map())

const initializePopupStyle = () => ({
  position: 'absolute',
  top: '0',
  left: '0',
  width: '600px',
  maxHeight: '250px',
  minWidth: '',
  transform: 'none'
})

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardRefs.value.set(index, el)
    if (!popupStyles.value.has(index)) {
      popupStyles.value.set(index, reactive(initializePopupStyle()))
    }
  }
}

const getPopupStyle = (index: number) => {
  const style = popupStyles.value.get(index) || initializePopupStyle()
  style.transform = `translate(${index * 10}px, ${index * 10}px)`
  return style
}

const calculatePosition = (index: number) => {
  const popup = store.popupStack[index]
  const cardRef = cardRefs.value.get(index)
  const style = popupStyles.value.get(index)
  
  if (!popup?.triggerElement || !cardRef || !style) return
  
  const triggerRect = popup.triggerElement
  const popupWidth = parseInt(style.width)
  const actualHeight = cardRef.$el?.offsetHeight || 0
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  
  const rightSpace = viewportWidth - (triggerRect.x + triggerRect.width)
  const topSpace = triggerRect.y
  const bottomSpace = viewportHeight - triggerRect.y
  
  if (rightSpace >= popupWidth) {
    style.left = (triggerRect.x + triggerRect.width) + 'px'
  } else {
    style.left = (triggerRect.x - popupWidth) + 'px'
  }

  if (bottomSpace >= actualHeight) {
    style.top = triggerRect.y + 'px'
  } else if (topSpace >= actualHeight) {
    style.top = (triggerRect.y - actualHeight) + 'px'
  } else {
    style.top = '5px'
    style.maxHeight = `${viewportHeight}px`
  }
}

const handlePopupSize = (size: {width: string, height: string}, index: number) => {
  const style = popupStyles.value.get(index)
  if (!style) return
  
  style.width = size.width
  style.minWidth = size.width
  style.maxHeight = size.height

  nextTick(() => calculatePosition(index))
  setupResize(index)
}

const setupResize = (index: number) => {
  const cardRef = cardRefs.value.get(index)
  if (!cardRef) return

  const resizeObserver = new ResizeObserver(() => {
    nextTick(() => calculatePosition(index))
  })
  
  resizeObserver.observe(cardRef.$el)
  
  onBeforeUnmount(() => {
    resizeObserver.unobserve(cardRef.$el)
  })
}

const handlePopupHide = () => {
  store.popPopup()
}

const resolveComponent = (view: string) => {
  return componentMap[view as keyof typeof componentMap] || null
}

onMounted(() => {
  window.addEventListener('resize', () => {
    store.popupStack.forEach((_, index) => calculatePosition(index))
  })
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', () => {
      store.popupStack.forEach((_, index) => calculatePosition(index))
    })
  })
})
</script>

<style scoped lang="scss">
.dynamic-popup {
  position: fixed;
  z-index: 9999;
  background: white;
  
  .q-card__section {
    padding: 0px !important;
  }
}

.popup-level-0 {
  z-index: 9999;
}

.popup-level-1 {
  z-index: 10000;
}

.popup-level-2 {
  z-index: 10001;
}

:deep(.q-dialog__backdrop) {
  background: transparent !important;
}
</style>