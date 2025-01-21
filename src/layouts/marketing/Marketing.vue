<template>
  <div class="row full-width">
    <div class="c-content-marketing row col-12" :class="{ isMobile: isMobile }">
      <div class="row full-width col-12 no-wrap">
        <!-- List Container -->
        <div
          :class="{ 'hide-list': !listVisible, 'col-12': isMobile, 'col-3': !isMobile }"
          class="pages-container c-border-right q-pt-md"
          style="flex: 1"
        >
          <div
            class="hidden-item-clickable clickable q-pt-lg row justify-center"
            @click="showList"
          >
            <i v-if="!listVisible" class="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
          <div class="page-scroll">
            <div class="row justify-between q-mb-sm q-px-md">
              <div>
                <slot name="list-header"></slot>
              </div>
              <div v-if="!isMobile">
                <q-icon
                  style="transform: rotate(180deg)"
                  class="clickable"
                  @click="hideList"
                >
                  <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </q-icon>
              </div>
            </div>
            
            <!-- List Content -->
            <slot name="list"></slot>
          </div>
        </div>

        <!-- Main Content -->
        <div :class="{ 'c-content-container': !isMobile }">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'

const mainDisplayStore = useMainDisplayStore()
const isMobile = computed(() => mainDisplayStore.isMobile)
const listVisible = ref(true)

const hideList = () => {
  listVisible.value = false
}

const showList = () => {
  listVisible.value = true
}
</script>

<style lang="scss" scoped>
.c-content-marketing {
  min-height: calc(100% - 50px);
  height: calc(100% - 50px);

  &.isMobile {
    height: calc(100% - 50px);
  }
}

.pages-container {
  height: calc(100% - 30px);
  min-height: calc(100% - 30px);
  position: relative;
  transition: 0.25s;
  
  .page-scroll {
    position: absolute;
    top: 8px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
  }

  &.hide-list {
    width: 20px !important;
    min-width: 20px !important;
    flex-grow: 0 !important;
    
    .page-scroll {
      z-index: 1;
    }

    .hidden-item-clickable {
      position: absolute;
      inset: 0;
      z-index: 10;
      background-color: #ffffff;
      transition: 0.25s;
      &:hover {
        background-color: #f4f4f4;
      }
    }
  }
}

.c-content-container {
  min-width: 75%;
  flex: 1;
}
</style>