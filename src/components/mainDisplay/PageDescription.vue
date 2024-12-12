<template>
    <!-- Main Grid -->
    <div v-if="thePage" class="row q-col-gutter-md">
      <!-- Left Column -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-mb-md">
          <q-card-section>
            <div class="row justify-between q-mb-md">
              <div class="c-box-title">PAGE OUTLINE</div>
              <div class="row q-col-gutter-md">
                <div>
                  <thread-btn :thread-id="thePage.uuid"></thread-btn>
                </div>
              </div>
            </div>
            <div class="text-h5 q-mt-md">{{ thePage.title }}</div>
              <q-item class="q-pl-none q-pt-md">
                <q-item-section>
                  <div v-if="thePage.contentIsGenerated">
                    <div v-html="pageOutline"></div>
                    <div class="row justify-center items-center q-col-gutter-md q-pt-md">
                      <div>
                        <q-btn color="primary" :href="`https://ai.cameleonmedia.com/content/${thePage.uuid}`" target="_blank"><q-item-label>Open the page</q-item-label></q-btn>
                      </div>
                      <div>
                        <q-btn-dropdown
                          round
  
                          color="primary"
                          dropdown-icon="none"
                          class="c-dropdwn-btn"
                        >
                          <template #label>
                            <q-icon name="mail" size="18px" />
                          </template>

                          <template #default>
                            <q-list class="q-py-md" style="min-width: 250px">
                              <q-item>
                                <q-item-section>
                                  <q-item-label class="text-h6">Confirm Email</q-item-label>
                                  <q-item-label caption class="q-mt-sm">
                                    Confirm sending page
                                  </q-item-label>
                                </q-item-section>
                              </q-item>

                              <q-item>
                                <q-item-section align="right">
                                  <div class="row q-gutter-sm">
                                    <q-btn flat label="Cancel" v-close-popup />
                                    <q-btn
                                      color="positive"
                                      label="Send it!"
                                      @click="sendPage()"
                                      v-close-popup
                                    />
                                  </div>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </template>
                        </q-btn-dropdown>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="column">
                      <span>The Content has not been generated yet</span>
                      <language-select v-if="thePage.language" class="q-mt-md" v-model="thePage.language"></language-select>
                      <q-btn class="q-mt-md" color="primary" @click="generateThePage()"><q-item-label>GENERATE DE PAGE</q-item-label></q-btn>
                    </div>
                  </div>
                </q-item-section>
              </q-item>
          </q-card-section>
        </q-card>

        <q-card v-if="thePage.contentIsGenerated" flat bordered>
          <q-card-section>
            <div class="c-box-title">PAGE FEEDBACK</div>
            <q-item class="q-pl-none q-pt-md column">
              <div class="row justify-between">
                <div class="col-6">
                  <q-select
                    outlined
                    v-model="thePage.score"
                    :options="[1,2,3,4,5,6,7,8,9,10]"
                    label="Rate this page"
                    class="q-mb-md full-width"
                  />
                </div>

                <!-- Thumbs Up/Down Selection -->
                <div class="q-mb-md">
                  <div></div>
                  <div class="text-subtitle2 q-mb-sm">Feedback</div>
                  <div class="row q-gutter-md">
                    <q-btn
                      flat
                      round
                      color="positive"
                      :icon="thePage.contentIsGenerated ? 'thumb_up' : 'thumb_up_off_alt'"
                      @click="setFeedback('up')"
                    />
                    <q-btn
                      flat
                      round
                      color="negative"
                      :icon="thePage.contentIsGenerated ? 'thumb_down' : 'thumb_down_off_alt'"
                      @click="setFeedback('down')"
                    />
                  </div>
                </div>
              </div>

              <!-- Comment Textarea -->
              <q-input
                v-model="thePage.comment"
                type="textarea"
                outlined
                label="Additional comments"
                class="full-width"
                rows="4"
              />
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Column -->
      <div class="col-12 col-md-8">
      
        <!-- Featured Resources Section -->
        <q-card flat bordered>
          <q-card-section>
            <div class="row justify-between">
              <span class="c-box-title">FEATURED RESOURCES</span>
              <div>
                <q-btn flat round icon="edit" />
              </div>
            </div>
            <div class="row items-center q-mt-md">
              <q-img
                :src="thePage.croImageUrl"
                style="width: 100px"
                class="rounded-borders"
              />
              <div class="col q-ml-md">
                <div v-html="thePage.cro?.content"></div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
</template>

<script lang="ts" setup>


import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';
import type { Pages } from '@/src/repository/pages/Page';
import { Persona } from '@/src/repository/persona/Persona';
import type { Product } from '~/src/repository/product/Product';
import LanguageSelect from '@/src/components//utilities/LanguageSelect.vue';
//import { Pages } from '~/src/repository/pages/Page';

const mainDisplayStore = useMainDisplayStore()


const thePage =  computed(()=>{
  return mainDisplayStore.main.item as Pages
})

const pageOutline = computed(()=>{
  if(thePage.value && thePage.value.outline){
  return thePage.value.outline.content.replaceAll('<h2>', '').replaceAll('</h2>', '</br>').replace(/<h1>.*?<\/h1>/gs, '')
  }
  return ''
})

const update = async (item:any)=>{
  item.update()
}

const setFeedback = (value:string) =>{


}

const generateThePage = async () =>{
  await thePage.value.generate()
}

const sendPage = async () =>{
  await thePage.value.email()
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin-bottom: 4px;
}
</style>