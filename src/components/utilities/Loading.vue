<template>
  <div class="loading-container" :class="`loading-${position}`">
    <q-spinner-dots :size="size" color="primary" > </q-spinner-dots>
  </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
  size?: string,
  position:'left' | 'center' | 'right'
}>(), {
  size: '100px',
  position:'center'
})

</script>
<style lang="scss" scoped>
.loading-container{
  position: absolute;
  inset:0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index:20;
  min-height:50px;

  &.loading-left{
    justify-content:start;
  }
  &.loading-right{
    justify-content:end;
  }
}
</style>