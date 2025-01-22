<template>
  <MarketingLayout>
    <!-- List Header -->
    <template #list-header>
      <span class="text-h6">Audiences</span>
    </template>

    <!-- List Content -->
    <template #list>
      <!-- Filter Section -->
      <div class="row q-col-gutter-md q-mb-lg q-px-md">
        <div class="col-12">
          <q-input
            v-model="search"
            outlined
            dense
            placeholder="Search audiences..."
            class="full-width"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <MultiSelect
            v-model="productFilter"
            :options="products"
            label-name="name"
            label="Filter by Product"
            :display-selected="'number'"
            dense
          />
        </div>
      </div>

      <!-- Audience List -->
      <AudienceList
        v-model="selectedAudience"
        :filter="[]"
        :product-filter="productFilter"
      >
        <template #list-header>
          <div class="row justify-end q-px-md q-mb-sm">
            <q-btn
              color="primary"
              icon="add"
              label="New Audience"
              dense
              @click="openNewAudienceDialog"
            />
          </div>
        </template>
      </AudienceList>
    </template>

    <!-- Main Content -->
    <template #content>
      <div class="row full-width">
        <!-- Audience Details -->
        <div class="col-12 col-md-4 q-pa-md">
          <template v-if="selectedAudience">
            <EditBox
              :uuid="selectedAudience.uuid"
              box-title="Audience Details"
              :title="selectedAudience.title"
              :description="selectedAudience.description"
              @update:title="updateAudienceTitle"
              @update:description="updateAudienceDescription"
              @save-changes="saveAudience"
              @delete-items="deleteAudience"
            />
          </template>
          <div 
            v-else 
            class="column items-center justify-center full-height text-grey-7"
          >
            <q-icon name="groups" size="48px" />
            <div class="text-h6 q-mt-md">Select an audience to view details</div>
          </div>
        </div>

        <!-- Associated Pages -->
        <div class="col-12 col-md-8 q-pa-md">
          <template v-if="selectedAudience">
            <AudiencePages @select-page="selectPage" />
          </template>
        </div>
      </div>
    </template>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import { storeToRefs } from 'pinia'
import { useAudienceStore } from '~/src/stores/audienceStore'
import MarketingLayout from '~/src/layouts/marketing/Marketing.vue'
import AudienceList from '@/src/components/demo/campaign/audience/AudienceList.vue'
import AudiencePages from '@/src/components/demo/campaign/audience/AudiencePages.vue'

// Import your repositories/stores
import products from '~/src/repository/product'

const audienceStore = useAudienceStore()
const search = ref('')
const productFilter = ref<string[]>([])
const selectedAudience = ref<any>(null)

// Methods for audience management
const updateAudienceTitle = (title: string) => {
  if (selectedAudience.value) {
    selectedAudience.value.title = title
  }
}

const updateAudienceDescription = (description: string) => {
  if (selectedAudience.value) {
    selectedAudience.value.description = description
  }
}

const saveAudience = async () => {
  try {
    // Implement your save logic here
    console.log('Saving audience:', selectedAudience.value)
  } catch (error) {
    console.error('Error saving audience:', error)
  }
}

const deleteAudience = async () => {
  try {
    // Implement your delete logic here
    console.log('Deleting audience:', selectedAudience.value)
    selectedAudience.value = null
  } catch (error) {
    console.error('Error deleting audience:', error)
  }
}

const openNewAudienceDialog = () => {
  // Implement your new audience dialog logic
  console.log('Opening new audience dialog')
}

const selectPage = (page: any) => {
  // Handle page selection
  console.log('Selected page:', page)
}

// Watch for audience selection changes
watch(selectedAudience, (newValue) => {
  if (newValue) {
    audienceStore.setAudience(newValue)
  }
})

// Provide selected audience to child components
provide('selectedAudience', selectedAudience)
</script>

<style lang="scss" scoped>
.full-height {
  min-height: 400px;
}
</style>