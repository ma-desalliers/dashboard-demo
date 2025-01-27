<template>
  <div class="row">
    <div class="col-12 row q-col-gutter-xl items-center c-border-bottom c-header-sticky q-px-md q-py-sm " style="background:#ffffff">
    <img src="/public/protech.png" style="padding-top:0px">
    <span style="padding-top:0px">PCANIA Volet Innovation</span>
    </div>

    <div class="col-12">
    <slot></slot>
    </div>
  </div>

</template>
<script lang="ts" setup>

</script>

<style>

.c-header-sticky{
  position:sticky;
  top:0;
  z-index: 10;
}
</style>