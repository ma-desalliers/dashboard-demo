<template>
  <div class="column q-pt-sm full-width">
    <div class="row">
      <div class="col-6">
        <div class="c-section-title">
          {{ $t("content-distribution") }}
        </div>
        <div class="c-box-title">
          {{ $t("increase-content-visibility") }}
        </div>
      </div>
      <div class="col-6 row justify-end">
        <div>
          <q-btn color="green" :label="$t('generate-content')">
            <ComingSoonTooltip ></ComingSoonTooltip>
          </q-btn>
        </div>
      </div>
    </div>
    <CExpansionItem v-model="seoExpansion" title="Search Engine Optimization SEO" title-class="c-section-title" :default-opened="true">
      <SocialPostCard v-if="thePage" class="q-pb-sm" :platform-icon="'search engine'" :title="thePage.title" :description="$t('page-description')">
      </SocialPostCard>
    </CExpansionItem>

    <CExpansionItem v-model="socialmediaExpansion" :title="$t('social-media')" title-class="c-section-title" :default-opened="true">
      <div class="row  q-col-gutter-md q-pb-sm">
        <div class="col-6" v-for="i in [1, 2, 3, 4]">
          <SocialPostCard v-if="thePage" :title="thePage.title" :platform-icon="getPlatform(i).toLowerCase()" :platform-name="getPlatform(i)" :description="$t('social-media-content')">
          </SocialPostCard>
        </div>
      </div>
    </CExpansionItem>

    <CExpansionItem v-model="emailExpansion" :title="$t('email')" title-class="c-section-title" :default-opened="true">
      <div class="row  q-col-gutter-md q-pb-sm">
        <div class="col-6" v-for="i in [1, 2]">
          <SocialPostCard v-if="thePage" :title="thePage.title" :platform-icon="'newsletter'" :description="$t('mailing-description')">
          </SocialPostCard>
        </div>
      </div>
    </CExpansionItem>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { usePageStore } from "~/src/stores/pageStore";
import SocialPostCard from "../../SocialPostCard.vue";
const seoExpansion = ref(true)
const socialmediaExpansion = ref(true)
const emailExpansion = ref(true)

const pageStore = usePageStore();


const thePage = computed(() => pageStore.thePage);

const getPlatform = (index:number) =>{
  return ['LinkedIn','Facebook','X','Business'][index-1]
}

</script>