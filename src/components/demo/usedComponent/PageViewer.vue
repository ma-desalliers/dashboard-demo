<template>
  <div class="tabbed-viewer c-pl-32">
    <div class="content-info">
                    <div class="text-subtitle2 ">{{ page.title }}</div>
                    <div class="text-caption text-grey-7">
                      Blog post • {{ [''].join(' • ') || 'Minimize Waste' }}
                    </div>
                  </div>
    <q-tabs
      v-model="activeTab"
      class="text-grey row justift-start"
      active-color="primary"
      indicator-color="primary"
      a dense
        align="justify"
    >
      <q-tab name="preview" label="Content" />
      <q-tab name="details" label="Campaign" />
      <q-tab name="keywords" label="Seo" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <!-- Preview Panel -->
      <q-tab-panel name="preview">
        <div v-show="!isLoading" class="iframe-container">
          <iframe
            :src="iframeLink"
            title="content"
            class="custom-iframe"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <div v-show="isLoading" class="c-loader-container column justify-center items-center">
          <Loader color="#55B948" size="75px"></Loader>
        </div>
      </q-tab-panel>

      <!-- Details Panel -->
      <q-tab-panel name="details">
        <div class="text-h6">Hello from Details Panel</div>
      </q-tab-panel>

      <!-- Keywords Panel -->
      <q-tab-panel name="keywords">
        <div class="keywords-analysis q-pa-md">
          <!-- Header with title and search info -->
          <div class="row items-center q-mb-lg">
            <div class="text-h5 q-mr-md">{{ pageData.title }}</div>
            <div class="text-subtitle1 text-grey-8">
              {{ pageData.searches }} searches • <a href="#" class="text-primary">/{{ pageData.slug }}</a>
            </div>
          </div>

          <!-- Country Distribution -->
          <div class="row q-mb-lg">
            <div class="col-12 col-md-6">
              <div class="country-list">
                <div class="row items-center q-mb-sm">
                  <q-avatar size="20px">
                    <q-icon name="fa fa-flag" alt="France" />
                  </q-avatar>
                  <div class="q-ml-sm">France</div>
                  <div class="q-ml-auto">5.5K</div>
                  <div class="text-grey-6 q-ml-sm">27%</div>
                </div>
                <div class="row items-center q-mb-sm">
                  <q-avatar size="20px">
                    <q-icon name="fa fa-flag" alt="Russian Federation" />
                  </q-avatar>
                  <div class="q-ml-sm">Russian Federation</div>
                  <div class="q-ml-auto">2.8K</div>
                  <div class="text-grey-6 q-ml-sm">14%</div>
                </div>
                <div class="row items-center">
                  <q-avatar size="20px">
                    <q-icon name="fa fa-flag" alt="Korea" />
                  </q-avatar>
                  <div class="q-ml-sm">Korea</div>
                  <div class="q-ml-auto">1.7K</div>
                  <div class="text-grey-6 q-ml-sm">8%</div>
                </div>
              </div>
            </div>

            <!-- Page Format Info -->
            <div class="col-12 col-md-6">
              <div class="format-info q-pl-md">
                <div class="row justify-between q-mb-sm">
                  <div>Page format <q-icon name="info" size="xs" /></div>
                  <div>Product category</div>
                </div>
                <div class="row justify-between q-mb-sm">
                  <div>Words <q-icon name="info" size="xs" /></div>
                  <div>450-650 words</div>
                </div>
                <div class="row justify-between q-mb-sm">
                  <div>Headings <q-icon name="info" size="xs" /></div>
                  <div>8-16</div>
                </div>
                <div class="row justify-between">
                  <div>Images <q-icon name="info" size="xs" /></div>
                  <div>4-16</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Keywords Section -->
          <div class="keywords-section q-mb-lg">
            <div class="text-subtitle1 q-mb-md">13 keywords</div>
            <q-table
              flat
              :rows="keywords"
              :columns="[
                { name: 'keyword', align: 'left', label: 'Keywords', field: 'keyword' },
                { name: 'intent', align: 'left', label: 'Intent', field: 'intent' },
                { name: 'kd', align: 'right', label: 'KD', field: 'kd' },
                { name: 'volume', align: 'right', label: 'Vol.', field: 'volume' }
              ]"
              :pagination="{ rowsPerPage: 0 }"
              row-key="keyword"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="keyword" :props="props">
                    {{ props.row.keyword }}
                    <q-badge v-if="props.row.tag" color="grey-8" class="q-ml-sm">
                      {{ props.row.tag }}
                    </q-badge>
                  </q-td>
                  <q-td key="intent" :props="props">
                    <div class="row q-gutter-x-xs">
                      <q-badge v-for="badge in props.row.intent" 
                              :key="badge"
                              :color="getIntentColor(badge)"
                              rounded>
                        {{ badge }}
                      </q-badge>
                    </div>
                  </q-td>
                  <q-td key="kd" :props="props">{{ props.row.kd }}</q-td>
                  <q-td key="volume" :props="props">{{ props.row.volume }}</q-td>
                </q-tr>
              </template>
            </q-table>
          </div>

          <!-- Competitors Section -->
          <div class="competitors-section">
            <div class="text-subtitle1 q-mb-md">Top 10 competitors</div>
            <q-table
              flat
              :rows="pageData.competitors"
              :columns="[
                { name: 'domain', align: 'left', label: 'Domain', field: 'domain' },
                { name: 'url', align: 'left', label: 'URL', field: 'url' }
              ]"
              :pagination="{ rowsPerPage: 0 }"
              row-key="domain"
              hide-bottom
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="domain" :props="props">
                    <div class="row items-center">
                      <q-avatar size="20px" class="q-mr-sm">
                        <img :src="props.row.icon" :alt="props.row.domain" />
                      </q-avatar>
                      {{ props.row.domain }}
                    </div>
                  </q-td>
                  <q-td key="url" :props="props">
                    <a :href="props.row.url" class="text-primary" target="_blank">
                      {{ props.row.path }}
                      <q-icon name="launch" size="xs" />
                    </a>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const activeTab = ref('preview')
