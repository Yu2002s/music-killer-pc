<script setup lang="ts">
interface Props {
  column: number
}

defineProps<Props>()
</script>

<template>
  <div class="grid-view">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.grid-view {
  display: grid;
  grid-template-columns: repeat(v-bind(column), 1fr);
  grid-gap: 8px;
}
</style>
