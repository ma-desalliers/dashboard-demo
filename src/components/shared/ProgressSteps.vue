<template>
  <div class="c-progress-steps row no-wrap">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="c-step relative-position"
      :class="{
        'c-step-active': index === activeStep,
       // 'c-step-completed': index < activeStep
      }"
    >
    <div class="c-step-end-arrow" v-if="index > 0"></div>
      <div class="c-step-content row items-center justify-between no-wrap q-px-md" @click="selectStep(index)">
        <div class="c-step-label">{{ step.label }}</div>
        <div class="c-step-value q-ml-sm">{{ step.value }}</div>
      </div>
      <div class="c-step-arrow" v-if="index < steps.length - 1"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Step {
  label: string;
  value: number;
}

interface Props {
  steps: Step[];
  activeStep?: number;
}

withDefaults(defineProps<Props>(), {
  activeStep: 0
});

const emit = defineEmits(['updateActiveStep'])

const selectStep = (step:number)=>{
  emit('updateActiveStep', step)
}
</script>

<style scoped lang="scss">
.c-progress-steps {
  width: 100%;
  min-height: 40px;
}

.c-step {
  background-color: #E0E0E0;
  height: px;
  flex: 1;
  display: flex;
  align-items: center;
  position: relative;
  min-width: 150px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 10px;
  }

  &:first-child{
    border-radius: 4px 0 0 4px;  
  }

  &:last-child{
    border-radius: 0 4px 4px 0;
  }

  .c-step-content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 2;
  }

  .c-step-label {
    font-size: 18px;
    color: #212529;
    font-weight:400;
    padding-left:24px;
  }

  .c-step-value {
  
    font-size: 14px;
    color: #212529;
    font-weight: 600;
  }

  .c-step-end-arrow{
    position: absolute;
    left: -0px;
    width: 20px;
    height: 40px;
    clip-path: polygon(0 0, 0% 100%, 80% 50%);
    background-color: white;
    z-index: 1;

    &:after{
      content:"";
      background-color: white;
      position:absolute;
      left: -2px;
      width:4px;
      top:0;
      bottom:0;
      z-index:1
    }
  }

  .c-step-arrow {
    position: absolute;
    right: -20px;
    width: 20px;
    height: 40px;
    clip-path: polygon(0 0, 0% 100%, 80% 50%);
    background-color: inherit;
    z-index: 2;
    &:after{
      content:"";
      background-color: inherit;
      position:absolute;
      left: -2px;
      width:4px;
      top:0;
      bottom:0;
      z-index:1
    }
  }
}

.c-step-active {
  background-color: var(--q-green);

  .c-step-label,
  .c-step-value {
    color: white;
  }
}

.c-step-completed {
  background-color: var(--q-green);

  .c-step-label,
  .c-step-value {
    color: white;
  }
}
</style>