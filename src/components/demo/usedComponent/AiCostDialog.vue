<template>
  <q-dialog v-model="showDialog">
    <q-card class="q-pa-md" style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">AI Cost Breakdown</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <span>AI Credit</span>

          </div>
          <span>{{ aiCredit }} Credit</span>
        </div>

        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <span>Cost per Credit</span>
          </div>
          <span>${{ costPerCredit }}</span>
        </div>

        <q-separator class="q-my-md" />

        <div class="row items-center justify-between text-weight-medium">
          <span>Total Cost</span>
          <span>${{ totalCost }}</span>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  aiCredit:number,
  costPerCredit:number
}

const props = withDefaults(defineProps<Props>(), {
  aiCredit: 0,
  costPerCredit: 0
});

const showDialog = ref(false);

const totalCost = computed(() => {
  return (props.aiCredit  * props.costPerCredit).toFixed(2);
});

defineExpose({
  showDialog
});
</script>