<template>
  <q-toolbar class="items-stretch c-header justify-between">
    <q-tabs
      v-model="currentTab"
      active-color="green"
      indicator-color="green"
      align="left"
    >
      <q-tab name="clients" label="Clients" @click="navigateTo('clients')" />
      <q-tab name="seo" label="SEO" @click="navigateTo('seo')" />
      <q-tab name="dashboard" label="Dashboard" @click="navigateTo('dashboard')" />
    </q-tabs>
    <q-toolbar-title class="c-flex-unset q-pa-sm">
      <img src="/logo.png.jpg" alt="Logo" height="45" />
    </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const currentTab = ref('clients');
const router = useRouter();

const navigateTo = (page: string) => {
  router.push(`/${page}`);
};
</script>

<style lang="scss">
.c-header {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 1px 1px 5px #e0e0e0;

  .q-tab__label{
    font-size:16px;
  }
}

.c-items-start {
  align-items: start !important;
}

.c-flex-unset {
  flex: unset !important;
}
</style>
