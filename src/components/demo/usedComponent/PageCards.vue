<template>
	<div class="full-height q-pa-md page-cards">
		<div class="row justify-between q-mb-md">
			<div class="col-4">
				<div></div>
				<q-input v-model="search" outlined dense placeholder="Search pages">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</div>
			<div class="row q-col-gutter-md col-8 justify-end">
				<div class="col-12 col-sm-5">
					<MultiSelect v-model="selectedJob" :options="uniqueJobs" :hover-buttons="[]" label-name="optionTitle"
						:multiple="false" numberSelectedLabel="Motivation: Job" :display-selected="'string'" @update:model-value="selectedJobUpdated()" />
				</div>
				<div class="col-12 col-sm-5">
					<MultiSelect v-model="selectedSubJob" :options="uniqueSubjobs" :hover-buttons="[]" label-name="optionTitle"
						:multiple="true" numberSelectedLabel="Groups: Sub job" />
				</div>
			</div>
		</div>
		<div class="column q-pt-sm q-pb-xl">
			<span class="c-box-title">Motivation</span>
			<span class="text-h6">{{ selectedJobTitle }}</span>
		</div>
		<div class="groups-container">
			<span class="c-box-title">Job-To-Be-Done</span>
			<div v-for="(group, groupIndex) in filteredGroups" :key="group.jobId" class="q-pb-xl">
				<div class="row justify-between">
					<div class="c-section-title q-mb-md">{{ group.jobTitle }}</div>
					<div class="text-primary c-font-sise-1">
						Selected ({{ group.pages.filter((page :any)=> isPageSelected(page)).length }})
					</div>
				</div>
				<div class="relative-position">
					<div :ref="el => { if (el) scrollContainers[groupIndex] = el }" class="row no-wrap q-gutter-md scroll-x">

						<q-card v-for="page in group.pages" :key="page.uuid" flat bordered class="card-fixed-width clickable" :class="{'c-bg-primary-lighten': isPageSelected(page)}" @click="selectPage(page)">

							<div class="card-label q-py-xs q-px-sm">
								<span>Tips</span>
							</div>
							<div class="img-container">
								<img
									src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Cat_August_2010-4.jpg/1200px-Cat_August_2010-4.jpg"
									class="c-img-cover" />
							</div>
							<q-card-section>
								<div class="text-subtitle2 page-title">{{ page.title }}</div>
								<div class="text-caption q-mt-sm">
									Category: {{ page.category?.name }}
								</div>
							</q-card-section>
						</q-card>
					</div>

					<q-btn v-if="group.pages.length > 3" round outline color="primary" icon="chevron_left"
						class="scroll-button scroll-left" @click="scroll(groupIndex, 'left')" />
					<q-btn v-if="group.pages.length > 3" round outline color="primary" icon="chevron_right"
						class="scroll-button scroll-right" @click="scroll(groupIndex, 'right')" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudienceStore } from '~/src/stores/audienceStore'
import pages from '~/src/repository/pages';
import { mdiConsoleNetworkOutline } from '@quasar/extras/mdi-v6';

const audienceStore = useAudienceStore()
const theAudience = computed(() => audienceStore.currentAudience)

const search = ref('')
const scrollContainers = ref<HTMLElement[]>([])

const selectedJob = ref<any | null>(null)
const selectedSubJob = ref<any | null>(null)

const filteredPages = computed(() => {
	return pages.filter(page => {
		const matchesAudience = page.personaUuid === theAudience.value?.uuid

		const matchesSearch = !search.value ||
			page.title.toLowerCase().includes(search.value.toLowerCase())

		const matchesJob = !selectedJob.value?.length ||
			selectedJob.value.includes(page.job?.uuid)

		const matchesSubJob = !selectedSubJob.value?.length ||
			selectedSubJob.value.includes(page.subjob?.uuid)

		return matchesAudience && matchesSearch && matchesJob && matchesSubJob
	})
})

const selectedJobTitle = computed(()=>{
	console.log('sup', selectedJob.value)
	if(selectedJob.value){
		const job =  uniqueJobs.value.find(job => job.uuid == selectedJob.value )
		console.log(job)
		return job?.title
	}

	return ''
})

