<template>
  <div>
    <h1>Clients</h1>
    <div v-for="(client, index) in clients" :key="index">
      <button @click="toggle(index)">{{ client.name }}</button>
      <div v-if="isOpen(index)">
        <p>{{ client.details }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Index',
  setup() {
    const clients = ref([
      { name: 'Client 1', details: 'Details about Client 1' },
      { name: 'Client 2', details: 'Details about Client 2' },
      { name: 'Client 3', details: 'Details about Client 3' },
    ]);

    const openIndex = ref<number | null>(null);

    const toggle = (index: number) => {
      openIndex.value = openIndex.value === index ? null : index;
    };

    const isOpen = (index: number) => {
      return openIndex.value === index;
    };

    return { clients, toggle, isOpen };
  },
});
</script>

<style scoped>
button {
  display: block;
  margin: 10px 0;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #36a372;
}

div {
  margin: 5px 0;
}
</style>
