<template>
	<div class="content-wrapper q-pa-lg page-detail" :class="{ 'is-mobile c-pa-none': isMobile }">
		<div class="business-details">
			<div class="row q-pb-sm clickable" style="background-color: white;" @click="unselectAudience" v-if="isMobile">
				<q-icon size="20px" class="q-pt-xs q-pr-sm">
					<i class="fa fa-arrow-left"></i>
				</q-icon>
				<span style="font-size:16px;padding-top:2px">Back to List</span>
			</div>
			<div class="q-pt-md q-mb-md">
				<span v-if="isMobile" class="q-pr-sm clickable" @click="hideAudience">
					<i class="fa fa-chevron-down"  :class="{'rorate-180':hideInfo}"></i>
				</span>
				<span class="text-h6">{{ theAudience?.title }}</span>
			</div>

			<div class="column q-col-gutter-sm info-container" :class="{'hide':hideInfo}">

				<div class="image-container">
					<img src="https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg" class="c-img-cover c-rounded">
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Sector&nbsp;:&nbsp;</span>
						{{ theAudience?.sectorName }}
					</span>
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Industry&nbsp;:&nbsp;</span>
						{{ theAudience?.subIndustryName }}
					</span>
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Sub-industry&nbsp;:&nbsp;</span>
						{{ theAudience?.subIndustryName }}
					</span>
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Location&nbsp;:&nbsp;</span>
						{{ theAudience?.countryName }} - {{ theAudience?.stateName }} - {{ theAudience?.cityName }}
					</span>
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Model&nbsp;:&nbsp;</span>
						B2B
					</span>
				</div>

				<div class="row">
					<span>
						<span class="c-box-subtitle c-smaller">Annual revenue&nbsp;:&nbsp;</span>
						{{ theAudience?.revenue }}
					</span>
				</div>
				<div class="q-pb-md">
					<!--<q-input outlined v-model="audienceDiscution" dense placeholder="Start a discussion" class="">
						<template #after>
							<q-btn color="primary">
								<i class="fa fa-arrow-up"></i>
							</q-btn>
						</template>
					</q-input>-->
					<div class="row q-gutter-sm q-pt-lg">
						<q-btn outline color="primary" label="Previous" @click="selectBefore()" />
						<q-btn color="primary" label="Next" @click="selectNext()" />
					</div>
				</div>
			</div>
			
			<div>
				
			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAudienceStore } from '~/src/stores/audienceStore';
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';
import audience from '~/src/repository/audience';

const audienceStore = useAudienceStore()
const mainDisplayStore = useMainDisplayStore()

const theAudience = computed(() => audienceStore.currentAudience)
const isMobile = computed(() => mainDisplayStore.isMobile)

interface Option {
	label: string
	value: string
}

const props = defineProps<{
	initialValue?: string
}>()

const emit = defineEmits<{
	(e: 'submit', value: string): void
}>()

const inputValue = ref(props.initialValue || '')
const selectedOption = ref<string>('')

const audienceDiscution = ref('')

const hideInfo = ref(false)

const options: Option[] = [
	{ label: 'Option 1', value: 'opt1' },
	{ label: 'Option 2', value: 'opt2' }
]

const handleSubmit = () => {
	emit('submit', inputValue.value)
}

const selectBefore = () => {
	const audienceIndex = audience.findIndex(audience => audience.uuid == theAudience.value.uuid)

	if (audienceIndex == 0) {
		audienceStore.setAudience(audience[audience.length - 1])
	}
	else {
		audienceStore.setAudience(audience[audienceIndex - 1])
	}
}

const selectNext = () => {
	const audienceIndex = audience.findIndex(audience => audience.uuid == theAudience.value.uuid)

	if (audienceIndex == audience.length - 1) {
		audienceStore.setAudience(audience[0])
	}
	else {
		audienceStore.setAudience(audience[audienceIndex + 1])
	}
}

const unselectAudience = () => {
	audienceStore.setAudience(null)
}

const hideAudience = () =>{
	hideInfo.value = !hideInfo.value
}
</script>

<style lang="scss">
.image-container {
	height: 100%;
	width: 100%;

	img {
		height: 250px;
		width: 100%
	}
}

.page-detail {
	position: sticky;
	top: 20px;
	z-index: 12;
	max-height: calc(100vh - 70px);
	overflow-y: auto;

	&.is-mobile {
		position: unset;
		.info-container{
			&.hide{
				height: 0px;
				overflow:hidden;
			}
		}
	}
}
</style>