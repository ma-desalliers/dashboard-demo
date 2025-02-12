<template>
  <SidePanel v-model="isVisible" :width="1000">
    <div v-html="pageContent"></div>
  </SidePanel>
</template>
<script lang="ts" setup>
import { usePageStore } from "~/src/stores/pageStore";
import { useHtmlGenerator } from "~/src/asset/composable/landingPageGenerator";
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const pageStore = usePageStore();
const htmlGenerator = useHtmlGenerator();

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

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
