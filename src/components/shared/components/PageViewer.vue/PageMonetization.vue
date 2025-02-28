<template>
  <div class="content-monetization">
    <!-- Header Section -->
    <div class="row justify-between q-mb-md">
      <div>
        <div class="text-h6 text-weight-bold" style="font-size: 18px; color: #212529">
          Content Monetization
        </div>
        <div class="text-subtitle2" style="font-size: 14px; color: #6C757D">
          Overview
        </div>
      </div>
      <div>
        <q-btn 
          color="positive" 
          label="Generate content" 
          rounded
          style="border-radius: 6px"
        />
      </div>
    </div>

    <!-- Product Placement Section -->
    <c-expansion-item
      v-model="productExpansion"
      label="Product placement"
      :title="$t(`products`)"
      title-class="c-section-title"
      header-class="text-weight-bold"
      expand-icon-class="expand-icon"
      :default-opened="true"
    >
      <template v-slot:header-right>
        <q-btn 
          flat 
          dense 
          color="positive" 
          label="Tout afficher" 
          class="q-ml-md" 
        />
      </template>

      <q-card flat style="background-color: #EAF7E4" class="q-py-md c-rounded">
        <div class="row no-wrap overflow-auto q-gutter-md" style="overflow-x:auto">
          <!-- Product 1 -->
          <Carousel>
          <q-card v-for="product in products" class="product-card q-mt-md" style="min-width: 240px">
            <q-img
              src="https://placehold.co/400x300/e7e7e7/352323?text=placeholder"
              style="height: 180px"
            />
            <q-card-section>
              <div class="text-h6" style="font-size: 16px">{{ product.name }}</div>
              <div class="row q-mt-sm items-center">
                <q-rating
                  v-model="product1Rating"
                  size="1em"
                  color="amber"
                  :max="5"
                  readonly
                />
                <span class="q-ml-sm text-grey-7">790</span>
              </div>
              <q-btn
                color="positive"
                :label="$t('product-details')"
                class="full-width q-mt-sm"
                style="border-radius: 6px"
              />
            </q-card-section>
          </q-card>
        </Carousel>
        </div>
      </q-card>
    </c-expansion-item>

    <!-- Lead Magnets Section -->
    <c-expansion-item
    v-model="leadMagnetExpansion"
      :title="$t('lead-magnets')"
      title-class="c-section-title "
      header-class="text-weight-bold"
      expand-icon-class="expand-icon"
      class="q-mt-md"
      :default-opened="true"
    >
      <template v-slot:header-right>
        <q-btn 
          flat 
          dense 
          color="positive" 
          label="Tout afficher" 
          class="q-ml-md"
        />
      </template>

      <q-card flat style="background-color: #EAF7E4" class="q-mt-sm">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-3 flex flex-center">
              <q-img
                src="https://placehold.co/300x400/ccc/333?text=FREE+STEEL+GRIT"
                style="max-width: 200px"
              />
            </div>
            <div class="col-12 col-sm-9">
              <div class="text-h6 text-weight-bold" style="font-size: 16px; color: #212529">
                Free Steel Grit Best Practices Guide
              </div>
              <div class="text-body2 q-mt-sm" style="font-size: 14px; color: #6C757D">
                Avoid jeopardizing the performance and longevity of your valve components by not leveraging best practices in steel grit utilization for surface treatment.
              </div>
              <div class="row q-mt-md">
                <div class="col-12 col-sm-6">
                  <div class="flex items-center q-mb-sm">
                    <q-icon name="check_circle" color="positive" size="sm" />
                    <span class="q-ml-sm">Material compatibility</span>
                  </div>
                  <div class="flex items-center q-mb-sm">
                    <q-icon name="check_circle" color="positive" size="sm" />
                    <span class="q-ml-sm">Optimal blasting techniques</span>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="flex items-center q-mb-sm">
                    <q-icon name="check_circle" color="positive" size="sm" />
                    <span class="q-ml-sm">Abrasive selection criteria</span>
                  </div>
                  <div class="flex items-center q-mb-sm">
                    <q-icon name="check_circle" color="positive" size="sm" />
                    <span class="q-ml-sm">Post-blasting inspection</span>
                  </div>
                </div>
              </div>
              <div class="q-mt-lg">
                <q-btn
                  color="positive"
                  label="Download Your Guide"
                  style="border-radius: 6px"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </c-expansion-item>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProductStore } from '~/src/stores/productStore';

// Product ratings
const product1Rating = ref(4.5)
const product2Rating = ref(4.5)
const product3Rating = ref(4.5)

const productExpansion = ref(true)
const leadMagnetExpansion = ref(true)

const companyUuid:string | undefined = inject('companyUuid')
const productStore = useProductStore()

const products = computed(()=> productStore.products)

const fetchProduct = () => {
  if(!companyUuid) return
  productStore.init(companyUuid)
}

onMounted(()=>{
  fetchProduct()
})

</script>

<style scoped>
.product-card {
  background-color: white;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.expand-icon {
  color: #6C757D;
}

:deep(.q-expansion-item__content) {
  padding: 0;
}
</style>