const isLoading = ref(false)

const page = toRef(props, 'page')
const iframeLink = ref('')

// Keywords table configuration
const columns = [
  { name: 'keyword', align: 'left', label: 'Keywords', field: 'keyword' },
  { name: 'kd', align: 'center', label: 'KD', field: 'kd' },
  { name: 'volume', align: 'center', label: 'Volume', field: 'volume' }
]

const keywords = ref([
  { keyword: 'seo optimization for google', tag: 'MAIN', kd: 83, volume: '1,900' },
  { keyword: 'google seo', tag: 'I', kd: 73, volume: '1,900' },
  { keyword: 'google seo marketing', tag: 'T', kd: 86, volume: '1,900' },
  { keyword: 'google seo optimization', kd: 88, volume: '1,900' },
  { keyword: 'search engine optimisation google', kd: 91, volume: '1,900' }
])

const pageData = reactive({
  title: "sandblasting equipements",
  searches: 15000,
  slug: "sandblasting-equipment",
  countries: [
    { 
      name: "France", 
      searches: "5.5K", 
      percentage: "27%", 
      code: "fr" 
    },
    { 
      name: "Russian Federation", 
      searches: "2.8K", 
      percentage: "14%", 
      code: "ru" 
    },
    { 
      name: "Korea", 
      searches: "1.7K", 
      percentage: "8%", 
      code: "kr" 
    }
  ],
  format: {
    type: "Product category",
    words: "450-650 words",
    headings: "8-16",
    images: "4-16"
  },
  keywords: [
    { 
      keyword: "seo optimization for google",
      tag: "MAIN",
      intent: ["N", "C"],
      kd: 83,
      volume: "1,900"
    },
    { 
      keyword: "google seo",
      intent: ["I"],
      kd: 73,
      volume: "1,900"
    },
    { 
      keyword: "google seo marketing",
      intent: ["T"],
      kd: 86,
      volume: "1,900"
    },
    { 
      keyword: "google seo optimization",
      kd: 88,
      volume: "1,900"
    },
    { 
      keyword: "google seo search engine optimization",
      kd: 88,
      volume: "1,900"
    },
    { 
      keyword: "search engine optimisation google",
      kd: 91,
      volume: "1,900"
    },
    { 
      keyword: "search engine optimization on google",
      kd: 87,
      volume: "1,900"
    },
    { 
      keyword: "search optimization google",
      tag: "+1",
      kd: 79,
      volume: "1,900"
    },
    { 
      keyword: "seo and google",
      tag: "+1",
      kd: 88,
      volume: "1,900"
    },
    { 
      keyword: "seo in google",
      kd: 88,
      volume: "1,900"
    }
  ],
  competitors: [
    {
      domain: "blog.hubspot.com",
      icon: "https://www.google.com/s2/favicons?domain=blog.hubspot.com",
      path: "/marketing/seo",
      url: "https://blog.hubspot.com/marketing/seo"
    },
    {
      domain: "developers.google.com",
      icon: "https://www.google.com/s2/favicons?domain=developers.google.com",
      path: "/search/docs/fundamentals/seo-starter-guide",
      url: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
    },
    {
      domain: "en.wikipedia.org",
      icon: "https://www.google.com/s2/favicons?domain=en.wikipedia.org",
      path: "/wiki/Search_engine_optimization",
      url: "https://en.wikipedia.org/wiki/Search_engine_optimization"
    },
    {
      domain: "mailchimp.com",
      icon: "https://www.google.com/s2/favicons?domain=mailchimp.com",
      path: "/marketing-glossary/seo/",
      url: "https://mailchimp.com/marketing-glossary/seo/"
    },
    {
      domain: "moz.com",
      icon: "https://www.google.com/s2/favicons?domain=moz.com",
      path: "/beginners-guide-to-seo",
      url: "https://moz.com/beginners-guide-to-seo"
    },
    {
      domain: "mtu.edu",
      icon: "https://www.google.com/s2/favicons?domain=mtu.edu",
      path: "/umc/services/websites/seo/",
      url: "https://mtu.edu/umc/services/websites/seo/"
    },
    {
      domain: "neilpatel.com",
      icon: "https://www.google.com/s2/favicons?domain=neilpatel.com",
      path: "/what-is-seo/",
      url: "https://neilpatel.com/what-is-seo/"
    },
    {
      domain: "optimizely.com",
      icon: "https://www.google.com/s2/favicons?domain=optimizely.com",
      path: "/optimization-glossary/search-engine-optimization/",
      url: "https://optimizely.com/optimization-glossary/search-engine-optimization/"
    },
    {
      domain: "searchengineland.com",
      icon: "https://www.google.com/s2/favicons?domain=searchengineland.com",
      path: "/guide/what-is-seo",
      url: "https://searchengineland.com/guide/what-is-seo"
    },
    {
      domain: "semrush.com",
      icon: "https://www.google.com/s2/favicons?domain=semrush.com",
      path: "/blog/what-is-seo/",
      url: "https://semrush.com/blog/what-is-seo/"
    },
    {
      domain: "techtarget.com",
      icon: "https://www.google.com/s2/favicons?domain=techtarget.com",
      path: "/whatis/definition/search-engine-optimization-SEO",
      url: "https://www.techtarget.com/whatis/definition/search-engine-optimization-SEO"
    }
  ]
})

