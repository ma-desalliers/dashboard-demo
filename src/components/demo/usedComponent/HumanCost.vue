<template>
  <q-dialog v-model="showDialog">
    <q-card class="q-pa-md" style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Cost Breakdown</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <span>Task Duration</span>
            <q-tooltip>
              This represents the average time required by a human to execute this specific task. 
              This duration is based on industry standards and real-world data.
            </q-tooltip>
            <q-icon name="info" size="xs" color="grey" />
          </div>
          <span>{{ taskDuration }}h</span>
        </div>

        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <span>Hourly Rate</span>
            <q-tooltip>
              The total hourly cost of an employee including salary, benefits, workspace, 
              and other overhead expenses. This reflects the true cost to your organization.
            </q-tooltip>
            <q-icon name="info" size="xs" color="grey" />
          </div>
          <span>${{ hourlyRate }}/h</span>
        </div>

        <div class="row items-center justify-between q-py-sm">
          <div class="row items-center q-gutter-x-sm">
            <span>Hourly Opportunity Cost</span>
            <q-tooltip>
              The value of missed opportunities while performing this task. This includes potential 
              sales, client meetings, or strategic activities that could generate revenue.
            </q-tooltip>
            <q-icon name="info" size="xs" color="grey" />
          </div>
          <span>${{ opportunityCost }}/h</span>
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
  taskDuration: number;
  hourlyRate: number;
  opportunityCost: number;
}

const props = withDefaults(defineProps<Props>(), {
  taskDuration: 0,
  hourlyRate: 0,
  opportunityCost: 0
});

const showDialog = ref(false);

const totalCost = computed(() => {
  return (props.taskDuration * (props.hourlyRate + props.opportunityCost)).toFixed(2);
});

defineExpose({
  showDialog
});
</script>