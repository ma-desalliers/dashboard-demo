<template>
	<q-toolbar v-if="isVisible" class="c-header bg-primary relative-position" :class="{'isMobile':isMobile}">
		<div v-if="!isMobile">
			<span :class="isMobile?'':'absolute-center'" style="font-size: 1rem; font-weight: 300">
				<span v-if="!isMobile" class='text-white' >New Functionality Available!</span>
				
				<div v-if="isMobile" class=row>
					<q-avatar v-if="theCompany?.style?.favicon != null" size="24px" class="q-mr-sm">
						<img :src="theCompany?.style?.favicon" alt="Company logo">
					</q-avatar>
					<div class="c-company-name">{{ theCompany?.name }}</div>
				</div>
			</span>
			<q-btn
			v-if="!isMobile"
			flat
			dense
			icon="close"
			class="text-white absolute-right q-mr-md"
			@click="closeBar"
			/>
		</div>
		<div v-if=isMobile class="q-px-xs q-py-md full-width" style="padding-top:24px;">
			<client-header></client-header>
		</div>
	
	</q-toolbar>
	
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { useCompanyStore } from '@/src/stores/companyStore';
import ClientHeader from '~/src/components/shared/ClientHeader.vue';

const isVisible = ref(true)
const companyStore = useCompanyStore();
const theCompany = computed(() => companyStore.theCompany);

const emit = defineEmits(['state'])

const closeBar = () => {
	isVisible.value = false
	emit('state',isVisible.value)
}
const mainDisplayStore = useMainDisplayStore()

const isMobile = computed(()=> mainDisplayStore.isMobile);
</script>

<style lang="scss">
.c-header {
	background-color: white;
	border-bottom: 1px solid #e0e0e0;
	box-shadow: 1px 1px 5px #e0e0e0;
	
	.q-tab__label{
		font-size:16px;
	}
	
	&.isMobile{
		background-color: white !important;
		box-shadow: none;
	}
}

.c-items-start {
	align-items: start !important;
}

.c-flex-unset {
	flex: unset !important;
}
</style>
