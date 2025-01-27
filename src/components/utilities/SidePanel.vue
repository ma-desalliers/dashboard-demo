<template>
  <q-layout view="hHh LpR fFf" class="side-panel-layout">
    <Teleport to="body">
      <q-drawer
        v-model="isOpen"
        :side="position"
        :width="width"
        bordered
        :behavior="behavior"
        elevated
        class="side-panel"
        @show="atShow"
      >
        <!-- Header Section -->
        <div class="drawer-header q-px-md q-py-sm row items-center justify-between">
          <div class="text-h6">{{ title }}</div>
          <div class="row q-gutter-sm">
           <!-- <q-btn size="sm" color="primary" icon="save" @click="btnAction" label="Save">
            </q-btn>-->
            <q-btn flat dense color="grey" icon="close" @click="handleClose">
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </div>
        </div>

        <!-- Divider -->
        <q-separator />

        <!-- Content Section -->
        <div class="drawer-content">
          <slot></slot>
        </div>
      </q-drawer>
    </Teleport>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: boolean;
  position?: "left" | "right";
  width?: number;
  behavior?: "default" | "desktop" | "mobile";
  title?: string;
  btnAction?: () => {};
}

const props = withDefaults(defineProps<Props>(), {
  position: "right",
  width: 350,
  behavior: "default",
  title: "Side Panel",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "save"): void;
  (e: "close"): void;
  (e: "show"): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSave = () => {
  emit("save");
};

const handleClose = () => {
  emit("close");
  isOpen.value = false;
};

const atShow = () => {
  emit("show");
};
</script>

<style scoped>
.side-panel {

  height: 100vh;
}

.drawer-header {
  height: 56px;
  min-height: 56px;
}

.drawer-content {
  height: calc(100vh - 57px); /* 56px header + 1px border */
  overflow-y: auto;
}
</style>
