<template>
  <div v-if="show" :class="getClass()" class="c-selected-indicator"></div>
</template>
<script lang="ts" setup>
const props = defineProps({
  color: String,
  show: Boolean,
  rounded: Boolean,
  showLeft: Boolean,
});

const getClass = () => {
  const classes = [];

  classes.push(props.color);

  if (props.rounded) {
    classes.push(`c-indicator-rounded`);
  }

  if (props.showLeft) classes.push("c-indicator-left");

  return classes.join(" ");
};
</script>
<style lang="scss">
.c-selected-indicator {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;

  &.c-indicator-rounded {
    border-radius: 0 4px 4px 0;
  }
  
  &.c-indicator-left {
    right: unset;
    left: 0;

    &.c-indicator-rounded {
      border-radius: 4px 0 0 4px;
    }
  }
}
</style>
