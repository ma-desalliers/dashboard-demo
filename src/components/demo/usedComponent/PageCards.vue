<template>
  <div class="q-pa-md c-page-card-container">
    <!-- Header -->
    <div class="row justify-between q-mb-lg">
      <div class="col-4">
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="row q-gutter-md">
        <q-select
          v-model="filter1"
          :options="filterOptions1"
          outlined
          dense
          label="Filter 1"
          class="col"
        />
        <q-select
          v-model="filter2"
          :options="filterOptions2"
          outlined
          dense
          label="Filter 2"
          class="col"
        />
      </div>
    </div>

    <!-- Card Groups -->
    <div v-for="(group, groupIndex) in groups" :key="groupIndex" class="q-mb-xl">
      <div class="text-h6 q-mb-md">{{ group.title }}</div>
      <div class="relative-position">
        <div 
          :ref="el => { if (el) scrollContainers[groupIndex] = el }"
          class="row no-wrap q-gutter-md scroll-x"
        >
          <q-card
            v-for="item in group.items"
            :key="item.id"
            flat
            bordered
            class="card-fixed-width"
          >
            <q-card-section class="text-center">
              {{ item.title }}
            </q-card-section>
          </q-card>
        </div>
        
        <q-btn
          round
					outline
          color="primary"
          icon="chevron_left"
          class="scroll-button scroll-left"
          @click="scroll(groupIndex, 'left')"
        />
        <q-btn
          round
					outline
          color="primary"
          icon="chevron_right"
          class="scroll-button scroll-right"
          @click="scroll(groupIndex, 'right')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const filter1 = ref(null)
const filter2 = ref(null)

const filterOptions1 = ['Option 1', 'Option 2', 'Option 3']
const filterOptions2 = ['Choice 1', 'Choice 2', 'Choice 3']

const groups = ref([
  {
    title: 'Group 1',
    items: Array(10).fill(null).map((_, i) => ({ id: i, title: `Item ${i + 1}` }))
  },
  {
    title: 'Group 2',
    items: Array(10).fill(null).map((_, i) => ({ id: i, title: `Item ${i + 1}` }))
  }
])

const scrollContainers = ref<HTMLElement[]>([])

const scroll = (groupIndex: number, direction: 'left' | 'right') => {
  const container = scrollContainers.value[groupIndex]
  if (!container) return
  
  const scrollAmount = direction === 'left' ? -300 : 300
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}
</script>

<style scoped>

.c-page-card-container{
	max-width: 100%;
}
.scroll-x {
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
	max-width: 100%;
}

.scroll-x::-webkit-scrollbar {
  display: none;
}

.card-fixed-width {
  min-width: 200px;
  height: 150px;
}

.relative-position {
  position: relative;
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.scroll-left {
  left: -20px;
}

.scroll-right {
  right: -20px;
}
</style>