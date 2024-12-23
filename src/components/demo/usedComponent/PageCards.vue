<template>
	<div class="full-height q-pa-md">
	  <div class="row justify-between q-mb-md">
		<div class="col-4">
		  <q-input
			v-model="search"
			outlined
			dense
			placeholder="Search pages"
		  >
			<template v-slot:append>
			  <q-icon name="search" />
			</template>
		  </q-input>
		</div>
		<div class="row q-gutter-md">
		  <q-select
			v-model="categoryFilter"
			:options="categoryOptions"
			outlined
			dense
			label="Category"
			class="col"
		  />
		  <q-select
			v-model="subcategoryFilter"
			:options="subcategoryOptions"
			outlined
			dense
			label="Subcategory"
			class="col"
		  />
		</div>
	  </div>
  
	  <div class="groups-container">
		<div v-for="(group, groupIndex) in filteredGroups" :key="group.jobId" class="q-mb-xl">
		  <div class="text-h6 q-mb-md">{{ group.jobTitle }}</div>
		  <div class="relative-position">
			<div 
			  :ref="el => { if (el) scrollContainers[groupIndex] = el }"
			  class="row no-wrap q-gutter-md scroll-x"
			>
			  <q-card
				v-for="page in group.pages"
				:key="page.uuid"
				flat
				bordered
				class="card-fixed-width"
			  >
				<q-card-section>
				  <div class="text-subtitle2">{{ page.title }}</div>
				  <div class="text-caption q-mt-sm">
					Category: {{ page.category?.name }}
				  </div>
				</q-card-section>
			  </q-card>
			</div>
			
			<q-btn
			  v-if="group.pages.length > 3"
			  round
			  outline
			  color="primary"
			  icon="chevron_left"
			  class="scroll-button scroll-left"
			  @click="scroll(groupIndex, 'left')"
			/>
			<q-btn
			  v-if="group.pages.length > 3"
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
	</div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useAudienceStore } from '~/src/stores/audienceStore'
import pages from '~/src/repository/pages';
  
  const audienceStore = useAudienceStore()
  const theAudience = computed(() => audienceStore.currentAudience)
  
  const search = ref('')
  const categoryFilter = ref(null)
  const subcategoryFilter = ref(null)
  const scrollContainers = ref<HTMLElement[]>([])
  
  
  const categoryOptions = computed(() => {
	return [...new Set(pages.map(page => page.category?.name))].filter(Boolean)
  })
  
  const subcategoryOptions = computed(() => {
	return [...new Set(pages.map(page => page.subcategory?.name))].filter(Boolean)
  })
  
  const filteredPages = computed(() => {
	return pages.filter(page => {
	  const matchesAudience = page.personaUuid === theAudience.value?.uuid
	  const matchesSearch = !search.value || 
		page.title.toLowerCase().includes(search.value.toLowerCase())
	  const matchesCategory = !categoryFilter.value || 
		page.category?.name === categoryFilter.value
	  const matchesSubcategory = !subcategoryFilter.value || 
		page.subcategory?.name === subcategoryFilter.value
	  
	  return matchesAudience && matchesSearch && matchesCategory && matchesSubcategory
	})
  })
  
  const filteredGroups = computed(() => {
	const groups = filteredPages.value.reduce((acc: any[], page) => {
	  const jobId = page.job?.uuid
	  const existingGroup = acc.find(g => g.jobId === jobId)
	  
	  if (existingGroup) {
		existingGroup.pages.push(page)
	  } else if (jobId) {
		acc.push({
		  jobId,
		  jobTitle: page.job?.title || 'Uncategorized',
		  pages: [page]
		})
	  }
	  
	  return acc
	}, [])
  
	return groups.map(group => ({
	  ...group,
	  pages: group.pages.sort((a: any, b: any) => 
		new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	  )
	}))
  })
  
  const scroll = (groupIndex: number, direction: 'left' | 'right') => {
	const container = scrollContainers.value[groupIndex]
	if (!container) return
	
	const scrollAmount = direction === 'left' ? -300 : 300
	container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
  </script>
  
  <style scoped>
  .full-height {
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	width: 100%;
  }
  
  .groups-container {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding: 0 16px;
  }
  
  .scroll-x {
	overflow-x: auto;
	scroll-behavior: smooth;
	-ms-overflow-style: none;
	scrollbar-width: none;
	padding: 8px 0;
  }
  
  .scroll-x::-webkit-scrollbar {
	display: none;
  }
  
  .card-fixed-width {
	min-width: 300px;
	height: 150px;
  }
  
  .scroll-button {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 2;
	opacity: 0.8;
	transition: opacity 0.3s;
  }
  
  .scroll-button:hover {
	opacity: 1;
  }
  
  .scroll-left {
	left: -20px;
  }
  
  .scroll-right {
	right: -20px;
  }
  </style>