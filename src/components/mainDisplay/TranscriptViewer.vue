<template>
  <div v-if="currentItem" class="c-iframe">
    <p v-html="formatTranscription(currentItem.transcription)"></p>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'; // Added missing import
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';

const mainDisplayStore = useMainDisplayStore();
const { currentItem } = storeToRefs(mainDisplayStore);

const formatTranscription = (transcript: string) => {
  return transcript.replaceAll('Speaker', '<br><br> Speaker');
};
</script>

<style scoped>
h1 {
  color: #42b983;
}

.c-iframe {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>