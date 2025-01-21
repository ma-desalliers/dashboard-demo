<template>
  <DropdownBtn
    icon="more_vert"
    color="white"
    text-color="#333333"
    size="sm"
    :title="'Item Actions'"
    :description="'Choose an action to perform on this item'"
    action-button-text="Confirm"
    :show-header="false"
    :show-button="false"
    :onConfirm="handleConfirm"
    :dropdown-class="'c-q-pa-xs'"
  >
    <template #inputs="{ formData, 'onUpdate:formData': updateData }">
      <q-list class="q-pa-none" >
        <q-item class="q-pa-none">
          <q-item-section class="q-pa-none" >
            <div class="row q-col-gutter-md justify-center">
              <div>
                <ThreadBtn :thread-id="item.uuid" />
              </div>
              <div>
                <SimpleCopy :copy="item.uuid" tooltip-title="Copy ID" />
              </div>  
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </DropdownBtn>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DropdownBtn from './DropdownBtn.vue'

interface Props {
  item?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'edit', item: any): void
  (e: 'delete', item: any): void
  (e: 'duplicate', item: any): void
}>()

const handleEdit = () => {
  emit('edit', props.item)
}

const handleDelete = () => {
  emit('delete', props.item)
}

const handleDuplicate = () => {
  emit('duplicate', props.item)
}

// Dummy onConfirm handler since we're not using the confirm button
const handleConfirm = async () => {
  // This won't be called since showButton is false
}
</script>