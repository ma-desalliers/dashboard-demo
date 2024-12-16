<template>
  <div class="c-base-layout">
    <!-- Header Section -->
    <Header class="c-header-container" @state="(currentState : boolean  ) =>  headerState = currentState" />
    
    <!-- Main Content Section -->
    <div class="c-main-content">
      <div class="row no-wrap">
        <!-- Left Column -->
        <LeftColumn class="c-left-column " />
        
        <!-- Right Content Area -->
        <div class="c-right-column">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import LeftColumn from './LeftColumn.vue'

const headerState = ref(true)

</script>

<style lang="scss" >
.c-base-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.c-header-container {
  flex: none;
  z-index: 2;
}

.c-main-content {
  flex: 1;
  overflow: hidden;
}

.c-left-column {
  position:fixed;
  top:50px;
  bottom:0;
  left:0;
  width: 300px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  background-color: white;
  z-index: 1;
}

.c-right-column {
  position:fixed;
  top:50px;
  bottom:0;
  left:300px;
  right:0;
  height: 100%;
  overflow-y: auto;
}

// Ensure clean scrolling on iOS devices
.c-left-column,
.c-right-column {
  -webkit-overflow-scrolling: touch;
}

// Add responsive behavior
@media (max-width: 768px) {
  .c-left-column {
    width: 250px;
  }
}
</style>