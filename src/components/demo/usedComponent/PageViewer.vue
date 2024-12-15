<template>
  <div class="tabbed-viewer c-pl-32">

    <q-tabs
      align="left"
      v-model="activeTab"
      class="text-grey q-tabs__content--align-left"
      active-color="primary"
      indicator-color="primary"
      dense
    >
      <q-tab name="preview" label="Content" class="c-tab-padding" style="flex:unset" />
      <q-tab name="details" label="Campaign" class="c-tab-padding q-mx-md" style="flex:unset" />
      <q-tab name="keywords" label="Seo" class="c-tab-padding" style="flex:unset" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" :class="{'c-scroll': activeTab == 'keywords'}"  >
      <!-- Preview Panel -->
      <q-tab-panel name="preview">
        <div class="iframe-container">
          <iframe
            :src="iframeLink"
            title="content"
            class="custom-iframe"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>

        <div v-show="isLoading" class="c-loader-container">
          <Loader color="#55B948" size="75px"></Loader>
        </div>
      </q-tab-panel>

      <!-- Details Panel -->
      <q-tab-panel name="details">
        <div class="c-section-title">Campaign information coming soon ! </div>
      </q-tab-panel>

      <!-- Keywords Panel -->
      <q-tab-panel name="keywords">
        <div class="keywords-analysis q-pa-md">
          <!-- Header with title and search info -->
          <div class="row items-center q-mb-lg">
            <div class="c-section-title q-mr-md">{{ pageData?.pageTitle }}</div>
            <div class="text-subtitle1 text-grey-8">
              {{ pageData?.primaryKeyword?.keyword }} searches • <a href="#" class="text-primary slug-text">/{{ pageData?.primaryKeyword?.keyword.replaceAll(' ','-')}}</a>
            </div>
          </div>

          <!-- Country Distribution -->
          <div class="row q-mb-lg">
            <div class="col-12 col-md-5 c-border-right q-pr-sm">
              <div class="country-list">
                <div v-if="pageData?.primaryKeyword?.countryRepartition[0]" class="row items-center q-mb-sm" style="min-width: 195px;">
                  <q-avatar size="20px">
                    <span class="fi fi-us" alt="usa" ></span>  
                  </q-avatar>
                  <div class="q-ml-sm country-name">{{ pageData?.primaryKeyword?.countryRepartition[0].country }}
                    <q-linear-progress
                      :value="0.27"
                      size="xs"
                      color="blue"
                      track-color="grey1"
                      class="progress-bar"
                    />
                  </div>
                  <div class="q-ml-auto" style="min-width:30px">{{ pageData?.primaryKeyword?.countryRepartition[0].searchVolume }}</div>
                  <div class="text-grey-6 text-right" style="min-width:30px">{{Math.round(pageData?.primaryKeyword?.countryRepartition[0].searchVolume * 100 / totalVolume)}}%</div>
                </div>
                <div v-if="pageData?.primaryKeyword?.countryRepartition[1]" class="row items-center q-mb-sm" style="min-width: 195px;padding-top:1px">
                  <q-avatar size="20px">
                    <span class="fi fi-ca" alt="canada" ></span>  
                  </q-avatar>
                  <div class="q-ml-sm country-name">{{ pageData?.primaryKeyword?.countryRepartition[1].country }}
                    <q-linear-progress
                      :value="0.14"
                      size="xs"
                      color="blue"
                      track-color="grey1"
                      class="progress-bar"
                    />
                  </div>
                  <div class="q-ml-auto" style="min-width:30px">{{ pageData?.primaryKeyword?.countryRepartition[1].searchVolume }}</div>
                  <div class="text-grey-6 text-right" style="min-width:30px">{{Math.round(pageData?.primaryKeyword?.countryRepartition[1].searchVolume * 100 / totalVolume)}}%</div>
                </div>
                <div v-if="pageData?.primaryKeyword?.countryRepartition[2]" class="row items-center" style="min-width: 195px;padding-top:1px">
                  <q-avatar size="20px">
                    <span class="fi fi-fr" alt="France" ></span>  
                  </q-avatar>
                  <div class="q-ml-sm country-name">{{ pageData?.primaryKeyword?.countryRepartition[2].country }}
                    <q-linear-progress
                      :value="0.01"
                      size="xs"
                      color="primary"
                      track-color="grey1"
                      class="progress-bar"
                    />
                  </div>
                  <div class="q-ml-auto text-right" style="min-width:30px">1.7K</div>
                  <div class="text-grey-6 text-right" style="min-width:30px">8%</div>
                </div>
              </div>
            </div>

            <!-- Page Format Info -->
            <div class="col-12 col-md-7 ">
              <div class="format-info q-pl-sm">
                <div class="row justify-between q-mb-sm">
                  <div class="col-6">Page format <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
                  <div class="col-6">Product category</div>
                </div>
                <div class="row justify-between q-mb-sm">
                  <div class="col-6">Words <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
                  <div class="col-6">450-650 words</div>
                </div>
                <div class="row justify-between q-mb-sm">
                  <div class="col-6">Headings <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
                  <div class="col-6">8-16</div>
                </div>
                <div class="row justify-between">
                  <div class="col-6">Images <Tooltip :title="'Content Marketing'" :description="'this is a description '" ></Tooltip></div>
                  <div class="col-6">4-16</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Keywords Section -->
          <div class="keywords-section q-mb-lg">
            <q-expansion-item
              default-opened
              group="keywords"
              icon="search"
              :label="`${pageKeywords.length} keywords`"
              header-class="text-subtitle1"
              expand-separator
              :class="{ 'custom-expansion': true }"
              :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
            >
              <template v-slot:header>
                <q-item-section>
                  <q-item-label class="text-subtitle1">{{ pageKeywords.length }} keywords</q-item-label>
                </q-item-section>
              </template>

              <div class="content-wrapper c-pa-none">
                <q-card flat v-if="pageData">
                  <q-card-section class="q-pa-none bg-white">
                    <q-table
                      flat
                      :rows="pageKeywords"
                      :columns="columns"
                      :pagination="{ rowsPerPage: 0 }"
                      row-key="keyword"
                      hide-bottom
                      class='c-no-border'
                    >
                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td key="keyword" :props="props">
                            {{ props.row?.keyword }}
                          </q-td>
                          <q-td key="intent" :props="props" >
                            <div class="row q-gutter-x-xs q-pr-md q-mx-none justify-end">
                              <q-badge
                                v-for="badge in props.row.tag"
                                :key="badge"
                                :color="getIntentColor(badge)"
                                square
                                size="24px"
                                class="q-pa-sm"
                              >
                                {{ badge }}
                              </q-badge>
                            </div>
                          </q-td>
                          <q-td key="volume" :props="props">{{ props.row.globalSearchVolume }}</q-td>
                          <q-td key="kd" :props="props">{{ props.row.keywordDifficulty }}</q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </q-card-section>
                </q-card>
              </div>
            </q-expansion-item>
          </div>

          <!-- Competitors Section -->
          <div class="competitors-section">
            <q-expansion-item
              group="competitors"
              icon="public"
              :label="`Top ${pageData?.primaryKeyword} competitors`"
              header-class="text-subtitle1"
              expand-separator
              :class="{ 'custom-expansion': true }"
              :style="{ '--expansion-bg-color': 'var(--main-gray)' }"
            >
              <template v-slot:header>
                <q-item-section>
                  <q-item-label class="text-subtitle1">Top {{ pageDatas.competitors.length }} competitors</q-item-label>
                </q-item-section>
              </template>

              <div class="content-wrapper c-pa-none">
                <q-card flat>
                  <q-card-section class="q-pa-none bg-white">
                    <q-table
                      flat
                      :rows="pageDatas.competitors"
                      :columns="[
                        { name: 'domain', align: 'left', label: 'Domain', field: 'domain' },
                        { name: 'url', align: 'left', label: 'URL', field: 'url' }
                      ]"
                      :pagination="{ rowsPerPage: 0 }"
                      row-key="domain"
                      hide-bottom
                      class="c-no-border"
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
                  </q-card-section>
                </q-card>
              </div>
            </q-expansion-item>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import seo from '~/src/repository/seo';


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
  { name: 'intent', align: 'center', label: 'Intent', field: 'intent' },
  { name: 'volume', align: 'center', label: 'Vol.', field: 'volume' },
  { name: 'kd', align: 'center', label: 'KD', field: 'kd' },
]

