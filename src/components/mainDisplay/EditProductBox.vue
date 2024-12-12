<template>
  <div class="row q-col-gutter-md q-pa-md">
    <div>
      <span class="c-box-title">Edit a product</span>
    </div>
    <div class="col-12">
      <q-input
        v-model="theProduct.name"
        label="Titre"
        outlined
        dense
      />
    </div>

    <div class="col-12">
      <textarea-input v-model="theProduct.description" input-style="min-height:150px" />
    </div>

    <category-selector class="col-12" v-model:product="theProduct" :client="theClient" @changes="(changes) =>categoryChanges = changes"></category-selector>

    <div class="col-6">
      <q-input
        v-model="theProduct.image"
        label="Image URL"
        outlined
        dense
      />
    </div>

    <div class="col-6">
      <q-file
        v-model="files"
        label="Files"
        outlined
        dense
        multiple
        counter
      >
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        v-model="theProduct.ctaName"
        label="CTA"
        outlined
        dense
      />
    </div>

    <div class="col-12 col-sm-6">
      <q-input
        v-model="theProduct.ctaLink"
        label="CTA Link"
        outlined
        dense
      />
    </div>
    <div class="row justify-start">
      <div>
        <q-btn size="sm" color="primary"  @click="openShowBenefits($event)" ></q-btn>
      </div>
    </div>
    <div class="q-pt-md row justify-end">
      <q-btn size="sm" color="positive" icon="save" label="save" @click="updateProduct"></q-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import { Client } from '@/src/repository/client/Client'
import { Product } from '~/src/repository/product/Product';

const mainDisplayStore = useMainDisplayStore();

// Modified to work with popup stack
const theProduct = computed(() => {
  const currentPopup = mainDisplayStore.popupStack.find((popup:any) => popup.view == 'EditProductBox')
  const item = currentPopup?.item;
  
  if (item instanceof Product) {
    return item;
  }
  if (item && 'uuid' in item) {
    return new Product(item);
  }
  return new Product(null);
});

const theClient = computed(() => {
  const currentPopup = mainDisplayStore.popupStack.find((popup:any) => popup.view == 'EditProductBox')
  return currentPopup?.client || new Client(null);
});

const categoryChanges = ref()
const imageUrl = ref('');
const url = ref('');
const files = ref<File[]>([]);

const height = ref('700px');
const width = ref('650px');

const emit = defineEmits(['mounted']);

const updateProduct = async () => {
  console.log(categoryChanges.value)
  if (theProduct.value) {
    try {
      let product = theProduct.value
      if (product.uuid) {
        await product.update()
      } else {
        product = await product.create()
        const currentPopup = mainDisplayStore.popupStack.find((popup:any) => popup.view == 'EditProductBox')
        if (currentPopup) {
          currentPopup.item = product
          
          if (currentPopup.client) {
            currentPopup.client.addProduct(product)
          }
        }
      }

      if (categoryChanges.value.hasChanges) {
        if (categoryChanges.value.categoryToRemove) {
          await product.removeCategory(categoryChanges.value.categoryToRemove)
        }
        if (categoryChanges.value.subCategoryToRemove) {
          await product.removeCategory(categoryChanges.value.subCategoryToRemove)
        }

        if (categoryChanges.value.categoryToAdd) {
          await product.addCategory(categoryChanges.value.categoryToAdd)
        }
        if (categoryChanges.value.subCategoryToAdd) {
          await product.addCategory(categoryChanges.value.subCategoryToAdd)
        }
      }

      mainDisplayStore.popPopup()
    } catch (error) {
      console.error('Error updating product and categories:', error)
      throw error
    }
  }
}

const openShowBenefits = (event:Event) =>{
  const triggerRect = mainDisplayStore.getPopupTriggerElement(event.currentTarget as HTMLElement)

  mainDisplayStore.pushPopup({
    triggerElement:triggerRect,
    item:theProduct.value.benefits,
    view:'WysywygEditor',
    isOpen:true
  })
}

onMounted(async () => {
  emit('mounted', {width: width.value, height: height.value});

  await theProduct.value.getCategories()
});

defineExpose({
  height,
  width
});
</script>

<style scoped>
.single-edit-box {
  /* Add any specific styles for the SingleEditBox component here */
}
</style>