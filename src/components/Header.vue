<template>
  <q-toolbar class="c-header bg-primary">
    <div class="full-width row justify-center">
      <span class="text-white" style="font-size: 1.2rem">
        New Functionality Available ! 
      </span> 
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const currentTab = ref('demo');
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
