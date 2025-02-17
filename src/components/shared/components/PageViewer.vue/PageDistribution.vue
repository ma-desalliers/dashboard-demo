<template>
  <div class="column q-col-gutter-sm q-py-sm">
    <div class="row">
      <div class="col-6">
        <div class="c-section-title">
          {{ $t("content-distribution") }}
        </div>
        <div class="c-box-title">
          {{ $t("increase-content-visibility") }}
        </div>
      </div>
      <div class="col-6">
        <q-btn color="green" :label="$t('generate-content')"></q-btn>
      </div>
    </div>
    <CExpansionItem v-model="seoExpansion" title="Search Engine Optimization SEO" title-class="c-section-title">
      <SocialPostCard v-if="thePage" :title="thePage.title" description="This is the meta description ">
      </SocialPostCard>
    </CExpansionItem>

    <CExpansionItem v-model="socialmediaExpansion" :title="$t('social-media')" title-class="c-section-title">
      <div class="row  q-col-gutter-md">
        <div class="col-6" v-for="i in [1, 2, 3, 4]">
          <SocialPostCard v-if="thePage" :title="thePage.title" description="This is the meta description ">
          </SocialPostCard>
        </div>
      </div>
    </CExpansionItem>

    <CExpansionItem v-model="emailExpansion" :title="$t('email')" title-class="c-section-title">
      <div class="row  q-col-gutter-md">
        <div class="col-6" v-for="i in [1, 2]">
          <SocialPostCard v-if="thePage" :title="thePage.title" description="this is the mailing content">
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
const seoExpansion = ref(false)
const socialmediaExpansion = ref(false)
const emailExpansion = ref(false)

const pageStore = usePageStore();


const thePage = computed(() => pageStore.thePage);

</script>