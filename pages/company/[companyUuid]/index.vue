<template>
  <!-- This page doesn't render any content as it immediately redirects -->
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'company']
});
</script>
