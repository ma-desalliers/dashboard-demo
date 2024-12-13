<template>
  <div class="tabbed-viewer q-px-md">
    <div v-show="!isLoading" class="iframe-container">
      <iframe
        :src="iframeLink"
        class="custom-iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <div v-show="isLoading" class="c-loader-container">
      <Loader color="#55B948" size="75px" ></Loader>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'update:channels', selectedChannels: string[]): void
}>()

interface Product {
  audience: string
  responsibility: string
  tasks: string
}

interface TargetAudience {
  audience: string
  desiredOutcome: string
  tasks: string
}

const props = defineProps<{
  page?: any
}>()

const activeTab = ref('iframe')
const isLoading = ref(false)

const page = toRef(props, 'page')
const iframeLink = ref('')

const tabs = [
  { name: 'iframe', label: 'Preview' },
  { name: 'details', label: 'Details' }
]


const showLoader = (page:any) =>{
  isLoading.value = true;
  console.log('showing loader')
  iframeLink.value = `https://ai.cameleonmedia.com/content/${page.uuid}`

  window.setTimeout(()=>{
      isLoading.value = false
  }, 3500)
}

watch(page, (newValue) => {
  if (newValue) {
    showLoader(newValue)
  }
}, { deep: true })

</script>

<style scoped lang="scss">
.tabbed-viewer {
  max-width: 1200px;
  margin: 0 auto;
  max-height: 90vw;
  position:sticky;

  top:32px;
}

.iframe-container {
  position: relative;
  border:solid 1px #e7e7e7;
  border-radius: 4px;
  iframe{
   box-shadow: none;
  }
}

.custom-iframe {
  width: 100%;
  height: calc(100vh - 100px);
  background: white;
  transition: box-shadow 0.3s ease;

  &:hover {
  }
}

.section-container {
  padding: 16px;
  background: white;
  border-radius: 8px;
}

:deep(.q-tab-panel) {
  padding: 16px;
  min-height: 400px;
}

:deep(.q-tabs) {
  .q-tab {
    padding: 8px 16px;
    min-height: 40px;
    
    &--active {
      font-weight: 600;
    }
  }
}

:deep(.q-img) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>