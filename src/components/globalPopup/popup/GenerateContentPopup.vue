<template>
  <div class="full-width q-mb-lg" ref="triggerRef">
    <q-btn class="full-width" color="primary" :label="$t('create-content')" @click="ShowPopup()"></q-btn>
  </div>

  <PopupContainer v-model="showPopup" ref="popupRef" @hide="handleHide" dialog-class="generate-content-popup">
    <q-card flat class="content-generator ">
      <!-- Header -->
      <div class="row justify-between items-center q-py-md q-px-lg  c-bg-main-gray">
        <div class="row items-center">
          <div class="text-subtitle1 q-mr-sm">{{$t('create-content')}}</div>
          <q-icon name="help" size="xs" color="grey-6">
            <q-tooltip>{{$t('tooltip-create-content')}}</q-tooltip>
          </q-icon>
        </div>
        <q-btn flat dense color="green" :label="$t('advanced-mode')" class="text-caption" @click="toggleAdvancedMode" />
      </div>

      <AddCredit v-if="showAddCredit" @close="ShowPopup"></AddCredit>
      <q-card-section  v-else class="q-pa-lg relative">

        <ContentLoader 
        v-if="loading"
          :showing="loading" 
          :label="$t('generating-content')"
        />
      <!-- Product Selection -->
      <div class="q-mb-lg">
        <div class="row items-center justify-between">
          <div class="row items-center q-mr-sm" style="width: 120px">
            <div class="text-subtitle2 q-mr-sm">{{$t('products')}}</div>
            <q-icon name="help" size="xs" color="grey-6">
              <q-tooltip>{{$t('tooltip-select-product')}}</q-tooltip>
            </q-icon>
          </div>
          <c-select 
            class="col"
            v-model="selectedProduct" 
            :options="productList" 
            option-label="name"
            option-value="uuid"
            align="right"
            dense 
            emit-value="false"
            map-options
          />
        </div>
      </div>

      <!-- Audience Selection -->
      <div class="q-mb-lg">
        <div class="row items-center justify-between">
          <div class="row items-center q-mr-sm" style="width: 120px">
            <div class="text-subtitle2 q-mr-sm">{{$t('audience')}}</div>
            <q-icon name="help" size="xs" color="grey-6">
              <q-tooltip>{{$t('tooltip-select-audience')}}</q-tooltip>
            </q-icon>
          </div>
          <c-select 
            class="col text-right"
            v-model="selectedAudience" 
            :options="audienceList"
            option-value="uuid"
            option-label="title"
            dense 
            emit-value 
            map-options 
          />
        </div>
      </div>

      <!-- Content Type Sliders -->
      <div class="content-sliders q-mb-lg">
        <div v-for="slider in contentSliders" :key="slider.id" class="q-mb-lg">
          <div class="row items-center justify-between">
            <div class="row items-center q-mr-sm" style="width: 140px">
              <div class="text-subtitle2 q-mr-sm">{{$t(slider.id)}}</div>
              <q-icon name="help" size="xs" color="grey-6">
                <q-tooltip>{{$t(slider.tooltip)}}</q-tooltip>
              </q-icon>
            </div>
            <div class="col row items-center">
              <q-slider 
                v-model="slider.value" 
                :min="0" 
                :max="slider.max" 
                :step="1" 
                color="green"
                class="col"
              />
              <div class="q-ml-sm" style="width: 30px; text-align: right">
                {{ slider.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generate Button -->
      <div class="q-py-md q-px-sm bg-green-1 rounded-borders">
        <q-btn 
          color="green" 
          :label="$t('generate-content')" 
          class="full-width" 
          :loading="loading" 
          @click="generateContent" 
        />

        <!-- Footer -->
        <div class="row justify-center items-center text-caption text-grey-7 q-mt-sm">
          <q-avatar size="20px" class="q-mr-xs">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <span>5 experts | 1% credit usage</span>
        </div>
      </div>
    </q-card-section>
    </q-card>
  </PopupContainer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import PopupContainer from '../PopupContainer.vue'
import { useProductStore } from '~/src/stores/productStore'
import { useAudienceStore } from '~/src/stores/audienceStore'
import { useCompanyStore } from '~/src/stores/companyStore'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore'
import AddCredit from '../../shared/AddCredit.vue'
import { BaseRepository } from '~/src/repository/BaseRepository'
interface ContentSlider {
  id: string
  label: string
  value: number
  max: number
  tooltip: string
}

// State
const loading = ref(false)
const advancedMode = ref(false)
const showPopup = ref(false)
const triggerRef = ref<HTMLElement>()
const showAddCredit = ref(false)
const popupRef = ref()
const selectedProduct = ref<{ uuid: string | null; name: string }>({
  uuid: null,
  name: 'Select a product'
});
const selectedAudience = ref<{ uuid: string | null; title: string }>({
  uuid: null,
  title: 'Select an audience'
});

const contentSliders = reactive<ContentSlider[]>([
  {
    id: 'topics',
    label: 'Topics',
    value: 5,
    max: 20,
    tooltip: 'Number of topics to generate'
  },
  {
    id: 'blog-posts',
    label: 'Blog posts',
    value: 10,
    max: 50,
    tooltip: 'Number of blog posts to generate'
  },
  {
    id: 'social-posts',
    label: 'Social posts',
    value: 50,
    max: 100,
    tooltip: 'Number of social media posts to generate'
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    value: 0,
    max: 10,
    tooltip: 'Number of newsletters to generate'
  }
])

const productStore = useProductStore()
const audienceStore = useAudienceStore()
const companyStore = useCompanyStore()
const mainDisplayStore = useMainDisplayStore()
const config = useRuntimeConfig();

const audienceList = computed(()=> audienceStore.audiences) 
const productList = computed(()=> productStore.products) 
const selectedProductUuid = computed(() => selectedProduct.value?.uuid);
const selectedProductName = computed(() => selectedProduct.value?.name);

const selectedAudienceUuid = computed(() => selectedAudience.value?.uuid);
const selectedAudienceTitle = computed(() => selectedAudience.value?.title);

// Methods
const toggleAdvancedMode = () => {
  advancedMode.value = !advancedMode.value
}

const generateContent = async () => {
  loading.value = true
  try {
    // await new Promise(resolve => setTimeout(resolve, 3000))

    // showAddCredit.value = true

    // nextTick(() => {
    //   popupRef.value.setTriggerElement(triggerRef.value, {
    //     width: '500px',
    //     maxHeight: '1200px'
    //   })
    // })
    if (!selectedProductUuid.value || !selectedAudienceUuid.value) {
      console.error('Product and Audience must be selected');
      return;
    }
    const payload = {
      productUuid: selectedProductUuid.value,
      audienceUuid: selectedAudienceUuid.value,
      clientUuid: companyStore.theCompany.uuid,
      subject: contentSliders.find(slider => slider.id === 'topics')?.value,
      blogPost: contentSliders.find(slider => slider.id === 'blog-posts')?.value
    };
    const repository = new BaseRepository();
    await repository.apiRequest<any>('/content/bulk', {
      method: 'POST',
      body: payload
    });
    handleHide();
  } catch (error) {
    console.error('Error generating content:', error)
  } finally {
    loading.value = false
  }
}

const handleHide = () => {
  showPopup.value = false
  mainDisplayStore.setOverlay('')
  loading.value= false
}

const ShowPopup = () => {
  showAddCredit.value = false
  showPopup.value = true
  if (triggerRef.value && popupRef.value) {
    nextTick(() => {
      popupRef.value.setTriggerElement(triggerRef.value, {
        width: '500px',
        maxHeight: '800px'
      })
    })
  } 

  mainDisplayStore.setOverlay('content')
  handleShow()
}

const handleShow = () =>{
  productStore.init(companyStore.theCompany.uuid)
  audienceStore.init(companyStore.theCompany.uuid)

}

</script>

<style >
.content-generator {
  max-width: 600px;
  margin: 0 auto;
}

.content-sliders {
  width: 100%;
}

.rounded-borders {
  border-radius: 8px;
}

.generate-content-popup{
  transform: translateX(25px)
}
</style>
