<template>
  <div class="wizard-container">
    <!-- Step content -->
    <div class="step-content">
      <component
        :is="steps[currentStep].component"
        v-model="stepValues[currentStep]"
        @update:modelValue="updateStepValue(currentStep, $event)"
      />
    </div>

    <div class="wizard-footer">
      <!-- Progress indicators -->
      <div class="wizard-progress">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step-dot"
          :class="{
            'active': index === currentStep,
            'completed': index < currentStep
          }"
        />
      </div>

      <!-- Navigation -->
      <div class="wizard-navigation">
        <q-btn
          v-if="currentStep > 0"
          flat
          color="primary"
          label="Previous"
          @click="goToPrevious"
        />
        <q-btn
          v-if="currentStep < steps.length - 1"
          color="primary"
          label="Next"
          @click="goToNext"
          :disabled="!stepValues[currentStep]"
        />
        <q-btn
          v-else
          color="positive"
          label="Confirm"
          @click="handleConfirm"
          :disabled="!isComplete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QBtn } from 'quasar'

interface Step {
  component: any // Type for Vue component
  value?: any
}

interface Props {
  steps: Step[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'complete', values: any[]): void
}>()

const currentStep = ref(0)
const stepValues = ref<any[]>(new Array(props.steps.length).fill(null))

const isComplete = computed(() => {
  return stepValues.value.every(value => value !== null)
})

const updateStepValue = (index: number, value: any) => {
  stepValues.value[index] = value
}

const goToNext = () => {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
  }
}

const goToPrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleConfirm = () => {
  if (isComplete.value) {
    emit('complete', stepValues.value)
  }
}
</script>

<style scoped>
.wizard-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.step-content {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
  border-top: 1px solid #ddd;

}

.wizard-footer {
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 4px 4px;
  padding: 0.75rem 1rem;
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wizard-progress {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.step-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: #ddd;
  transition: background-color 0.3s ease;
}

.step-dot.active {
  background-color: var(--q-primary);
}

.step-dot.completed {
  background-color: var(--q-positive);
}

.wizard-navigation {
  display: flex;
  gap: 0.5rem;
}
</style>