const keywords = ref([
  { keyword: 'seo optimization for google', tag: ['C', 'I'], kd: 83, volume: '1,900' },
  { keyword: 'google seo', tag: ['N'], kd: 73, volume: '1,900' },
  { keyword: 'google seo marketing', tag: ['T'], kd: 86, volume: '1,900' },
  { keyword: 'google seo optimization', kd: 88, volume: '1,900' },
  { keyword: 'search engine optimisation google', kd: 91, volume: '1,900' }
])

const pageData = computed(()=>{
  return seo.find(s => s.pageUuid == page.value.uuid)
})

const pageKeywords = computed(()=>{
  const  value = [pageData.value?.primaryKeyword, ...(pageData.value? pageData.value?.secondaryKeywords: [])]
  console.log(value)
  if(value[0] == undefined) return []

  return value
})

const pageDatas = reactive({
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
    }
  ]}
)

const totalVolume = computed(()=>{
  return pageData.value?.primaryKeyword.countryRepartition.reduce((aug, country)=>{ return aug + country.searchVolume},0) || 1
})

// Helper function for intent badge colors
const getIntentColor = (intent: string) => {
  const colors: Record<string, string> = {
    N: 'blue-8',
    C: 'green-8',
    I: 'green-6',
    T: 'blue-8'
  }
  return colors[intent] || 'grey-5'
}

const getTagColor = (tag: string) => {
  const colors = {
    MAIN: 'primary',
    I: '#f9f9f9',
    T: 'blue'
  }
  return colors[tag as keyof typeof colors] || 'grey'
}

const showLoader = (page: any) => {
  isLoading.value = true
  console.log('showing loader')
  iframeLink.value = `https://ai.cameleonmedia.com/page/${page.uuid}`

  window.setTimeout(() => {
    isLoading.value = false
  }, 6200)
}

watch(page, (newValue) => {
  if (newValue) {
    showLoader(newValue)
  }
}, { deep: true })


watch(activeTab, (newValue) => {
  if (newValue == 'preview') {
    showLoader(props.page)
  }
})
</script>

<style scoped lang="scss">
.tabbed-viewer {
  max-width: 1200px;
  margin: 0 auto;
  max-height: 90vh;
  height:90vh;
  position: sticky;
  top: 25px;
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

.slug-text{
  text-transform: lowercase;

}

.c-scroll{
  max-height:calc(100% - 100px);
  overflow:overlay !important;
}

:deep(.q-tab-panel) {
  padding: 0 0;
  min-height: 400px;
}

:deep(.q-tabs) {
  .q-tab {
    padding: 8px 8px;
    min-height: 25px;
    
    &--active {
      font-weight: 600;
    }
  }
}

:deep(.q-table th, .q-table td) {
  padding: 7px 0px;
}

:deep(.q-table td){
  padding: 7px 0px;

}

.c-loader-container{
  position:absolute;
  inset:0;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.keywords-analysis{
  height:calc(100% - 50px);
  overflow:auto
}



.country-name{
  min-width:100px;
}
</style>