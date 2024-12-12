<template>
  <q-btn
    round
    size="sm"
    :icon="copied ? 'fa fa-check' : 'fa-solid fa-copy'"
    color="default"
    text-color="#333333"
    @click="copyToClipboard"
    :loading="loading"
  >
    <q-tooltip>{{ tooltipText }}</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from 'vue'
import { useQuasar } from 'quasar'

interface Props {
  copy: string,
  tooltipTitle :string
}

const props = defineProps<Props>()
const $q = useQuasar()
const copied = ref(false)
const loading = ref(false)
const tooltipText = computed(() => copied.value ? 'Copied!' : props.tooltipTitle )

const copyToClipboard = async () => {
  try {
    loading.value = true
    await navigator.clipboard.writeText(props.copy)
    copied.value = true
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Copied to clipboard !',
      position: 'top',
      timeout: 2000
    })

    // Reset the icon after 2 seconds
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to copy UUID',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}
</script>