<template>
  <q-btn-dropdown
    round
    dense
    :size="size"
    :color="color"
    :text-color="textColor"
    :disable="loading"
    dropdown-icon="none"
    class="c-dropdown-btn"
    :class="buttonClass"
  >
    <template #label>
      <q-icon :name="icon" :size="iconSize" />
    </template>

    <template #default>
      <q-list :class="props.dropdownClass" class="q-pa-md"  style="min-width: 175px">
        <q-item class="q-pa-none" v-if="showHeader">
          <q-item-section>
            <q-item-label class="text-h6">{{ title }}</q-item-label>
            <q-item-label caption class="q-mt-sm">{{ description }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-none">
          <q-item-section @click="handleSlotClick">
            <slot name="inputs" :formData="formData" @update:formData="updateFormData"></slot>
          </q-item-section>
        </q-item>

        <q-item class="q-pa-none" v-if="showButton">
          <q-item-section align="right">
            <div class="row q-gutter-sm">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                :color="actionButtonColor || color"
                :label="actionButtonText"
                :loading="loading"
                @click="handleAction"
                v-close-popup
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
const emit = defineEmits(['click'])
interface Props {
  icon?: string
  iconSize?: string
  color?: string
  textColor?:string
  size?: string
  title?: string
  description?: string
  actionButtonText?: string
  actionButtonColor?: string
  buttonClass?: string
  onConfirm: (formData: Record<string, any>) => Promise<void> | void
  showHeader?:boolean,
  showButton?:boolean
  dropdownClass?:string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'delete',
  //iconSize: '18px',
  color: 'secondary',
  size: 'sm',
  title: 'Confirm Action',
  description: 'Are you sure you want to proceed?',
  actionButtonText: 'Confirm',
  buttonClass: '',
  showHeader:true,
  showButton:true
})

const loading = ref(false)
const formData = reactive<Record<string, any>>({})

const updateFormData = (newData: Record<string, any>) => {
  Object.assign(formData, newData)
}

const handleAction = async () => {
  loading.value = true
  try {
    await props.onConfirm(formData)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSlotClick = (event: Event) => {
  event.stopPropagation
  emit('click', event)
}

</script>

<style scoped>
.q-btn-dropdown {
  width: 32px;
  height: 32px;
  min-height: unset;
  padding: 0;
}

.q-btn-dropdown :deep(.q-btn__content) {
  min-height: unset;
}

.q-btn-dropdown :deep(.q-btn-dropdown__arrow) {
  display: none;
}
</style>