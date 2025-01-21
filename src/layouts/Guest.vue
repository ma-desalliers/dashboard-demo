<!-- layouts/guest.vue -->
<template>
  <div class="guest-layout">
    <div class="full-width" style="min-height: 100vh;">
      
        <slot />
      
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guest-layout {
  min-height: 100vh;
}
</style>