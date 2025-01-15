<template>
  <q-list separator class="content-list">
    <!-- Landing Page Items with Expansion -->
    <q-expansion-item
      v-for="page in landingPages"
      :key="page.title"
      class="content-item"
      expand-separator
      expand-icon-class="c-display-none"
    >
      <template #header>
        <q-item-section class="clickable c-landing-item" @click="selectPage(page, $event)">
          <div class="content-info">
            <div>
              <span class="text-subtitle2 c-text-truncate"> {{ page.title }} &nbsp;</span>
            </div>
            <div class="text-caption text-grey-7 text-truncate">
              <span class="text-primary"><i class="fa-regular fa-file"></i> Landing Page</span>
            </div>
          </div>
        </q-item-section>
        
        <SelectedElementIndicator 
          :rounded="false" 
          color="bg-primary" 
          :show="selectedPage?.title === page.title"
        />
      </template>
      
      <!-- Expansion Content -->
      <div class="q-pb-md">
        <div v-html="page.content"></div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import landing from '@/src/repository/landing'
import { useLandingPageStore } from '@/src/stores/landingPageStore'

const landingPageStore = useLandingPageStore()

const landingPages = ref([landing])

const selectedPage = ref<any>(null)

const selectPage = (page: any, event: Event) => {
  event.stopImmediatePropagation()
  event.preventDefault()
  event.stopPropagation()
  selectedPage.value = page
  landingPageStore.setLandingPage(page)
}
</script>

<style lang="scss">
.content-list {
  border: none;
}

.content-item {
  min-height: 60px;
}

.content-info {
  overflow: hidden;
}

.clickable {
  cursor: pointer;
}

.c-landing-item {
  // Add any specific styles for landing items here
}
</style>
