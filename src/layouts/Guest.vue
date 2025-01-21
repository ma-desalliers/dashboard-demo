<!-- layouts/guest.vue -->
<template>
  <div class="guest-layout">
    <div class="row items-center justify-center" style="min-height: 100vh;">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guest-layout {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>