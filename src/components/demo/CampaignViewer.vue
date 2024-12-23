<template>
	<div class="row full-width ">
		<div class="col-12  c-border-bottom" :class="{'c-bottom-shadow': isMobile}">
			<q-tabs v-model="listView" color="primary" :align="'left'" active-color="primary"
				active-class="c-bg-primary-lighten" indicator-color="primary" :class="{'q-pl-md' :  !isMobile}">
				<q-tab active name="products" label="Products" @click="setListView('products')" class="q-mr-md" />
				<q-tab name="audiences" label="Audiences" @click="setListView('audiences')" class="q-mr-md" />
				<q-tab name="pages" label="Contents" @click="setListView('pages')" />
			</q-tabs>
		</div>
		<div class="c-content-marketing row  col-12" :class="{'isMobile': isMobile}">
			<div class="row full-width col-12 no-wrap" >

				<div  :class="{'hide-list':!listVisible, 'col-12': isMobile, 'col-3': !isMobile}" class="pages-container c-border-right q-pt-md"  style="flex:1">
					<div class="hidden-item-clickable clickable q-pt-lg row justify-center" @click="showList">
						<i v-if="!listVisible"  class="fa-solid fa-arrow-right-from-bracket"></i>
					</div>
					<div class="page-scroll">
						<div class="row justify-between q-mb-sm q-px-md">
							<div>
								<span v-if="listView == 'pages'" class="text-h6"> Content marketing</span>
								<span v-if="listView == 'products'" class="text-h6"> Products</span>
								<span v-if="listView == 'audiences'" class="text-h6"> Audiences</span>

								<Tooltip :title="'Content Marketing'" :description="'this is a description '"></Tooltip>
							</div>
							<div v-if="!isMobile">
								<q-icon style="transform:rotate(180deg)" class="clickable" @click="hideList()">
									<i class="fa-solid fa-arrow-right-from-bracket"></i>
								</q-icon>
							</div>
						</div>

						<div class="col-3 ">
							<!-- Filter Section-->
							<div class="row q-col-gutter-md q-mb-lg q-px-md">

								<div class="col-12 col-sm-6">
									<MultiSelect dense v-model="productFilter" :options="products" label-name="name" label="Products"
										:display-selected="'number'" :use-search="true"></MultiSelect>

								</div>
								<!-- <div class="col-12 col-sm-3">
									<MultiSelect  v-model="audienceFilter" :options="audience" label-name="title" label="Brands" :display-selected="'number'" ></MultiSelect> 
									
								</div>-->
								<div class="col-12 col-sm-6">
									<MultiSelect v-model="audienceFilter" :options="audience" label-name="title" label="Audiences"
										:display-selected="'number'"></MultiSelect>

								</div>
							</div>

							<!-- Content List -->

							<PageList v-if="listView == 'pages'" v-model="selectedPage" :product-filter="productFilter"
								:audience-filter="audienceFilter" :small-version="showDetail"></PageList>
							<ProductList v-if="listView == 'products'" v-model="selectedPage" :filter="productFilter"
								:audience-filter="audienceFilter"></ProductList>
							<AudienceList v-if="listView == 'audiences'" v-model="selectedPage" :filter="audienceFilter"
								:product-filter="productFilter"></AudienceList>

							<!-- Pagination 
							<div class="row justify-center q-mt-lg">
								<q-pagination
								v-model="currentPage"
								:max="totalPages"
								:max-pages="6"
								boundary-numbers
								direction-links
								/>
							</div>-->
						</div>


					</div>
				</div>
				<div v-if="!isMobile" class="c-page-detail-container c-border-right" :class="{'c-col-30': showDetail}" style="flex:1">
					<PageDetail v-if="listView != 'audiences'" :page="selectedPage"></PageDetail>
					<AudienceDetail v-if="listView == 'audiences'"></AudienceDetail>
				</div>
				<div class="c-col-45" style="flex:1">
					<PageViewer v-if="listView != 'audiences'" :page="selectedPage"></PageViewer>

					<PageCards v-if="listView == 'audiences'"></PageCards>

				</div>
			</div>

		</div>
	</div>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import {  ref, type Reactive  } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { useAudienceStore } from '~/src/stores/audienceStore';
