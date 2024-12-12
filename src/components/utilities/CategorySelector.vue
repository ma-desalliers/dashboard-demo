<template>
  <div class="row q-col-gutter-md q-ml-none q-pl-none">
    <div class="col-6">
      <MultiSelect
        v-model="selectedCategory"
        :options="parentCategories"
        :hover-buttons="categoryButtons"
        labelName="name"
        label="Category"
        :multiple="false"
        :emit-value="false"
        @update:model-value="handleCategoryChange"
        :add-function="openCategoryEditor"
      />
    </div>
    <div class="col-6">
      <MultiSelect
        v-model="selectedSubCategory"
        :options="selectedCategory?.subCategories?.filter(sub => sub.uuid) || []"
        :hover-buttons="categoryButtons"
        labelName="name"
        label="Sub Category"
        selectionType="uuid"
        :multiple="false"
        :emit-value="false"
        :add-function="openSubCategoryEditor"
        @update:model-value="handleSubCategoryChange"
        :disable="!selectedCategory"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore'
import { useClientStore } from '~/src/stores/clientStore'
import { Category } from '@/src/repository/category/Category'
import { Product } from '@/src/repository/product/Product'

interface CategoryChanges {
  hasChanges: boolean;
  categoryToAdd: string | null;
  subCategoryToAdd: string | null;
  categoryToRemove: string | null;
  subCategoryToRemove: string | null;
}

const props = defineProps<{
  product: Product,
}>()

const emit = defineEmits<{
  (e: 'update:product', value: Product): void,
  (e: 'changes', value: CategoryChanges): void
}>()

const mainDisplayStore = useMainDisplayStore()
const clientStore = useClientStore()

// Single selection refs
const selectedCategory = ref<Category | null>(null)
const selectedSubCategory = ref<Category | null>(null)
const parentCategories = ref<Category[]>([])
const initialCategory = ref<string | null>(null)
const initialSubCategory = ref<string | null>(null)

const theClient = computed(() => clientStore.theClient)

const categoryButtons = [
  {
    icon: 'fa fa-pen',
    color: 'default',
    textColor:'#333333',
    action: (event: Event) => openCategoryEditor(event)
  }
]

// Compute changes
const categoryChanges = computed<CategoryChanges>(() => {
  const currentCategory = selectedCategory.value?.uuid || null
  const currentSubCategory = selectedSubCategory.value?.uuid || null

  return {
    hasChanges: currentCategory !== initialCategory.value || 
                currentSubCategory !== initialSubCategory.value,
    categoryToAdd: currentCategory !== initialCategory.value ? currentCategory : null,
    subCategoryToAdd: currentSubCategory !== initialSubCategory.value ? currentSubCategory : null,
    categoryToRemove: initialCategory.value !== currentCategory ? initialCategory.value : null,
    subCategoryToRemove: initialSubCategory.value !== currentSubCategory ? initialSubCategory.value : null
  }
})

const handleCategoryChange = (category: Category | null) => {
  console.log(category)
  selectedCategory.value = category
  if (category) {
    loadSubCategories(category)
  } else {

  }
  selectedSubCategory.value = null
}

const handleSubCategoryChange = (subCategory: Category | null) => {
  selectedSubCategory.value = subCategory
}

const loadParentCategories = async () => {
  try {
    parentCategories.value = await theClient.value.getCategories(1, 100, { depth: 0 })
    
    // Initialize selected categories from product
    if (props.product.categories?.length) {
      const parentCategory = parentCategories.value.find(
        cat => props.product.categories?.some(prodCat => prodCat.uuid === cat.uuid)
      )
      if (parentCategory) {
        selectedCategory.value = parentCategory
        initialCategory.value = parentCategory.uuid
        await loadSubCategories(parentCategory)
        
        // Find and set subcategory
        const subCategory = props.product.categories.find(cat => cat.parentUuid === parentCategory.uuid)
        if (subCategory) {
          selectedSubCategory.value = subCategory
          initialSubCategory.value = subCategory.uuid
        }
      }
    }
  } catch (error) {
    console.error('Error loading parent categories:', error)
  }
}

const loadSubCategories = async (parentCategory: Category) => {
  try {
    await parentCategory.getList()
  } catch (error) {
    console.error('Error loading sub categories:', error)
  }
}

const openCategoryEditor = (event: Event) => {
  event.stopPropagation()
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  showAddCategoryForm(new Category(null), triggerRect)
}

const openSubCategoryEditor = (event: Event) => {
  event.stopPropagation()
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)
  const newCategory = new Category(null)
  newCategory.parentUuid = selectedCategory.value?.uuid || ''

  selectedCategory.value?.subCategories?.push(newCategory)
  showAddCategoryForm(newCategory, triggerRect)
}

const showAddCategoryForm = (category: Category, triggerRect: DOMRect | undefined) => {
  mainDisplayStore.pushPopup({
    view: 'EditCategory',
    item: category,
    isOpen: true,
    triggerElement: triggerRect
  })
}

onMounted(async () => {
  console.log('mounting category selector')
  //await loadParentCategories()
})

watch(categoryChanges, (changes) => {
  console.log('emiting changed', changes)
  emit('changes', changes)
})

watch(
  () => props.product?.categories,
  () => {
    loadParentCategories()
  }
)
</script>