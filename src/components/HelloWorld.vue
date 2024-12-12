<template>
  <div>
    <h1>{{ currentClientId }}</h1>
    <p v-if="currentItem">{{ currentItem.description }}</p>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent } from 'vue';
import { useMainDisplayStore } from '@/src/stores/mainDisplayStore';


const mainDisplayStore = useMainDisplayStore()
const { currentItem, currentClientId } = storeToRefs(mainDisplayStore)

</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
