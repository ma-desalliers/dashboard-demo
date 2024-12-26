<template>
	<div class="content-wrapper q-pa-lg page-detail">


		<div class="business-details">
			<div class="text-h6 q-mb-md">{{ theAudience?.title }}</div>

			<div class="column q-col-gutter-sm">

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
						{{theAudience?.countryName}} - {{theAudience?.stateName}} - {{theAudience?.cityName }}
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

			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAudienceStore } from '~/src/stores/audienceStore';

const audienceStore = useAudienceStore()

const theAudience = computed(()=> audienceStore.currentAudience)

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

const options: Option[] = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' }
]

const handleSubmit = () => {
  emit('submit', inputValue.value)
}
</script>

<style lang="scss">
.image-container{
	height:100%;
	width:100%;

	img{
		height:250px;
		width:100%
	}
}

.page-detail{
    position:sticky;
    top:20px;
    z-index:12;
    max-height:calc(100vh - 70px);
    overflow-y: auto;
    &.isMobile{
      position:unset
    }
  }
</style>