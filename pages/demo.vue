<template>
  <div>
    <p>{{ $t('welcome') }}</p>
    <MainPage class='right-column-container'></MainPage>
  </div>
</template>

<script setup lang="ts">
import MainPage from '~/src/components/demo/MainPage.vue';

definePageMeta({
  middleware: ['auth', 'company']
})


</script>

<style scoped>
</style>
