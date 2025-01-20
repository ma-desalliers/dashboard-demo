<template>
  <MarketingLayout>
    <!-- List Header -->
    <template #list-header>
      <span class="text-h6">Products</span>
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
            placeholder="Search products..."
            class="full-width"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <MultiSelect
            v-model="audienceFilter"
            :options="audience"
            label-name="title"
            label="Filter by Audience"
            :display-selected="'number'"
            dense
          />
        </div>
      </div>

      <!-- Product List -->
      <ProductList
        v-model="selectedProduct"
        :filter="[]"
        :audience-filter="audienceFilter"
      >
        <template #list-header>
          <div class="row justify-end q-px-md q-mb-sm">
            <q-btn
              color="primary"
              icon="add"
              label="New Product"
              dense
              @click="openNewProductDialog"
            />
          </div>
        </template>
      </ProductList>
    </template>

    <!-- Main Content -->
    <template #content>
      <div class="product-detail q-pa-md">
        <template v-if="selectedProduct">
          <EditBox
            :uuid="selectedProduct.uuid"
            box-title="Product Details"
            :title="selectedProduct.name"
            :description="selectedProduct.description"
            @update:title="updateProductTitle"
            @update:description="updateProductDescription"
            @save-changes="saveProduct"
            @delete-items="deleteProduct"
          />
        </template>
        <div 
          v-else 
          class="column items-center justify-center full-height text-grey-7"
        >
          <q-icon name="inventory_2" size="48px" />
          <div class="text-h6 q-mt-md">Select a product to view details</div>
        </div>
      </div>
    </template>
  </MarketingLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MarketingLayout from '@/src/layout/marketing/Marketing.vue'
import ProductList from '@/src/components/demo/campaign/ProductList.vue'

// Import your repositories/stores
import audience from '~/src/repository/audience'

const search = ref('')
const audienceFilter = ref<string[]>([])
const selectedProduct = ref<any>(null)

// Methods for product management
const updateProductTitle = (title: string) => {
  if (selectedProduct.value) {
    selectedProduct.value.name = title
  }
}

const updateProductDescription = (description: string) => {
  if (selectedProduct.value) {
    selectedProduct.value.description = description
  }
}

const saveProduct = async () => {
  try {
    // Implement your save logic here
    console.log('Saving product:', selectedProduct.value)
  } catch (error) {
    console.error('Error saving product:', error)
  }
}

const deleteProduct = async () => {
  try {
    // Implement your delete logic here
    console.log('Deleting product:', selectedProduct.value)
    selectedProduct.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
  }
}

const openNewProductDialog = () => {
  // Implement your new product dialog logic
  console.log('Opening new product dialog')
}
</script>

<style lang="scss" scoped>
.full-height {
  min-height: 400px;
}

.product-detail {
  height: 100%;
  overflow-y: auto;
}
</style>