<template>
  <q-toolbar v-if="isVisible" class="c-header bg-primary relative-position">
    <span class="text-white absolute-center" style="font-size: 1rem; font-weight: 300">
      New Functionality Available!
    </span>
    <q-btn
      flat
      dense
      icon="close"
      class="text-white absolute-right q-mr-md"
      @click="closeBar"
    />
  </q-toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isVisible = ref(true)

const closeBar = () => {
  isVisible.value = false
}


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
