<template>
  <q-btn
    outline
    color="primary"
    unelevated
    class="ai-button c-shine"
  >
    <div class="row items-center">
      <q-icon
        name="auto_awesome"
        class="q-mr-sm"
      />
      <span class="ai-text">AI</span>
    </div>
  </q-btn>
</template>

<script setup lang="ts">
</script>

<style scoped>
.ai-button {
  position: relative;
  overflow: hidden;
  padding:6px 10px;
}

.ai-text{
  font-size: 14px;;
}

.q-icon{
  color:var(--q-black);
  font-size:20px !important;
}

/* Add hover effect */
.ai-button:hover {
  background: rgba(76, 175, 80, 0.1) !important;
}
</style>