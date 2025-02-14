<template>
    <div v-html="pageContent"></div>
</template>
<script lang="ts" setup>
import { usePageStore } from "~/src/stores/pageStore";
import { useHtmlGenerator } from "~/src/asset/composable/landingPageGenerator";


const pageStore = usePageStore();
const htmlGenerator = useHtmlGenerator();


const pageContent = computed(() => {
  console.log('computed',pageStore.thePage)
  if(pageStore.thePage?.sections)
  return htmlGenerator.generateHtml(pageStore.thePage.sections, {buttonLink:'google.ca', mainColor: 'red'});
});
</script>
<style lang="scss">
@import url('src/styles/landingPage/style.css');

#cameleon-landing-page .section .section-content {
  width:unset;
}

#cameleon-landing-page .section {
width: unset;
margin: unset;
}
</style>
