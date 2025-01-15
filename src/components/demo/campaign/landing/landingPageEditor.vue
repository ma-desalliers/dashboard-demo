<template>
  <div class="c-full-height q-pa-sm">
  <q-card flat class="landing-page-editor c-full-height ">
    <q-card-section class="q-pa-sm c-full-height">
      <ContentEditor :content="theContent" @edit="handleEdit" @comment="handleComment" />
    </q-card-section>
  </q-card>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLandingPageStore } from '~/src/stores/landingPageStore';
import ContentEditor from '~/src/components/demo/content/ContentEditor.vue';
import { useHtmlGenerator } from '~/src/asset/composable/landingPageGenerator';
import constant from '../../../../asset/constant/constant';

const { generateHtml} = useHtmlGenerator()

const landingPageStore = useLandingPageStore();
const theLandingPage = computed(() => landingPageStore.currentLandingPage)

const theContent = computed(()=>{

  if(!theLandingPage.value) return ''

  return generateHtml(theLandingPage.value.content, {buttonLink:'google.ca', mainColor: 'red'})
})

onMounted(() => {
});

const handleEdit = (element: any) => {
  console.log('Edit:', element);
  // Handle edit logic here
};

const handleComment = (element: any) => {
  console.log('Comment:', element);
  // Handle comment logic here
};
</script>

<style>
.landing-page-editor {
  /* Add styles for the landing page editor here */

  overflow:auto
}
</style>
