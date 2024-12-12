<template>
  <div class="tabbed-viewer q-px-md">
    <div class="iframe-container">
      <iframe
        :src="`https://ai.cameleonmedia.com/content/${page.uuid}`"
        class="custom-iframe"
        frameborder="0"
        allowfullscreen
      ></iframe>
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

const tabs = [
  { name: 'iframe', label: 'Preview' },
  { name: 'details', label: 'Details' }
]

const channels = ref([
  { id: 'website', label: 'Website', icon: 'img:/wordpress.svg', selected: false },
  { id: 'seo', label: 'SEO (Search Engine Optimization)', icon: 'img:/google.svg', selected: false },
  { id: 'newsletter', label: 'Newsletter', icon: 'mail', selected: false },
  { id: 'linkedin', label: 'LinkedIn', icon: 'img:/linkedin.svg', selected: false },
  { id: 'facebook', label: 'Facebook', icon: 'img:/linkedin.svg', selected: false },
  { id: 'gmb', label: 'Google My Business', icon: 'img:/linkedin.svg', selected: false },
  { id: 'twitter', label: 'Twitter', icon: 'img:/linkedin.svg', selected: false },
  { id: 'ppc', label: 'Pay per Click', icon: 'payments', selected: false },
  { id: 'nurturing', label: 'Lead nurturing', icon: 'trending_up', selected: false }
])

const toggleChannel = (channel:any) => {
  channel.selected = !channel.selected
  emit('update:channels', channels.value.filter(c => c.selected).map(c => c.id))
}

</script>

<style scoped lang="scss">
.tabbed-viewer {
  max-width: 1200px;
  margin: 0 auto;
  max-height: 680px;
}

.iframe-container {
  position: relative;
  iframe{
   box-shadow: none;
  }
}

.custom-iframe {
  width: 100%;
  height: 670px;
  border-radius: 4px;
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