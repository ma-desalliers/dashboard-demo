<template>
  <q-btn
    :class="{'expanded': isExpanded}"
    :round="!isExpanded"
    :rounded="isExpanded"
    :label="isExpanded ? label : ''"
    :icon="isExpanded ? '' : icon"
    :color="color"
    :text-color="textColor"
    @click="handleClick"
    class="confirm-btn"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  onConfirm: () => void
  icon?: string
  label?: string
  color?: string
  textColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'check',
  label: 'Confirm?',
  color: 'primary',
  textColor: 'white'
})

const isExpanded = ref(false)

const handleClick = () => {
  if (!isExpanded.value) {
    isExpanded.value = true
  } else {
    isExpanded.value = false
    props.onConfirm()
  }

  window.setTimeout(()=>{
    isExpanded.value = false
  }, 5000)
}
</script>

<style lang="scss">
.confirm-btn {
  transition: all 0.3s ease;
}

.expanded {
  height:30px;

  .q-icon {
    display:none
  }
}
</style>
