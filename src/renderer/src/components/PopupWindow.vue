<script setup lang="ts">
const isShow = defineModel({
  type: Boolean,
  default: false
})
</script>

<template>
  <div v-show="isShow" class="popup" @click.self="isShow = false">
    <slot></slot>
  </div>
</template>

<style scoped>
.popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