import { date, event } from 'quasar';

import products from '~/src/repository/product';
import audience from '~/src/repository/audience';
import PageViewer from './usedComponent/PageViewer.vue';
import MultiSelect from './usedComponent/MultiSelect.vue';
import PageList from './usedComponent/PageList.vue';
import ProductList from './usedComponent/ProductList.vue';
import AudienceList from './usedComponent/AudienceList.vue';

import pages from '~/src/repository/pages';
import PageDetail from './usedComponent/PageDetail.vue';
import PageCards from './usedComponent/PageCards.vue';
import AudienceDetail from './usedComponent/AudienceDetail.vue';


// Rest of your constants...
const statusOptions = ['Tous', 'Generated', 'Idea'] as const
const publishOptions = ['Tous', 'Publié'] as const


// Reactive state
const search = ref('')
const statusFilter = ref<typeof statusOptions[number]>('Tous')
const publishFilter = ref<typeof publishOptions[number]>('Tous')
const productFilter = ref<string[]>([])
const audienceFilter = ref<string[]>([])
const mainDisplayStore = useMainDisplayStore()
const audienceStore = useAudienceStore()

const { main} = storeToRefs(mainDisplayStore)
const isMobile = computed(()=>mainDisplayStore.isMobile)
const listView = ref('products')
const showDetail = ref(false)
const listVisible = ref(true)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const selectedPage = ref<any>({})
const filter = reactive<{generatedOnly: boolean | null}>({
	generatedOnly : null
})

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))
const theAudience = computed(()=> audienceStore.currentAudience)

onMounted(async () => {
	const page = pages.find(page=> page.uuid == 'a27f5e41-f8cd-485c-96b0-64ddfa978107' )
	
	if(page){
		selectedPage.value = page
	}
	else{
		selectedPage.value = pages[0]
	}
})

const formatDate = (dateString:string) => {
	return date.formatDate(dateString, 'D MMM.')
}

const selectPage = (page:any)=>{
	console.log('hello')
	selectedPage.value = page
	
}

const setListView = (listViewName:string) =>{
	listView.value = listViewName

	if(listView.value == 'audiences'){
		if(!theAudience.value && !theAudience.value?.uuid){
			console.log('sup', audience[0])
			audienceStore.setAudience(audience[0])
		}
	}
}

const hideList = () =>{
	listVisible.value = false
}

const showList = () =>{
	listVisible.value = true
}

watch(selectedPage, (newValue)=>{
	if(newValue.uuid){
		showDetail.value = true
	}
}, {deep:true})

</script>

<style lang="scss" scoped>
.c-content-marketing {
	min-height:calc(100% - 50px);
	
	&.isMobile{
		height:calc(100% - 50px);
	}
	.content-list {
		border: 0px solid #e0e0e0;
		// border-radius: 4px;
		background: white;
	}
	
	.header-row {
		background: #f8f9fa;
		min-height: 40px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}
	
	.content-item {
		min-height: 72px;
		
		&:hover {
			background: #f8f9fa;
		}
	}
	
	.content-info {
		.text-subtitle2 {
			font-weight: 500;
			line-height: 1.2;
		}
		
		.text-caption {
			margin-top: 4px;
		}
	}
	
	.q-item {
		padding: 8px 16px;
	}
}

.c-page-detail-container{  
	//overflow-x:hidden;
	transition: 0.25s;
}

.pages-container{
	height:calc(100% - 30px);
	min-height: calc(100% - 30px);
	position: relative;
	transition: 0.25s;
	.page-scroll{
		position:absolute;
		top:8px;
		left:0;
		right:0;
		bottom:0;
		overflow-y: auto;
	}

	&.hide-list{
		width:20px !important;
		min-width: 20px !important;
		flex-grow: 0 !important;
		.page-scroll{z-index:1}

		.hidden-item-clickable{
			position:absolute;
			inset:0;
			z-index:10;
			background-color: #ffffff;
			transition: 0.25s;
			&:hover{
				background-color: #f4f4f4;
			}
		}
	}
}

.c-bottom-shadow{
	box-shadow: 1px 1px 5px #e0e0e0;
}
</style>