// Helper function for intent badge colors
const getIntentColor = (intent: string) => {
  const colors: Record<string, string> = {
    N: 'green-2',
    C: 'green-8',
    I: 'light-green-2',
    T: 'blue-8'
  }
  return colors[intent] || 'grey-5'
}

const getTagColor = (tag: string) => {
  const colors = {
    MAIN: 'primary',
    I: 'green',
    T: 'blue'
  }
  return colors[tag as keyof typeof colors] || 'grey'
}

const showLoader = (page: any) => {
  isLoading.value = true
  console.log('showing loader')
  iframeLink.value = `https://ai.cameleonmedia.com/content/${page.uuid}`

  window.setTimeout(() => {
    isLoading.value = false
  }, 2500)
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
  max-height: 90vh;
  height:90vh;
  position: sticky;
  top: 32px;
}

.iframe-container {
  position: relative;
  border: solid 1px #e7e7e7;
  border-radius: 4px;
  iframe {
    box-shadow: none;
  }
}

.custom-iframe {
  width: 100%;
  height: calc(100vh - 100px);
  background: white;
  transition: box-shadow 0.3s ease;
}

.keywords-panel {
  .stats-section {
    .q-card {
      height: 100%;
    }
  }
}

:deep(.q-tab-panel) {
  padding: 16px 0;
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

.c-loader-container{
  min-height:500px
}
</style>