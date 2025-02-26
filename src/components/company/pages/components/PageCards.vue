<template>
	<div class="relative-position">
		<div ref="scrollContainer" class="row no-wrap q-gutter-md scroll-x">
			<q-card v-for="page in formattedPages" :key="page.uuid" flat bordered class="card-fixed-width clickable"
				:class="{ 'c-bg-primary-lighten': isPageSelected(page) }" @click="selectPage(page)">
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
						<div>{{ page.format }} {{ page.buyingStage }}</div>
						<div class="row justify-between">
							<status-popup :current-item="1" :options="[{ value: '1', label: 'hello' }]"></status-popup>
							<div class="row col- justify-end q-col-gutter-xs">
								<div>
									<q-btn class="c-square" outline square color="primary" icon="o_autorenew" size="sm"></q-btn>
								</div>
								<div>
									<q-btn class="c-square" outline square color="primary" icon="o_mail" size="sm"></q-btn>
								</div>
								<div>
									<q-btn class="c-square" outline square color="primary" icon="o_more_horiz" size="sm"></q-btn>
								</div>
							</div>
						</div>
					</div>
				</q-card-section>
			</q-card>

			<!-- Load More Card 
			<q-card v-if="hasMorePages" flat bordered class="card-fixed-width load-more-card" @click="loadMorePages">
				<q-card-section class="column items-center justify-center full-height">
					<q-btn flat round color="primary" icon="add" size="lg" />
					<div class="text-subtitle2 q-mt-sm">Load More</div>
					<div class="text-caption">{{ pagination.page * pagination.rowsPerPage }} of {{ pagination.rowsNumber }}</div>
				</q-card-section>
			</q-card>-->
		</div>

		<q-btn round outline color="primary" icon="chevron_left"
			class="scroll-button scroll-left" @click="scroll('left')" />
		<q-btn round outline color="primary" icon="chevron_right"
			class="scroll-button scroll-right" @click="scroll('right')" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePageStore } from '@/src/stores/pageStore'
import { useCompanyStore } from '@/src/stores/companyStore'

const props = defineProps<{
	audienceUuid?: string
	subjobUuid?: string
	onEdit?: (page: Page) => void
	onDelete?: (page: Page) => void
	onBatchDelete?: (pages: Page[]) => void
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)

const pageStore = usePageStore()
const companyStore = useCompanyStore()

const pagination = ref({
	page: 0,
	rowsPerPage: 5,
	sortBy: 'createdAt',
	descending: true,
	rowsNumber: 0
})

const formattedPages = computed(() => {
	return isLoading.value ? [] : pageStore.pages.map((page) => ({
		uuid: page.uuid,
		title: page.title,
		status: 'selection',
		relevancy: getRelevancyText(page.relevancyScore || 8),
		channel: 'Search Engine',
		buyingStage: 1,
		format: page.type || 'Unknown',
		creationDate: new Date(page.createdAt).toLocaleDateString()
	}))
})

const hasMorePages = computed(() => {
	return pagination.value.page * pagination.value.rowsPerPage < pagination.value.rowsNumber
})

const getRelevancyText = (relevancy: number): string => {
	if (relevancy >= 8) return 'Excellent'
	if (relevancy >= 5) return 'Good'
	return 'Average'
}

const fetchPages = async () => {
	try {
		isLoading.value = true
		await pageStore.list(pagination.value.page, pagination.value.rowsPerPage, {
			clientUuid: companyStore.theCompany.uuid,
			audienceUuid: props.audienceUuid,
			subjobUuid: props.subjobUuid,
			withContent: true
		})
		pagination.value = {
			...pagination.value,
			rowsNumber: pageStore.totalRecords
		}
	} finally {
		isLoading.value = false
	}
}

const loadMorePages = async () => {
	if (hasMorePages.value && !isLoading.value) {
		pagination.value.page++
		await fetchPages()
	}
}

const scroll = (direction: 'left' | 'right') => {
	if(direction == 'right'){
		pagination.value.page++
		fetchPages()
	}
	else{
		pagination.value.page--
		fetchPages()
	}

	/*const container = scrollContainer.value
	if (!container) return

	const containerWidth = container.getBoundingClientRect().width
	let scrollAmount: number

	if (containerWidth >= 1064) {
		scrollAmount = 798
	} else if (containerWidth > 625) {
		scrollAmount = 532
	} else {
		scrollAmount = 266
	}

	container.scrollBy({
		left: direction === 'left' ? -scrollAmount : scrollAmount,
		behavior: 'smooth'
	})*/
}

const isPageSelected = () => {
	return false
}

const selectPage = (page: any) => {
	return ''
}
onMounted(() => {
	fetchPages()
})

watch(() => props.audienceUuid, () => {
	fetchPages()
})

watch(() => props.subjobUuid, () => {
	fetchPages()
})


// Watchers for props changes
watch(() => props.audienceUuid, () => {
	pagination.value.page = 1
	fetchPages()
})

watch(() => props.subjobUuid, () => {
	pagination.value.page = 1
	fetchPages()
})

onMounted(() => {
	fetchPages()
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

.load-more-card {
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background-color 0.3s;

	&:hover {
		background-color: #f5f5f5;
	}
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
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
	line-height: 1.2em;
	max-height: 33px;
}

.c-box-title {
	font-size: 1rem;
}
</style>