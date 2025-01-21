<template>
<Calendar></Calendar>
</template>
<script lang="ts" setup>
import Calendar from '@/src/components/marketing/calendar.vue'
import { useMainDisplayStore } from '~/src/stores/mainDisplayStore';

definePageMeta({
  middleware: ['auth']
})

const mainDisplayStore  = useMainDisplayStore()
onMounted(()=>{
mainDisplayStore.setContextMenu(null)
})


</script>