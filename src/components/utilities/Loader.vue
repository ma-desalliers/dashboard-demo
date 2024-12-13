<template>
  <div class="c-loader-container" :style="containerStyle">
    <div class="c-loader">
      <div class="c-circle c-circle-xs"></div>
      <div class="c-circle c-circle-small"></div>
      <div class="c-circle c-circle-medium"></div>
      <div class="c-circle c-circle-large"></div>
      <div class="c-circle c-circle-xl"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  size?: string;
  color?: string;
}>(), {
  size: '40px',
  color: 'var(--q-primary)'
})

const containerStyle = computed(() => ({
  '--loader-size': props.size,
  '--loader-color': props.color
}))
</script>

<style scoped lang="scss">
.c-loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: calc(var(--loader-size) / 2);
}

.c-loader {
  position: relative;
  width: var(--loader-size);
  height: var(--loader-size);
}

.c-circle {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  border-width: 3px;
  border-left-color: transparent;
  border-bottom-color: transparent;
  &.c-circle-xs{
    width: calc(var(--loader-size) * 0.6);
    height: calc(var(--loader-size) * 0.6);
    top: 20%;
    left: 20%;
    border-top-color: color-mix(in srgb, var(--loader-color) 30%, white);
    border-right-color: color-mix(in srgb, var(--loader-color) 30%, white);
    animation: spin 0.6s linear infinite;
  }
  &.c-circle-small {
    width: calc(var(--loader-size) * 0.8);
    height: calc(var(--loader-size) * 0.8);
    top: 10%;
    left: 10%;
    border-top-color: color-mix(in srgb, var(--loader-color) 50%, white);
    border-right-color: color-mix(in srgb, var(--loader-color) 50%, white);
    animation: spin 0.8s linear infinite;
  }
  
  &.c-circle-medium {
    width: var(--loader-size);
    height: var(--loader-size);
    top: 0;
    left: 0;
    border-width: 3px;
    border-top-color: var(--loader-color);
    border-right-color: var(--loader-color);
    animation: spin 1.2s linear infinite;
  }
  
  &.c-circle-large {
    width: calc(var(--loader-size) * 1.2);
    height: calc(var(--loader-size) * 1.2);
    top: -10%;
    left: -10%;
    border-width: 3px;
    border-top-color: color-mix(in srgb, var(--loader-color) 70%, black);
    border-right-color: color-mix(in srgb, var(--loader-color) 70%, black);
    animation: spin 1.6s linear infinite;
  }

  &.c-circle-xl{
    width: calc(var(--loader-size) * 1.4);
    height: calc(var(--loader-size) * 1.4);
    top: -20%;
    left: -20%;
    border-width: 3px;
    border-top-color: color-mix(in srgb, var(--loader-color) 50%, black);
    border-right-color: color-mix(in srgb, var(--loader-color) 50%, black);
    animation: spin 2s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>