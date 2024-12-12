<template>
  <q-btn-dropdown
    round
    dense
    size="sm"
    color="negative"
    :disable="loading"
    dropdown-icon="none"
    class="c-delete-btn"
  >
    <template #label>
      <q-icon name="delete" size="18px" />
    </template>

    <template #default>
      <q-list class="q-py-md" style="min-width: 250px">
        <q-item>
          <q-item-section>
            <q-item-label class="text-h6">Confirm Deletion</q-item-label>
            <q-item-label caption class="q-mt-sm">
              Are you sure you want to delete this item?
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section align="right">
            <div class="row q-gutter-sm">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                color="negative"
                label="Delete"
                :loading="loading"
                @click="handleDelete"
                v-close-popup
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </template>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  delete: () => Promise<void> | void
}

const props = defineProps<Props>()
const loading = ref(false)

const handleDelete = async () => {
  loading.value = true
  try {
    await props.delete()
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.c-delete-btn {
  width: 32px;
  height: 32px;
  min-height: unset;
  padding: 0;
}

.c-delete-btn :deep(.q-btn__content) {
  min-height: unset;
}

.c-delete-btn :deep(.q-btn-dropdown__arrow){
  display: none;
}
</style>