<template>
    <div v-if="show" :class="getClass()" class="c-selected-indicator"></div>
</template>
<script lang="ts" setup>
const props = defineProps({
    color:String,
    show:Boolean,
    rounded:Boolean
})

const getClass = () =>{
  if(props.rounded){
    return `c-indicator-rounded ${props.color}`
  }
  return props.color
}
</script>
<style>
.c-selected-indicator{
    position:absolute;
    right:0;
    top:0;
    bottom:0;
    width:5px;
}

.c-indicator-rounded{
  border-radius: 0 4px 4px 0;

}
</style>