<template>

    <!-- Desktop View -->
    <div v-if="!isMobile" :class="classList">
      <slot></slot>
    </div>

    <!-- Mobile View -->

      <q-btn v-else round color="primary" icon="filter_list" @click="isDialogOpen = true" />

      <q-dialog v-model="isDialogOpen" position="bottom">
        <q-card style="width: 100%; max-width: 100vw;">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Filters</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-md q-pb-xl">
            <div :class="classList">
              <slot></slot>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>


</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore'

const mainDisplayStore = useMainDisplayStore()

const props = defineProps<{ classList: string }>()

const isMobile = computed(() => mainDisplayStore.isMobile)
const isDialogOpen = ref(false)

</script>

<style scoped></style>