const filteredGroups = computed(() => {
	const groups = filteredPages.value.reduce((acc: any[], page) => {
		const jobId = page.subjob?.uuid
		const existingGroup = acc.find(g => g.jobId === jobId)

		if (existingGroup) {
			existingGroup.pages.push(page)
		} else if (jobId) {
			acc.push({
				jobId,
				jobTitle: page.subjob?.title || 'Uncategorized',
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

const uniqueJobs = computed(() => {
  // First, get all pages with jobs
  const pagesWithJobs = pages.filter(page => page.personaUuid == theAudience.value.uuid && page.job !== null && page.job !== undefined);
  
  // Create a Map to store jobs and their page counts
  const jobMap = new Map();
  
  // Count pages for each job
  pagesWithJobs.forEach(page => {
    const jobUuid = page.job.uuid;
    if (!jobMap.has(jobUuid)) {
      // Add job with initial count of 1 and add optionTitle
      jobMap.set(jobUuid, {
        ...page.job,
        totalPages: 1,
        optionTitle: `(1) ${page.job.title}`,
        title: page.job.title // Keep original title
      });
    } else {
      // Increment the count for existing job and update optionTitle
      const job = jobMap.get(jobUuid);
      job.totalPages++;
      job.optionTitle = `(${job.totalPages}) ${job.title}`; // Use original title for display
    }
  });

  // Convert Map values to array
  return Array.from(jobMap.values());
});

const uniqueSubjobs = computed(() => {
  // First, get all pages with subjobs
  const pagesWithsubJobs = pages.filter(page => page.personaUuid == theAudience.value.uuid && selectedJob.value == page.job.uuid  && page.subjob !== null && page.subjob !== undefined);
  
  // Create a Map to store subjobs and their page counts
  const subjobMap = new Map();
  
  // Count pages for each subjob
  pagesWithsubJobs.forEach(page => {
    const subjobUuid = page.subjob.uuid;
    if (!subjobMap.has(subjobUuid)) {
      // Add subjob with initial count of 1 and add optionTitle
      subjobMap.set(subjobUuid, {
        ...page.subjob,
        totalPages: 1,
        optionTitle: `(1) ${page.subjob.title}`,
        title: page.subjob.title // Keep original title
      });
    } else {
      // Increment the count for existing subjob and update optionTitle
      const subjob = subjobMap.get(subjobUuid);
      subjob.totalPages++;
      subjob.optionTitle = `(${subjob.totalPages}) ${subjob.title}`; // Use original title for display
    }
  });

  // Convert Map values to array
  return Array.from(subjobMap.values());
});

const scroll = (groupIndex: number, direction: 'left' | 'right') => {
	const container = scrollContainers.value[groupIndex]
	if (!container) return

	const containerWidth = container.getBoundingClientRect().width
	let scrollAmount: number

	// Determine scroll amount based on container width
	if (containerWidth >= 1064) { // Width suitable for 798px scroll
		scrollAmount = 798
	} else if (containerWidth > 625) {
		scrollAmount = 532
	} else {
		scrollAmount = 266
	}

	container.scrollBy({
		left: direction === 'left' ? -scrollAmount : scrollAmount,
		behavior: 'smooth'
	})
}
const selectedJobUpdated = () => {
	selectedSubJob.value = [];
}


const selectedPages = ref<string[]>([])
const isPageSelected = (page:any) =>{
 return selectedPages.value.some(selectedPage => selectedPage == page.uuid)
}

const selectPage = (page:any): void => {
  const index = selectedPages.value.findIndex(uuid => uuid === page.uuid)
  
  if (index === -1) {
    // Page not selected, add it
    selectedPages.value.push(page.uuid)
  } else {
    // Page already selected, remove it
    selectedPages.value.splice(index, 1)
  }
}

watch(() => theAudience.value.uuid, () => {
  selectedJob.value = null;
  selectedSubJob.value = []
})

</script>

<style scoped lang="scss">
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
	.img-container {
		height: 170px;
		width: 100%;

		img {
			height: 100%;
			width: 100%;
		}
	}

	.card-label {
		position: absolute;
		top: 10px;
		left: 0;
		background: var(--q-primary);
		color: white;
		font-size: 1rem;
		border-radius: 0 4px 4px 0 !important;
	}
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
	min-width: 250px;
	max-width: 250px;
	height: 300px;
}

.scroll-button {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 2;
	transition: opacity 0.3s;
	background-color: #f5f5f5 !important;
}

.scroll-button:hover {
	opacity: 1;
}

.scroll-left {
	left: 0px;
}

.scroll-right {
	right: 0px;
}

.page-title {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.2em;
	max-height: 3.6em;
}

.page-cards {
	overflow: auto;

	position: sticky;
	top: 20px;
	z-index: 12;
	max-height: calc(100vh - 70px);
	overflow-y: auto;

	&.isMobile {
		position: unset
	}
}

.c-box-title{
	font-size:1rem;
}
</style>