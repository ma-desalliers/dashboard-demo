<template>
  <div class="c-base-layout" :class="{'isMobile': isMobile}">
    <Header class="c-header-container" v-if="!showContent" @state="(currentState : boolean) => headerState = currentState" />
    
    <div class="c-main-content" :class="{'header-openned' : headerState}">
      <div class="row no-wrap">
        <LeftColumn v-if="!isCalculatorRoute" class="c-left-column" :class="{'isOpen': showMenu}" />
        <div class="c-right-column" :class="{ 'full-width': isCalculatorRoute }">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Header from './Header.vue'
import LeftColumn from './LeftColumn.vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'

const route = useRoute()
const mainDisplayStore = useMainDisplayStore()

const isMobile = computed(() => mainDisplayStore.isMobile)
const showMenu = computed(() => mainDisplayStore.showMenu)
const showContent = computed(() => mainDisplayStore.showContent)
const headerState = ref(true)

const isCalculatorRoute = computed(() => route.path.endsWith('/calculator') || route.path.endsWith('/calculator/')  )
</script>

<style lang="scss">
.c-header-container {
  flex: none;
  z-index: 2;
}

.c-main-content {
  flex: 1;
  overflow: hidden;

  &.header-openned {
    .c-left-column { top: 50px; }
    .c-right-column { top: 50px; }
  }
}

.c-left-column {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  background-color: white;
  z-index: 1;
}

.c-right-column {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 300px;
  right: 0;
  height: 100%;

  &.full-width {
    left: 0;
  }
}

.c-left-column,
.c-right-column {
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .c-left-column {
    width: 250px;
  }
}

.c-base-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;

  &.isMobile {
    .c-left-column {
      top: 0px;
      bottom: 0;
      left: -100%;
      width: 100vw;
      z-index: 10;
      &.isOpen { left: 0; }
    }

    .c-right-column {
      position: fixed;
      top: 70px;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100%;
      overflow-y: auto;
    }

    .right-column-container {
      height: 100%;
    }
  }
}
</style>