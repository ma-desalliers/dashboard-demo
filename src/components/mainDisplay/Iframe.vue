<template>
  <div v-if="main.item"  class="c-iframe">
    <iframe class="c-iframe" :src="main.item"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';


const mainDisplayStore = useMainDisplayStore()
const { main } = storeToRefs(mainDisplayStore)

</script>

<style scoped>
h1 {
  color: #42b983;
}

.c-iframe{
  height:100%;
  width:100%;
}
</style>
