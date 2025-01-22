<template>
  <div>
    <CTable
      v-model="selectedProducts"
      :columns="fullColumns"
      :rows="products"
      :loading="loading"
      :batch-actions="batchActions"
      :pagination="pagination"
      @update:pagination="$emit('update:pagination', $event)"
      :hover-buttons="hoverButtonList"
      row-key="uuid"
    >
      <!-- Custom cell templates -->
      <template #cell-image="props">
        <q-img
          :src="props.value"
          :ratio="1"
          class="rounded-borders"
          style="height: 50px; width: 50px"
        >
          <template #error>
            <div class="absolute-full flex flex-center bg-grey-3">
              <q-icon name="image" size="2em" color="grey-7" />
            </div>
          </template>
        </q-img>
      </template>

      <!--<template #cell-category="props">
        <q-chip
          dense
          color="primary"
          text-color="white"
          :label="props.row.category?.name || 'N/A'"
        />
      </template>-->

      <template #cell-subcategory="props">
        <q-chip
          dense
          color="secondary"
          text-color="white"
          :label="props.row.subcategory?.name || 'N/A'"
        />
      </template>

      <template #cell-score="props">
        <div v-if="props.value !== null">
          <q-chip
            square
            dense
            :color="getScoreColor(props.value)"
            text-color="white"
          >
            {{ props.value }}
          </q-chip>
        </div>
        <span v-else>-</span>
      </template>

      <template #cell-pageCount="props">
        <q-chip
          outline
          dense
          color="grey"
          class="q-px-sm"
        >
          {{ props.value }}
        </q-chip>
      </template>
    </CTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import columns from '~/src/asset/tablesColumn/products'
import { useCompanyStore } from '~/src/stores/companyStore';
import { useProductStore } from '~/src/stores/productStore'

const getProducts = async () => {
  await productStore.init(companyStore.theCompany.uuid);
}

interface Category {
  uuid: string
  name: string
  description: string
  clientUuid: string
  parentUuid: string | null
  createdAt: number
}

interface Product {
  uuid: string
  clientUuid: string
  name: string
  description: string
  image: string
  score: number | null
  ctaName: string | null
  ctaUrl: string | null
  benefits: string | null
  createdAt: number
  category: Category | null
  subcategory: Category | null
  pageCount: number
}

const props = defineProps<{
  loading?: boolean
  pagination?: {
    sortBy: string
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber: number
  }
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onBatchDelete?: (products: Product[]) => void
}>()

const emit = defineEmits(['update:pagination'])

const selectedProducts = ref<Product[]>([])

const companyStore = useCompanyStore();
const productStore = useProductStore();

const batchActions = computed(() => {
  const actions = []
  
  if (props.onBatchDelete) {
    actions.push({
      label: 'Delete Selected',
      icon: 'delete',
      color: 'negative',
      handler: (selected: Product[]) => props.onBatchDelete?.(selected)
    })
  }
  
  return actions
})

const products = computed(() => productStore.products);
const company = computed(() => companyStore.theCompany);
const categories = computed(()=> productStore.categories);
/*const productRows = computed(()=>{
  return products.value.map(product=>{
    return{
      ...product,
      categoryName:product.category.name
    }
  })
})*/
const fullColumns = computed(()=>{
  return columns.map((column)=>{
    if(column.name == 'category'){
      return {
        ...column,
        options: categories.value.map((category) => {return {value: category.uuid, label: category.name}}),
        updateFn:updateCategory
      }
    }

    return column
  })

})

const hoverButtonList = computed(()=>{
  return [
  {
    icon: 'fa fa-eye',
    action:  (e:Event, item:any)=>{window.open(item.ctaUrl, '_blank')},
    color: 'white',
    textColor:'#333333'
  },
  {
    icon: 'fa fa-pen',
    action:  ()=>{console.log('sup')},
    color: 'white',
    textColor:'#333333'
  },
]}) 



const getScoreColor = (score: number): string => {
  if (score >= 8) return 'positive'
  if (score >= 5) return 'warning'
  return 'negative'
}

const updateCategory = (params:{item:any, value: any}) =>{
  console.log('updating Category' , params.item, params.value)
  params.item.category = categories.value.find((category)=> category.uuid == params.value.value)

}

onMounted(async () => {
  await getProducts();
});

watch(() => company.value.uuid, async () => {
  await getProducts();
});

</script>