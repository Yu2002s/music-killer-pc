<script setup lang="ts">
interface Props {
  column?: number
  spacing?: number
}

withDefaults(defineProps<Props>(), {
  column: 4,
  spacing: 8
})
</script>

<template>
  <div class="grid-view" :style="{ 'grid-gap': `${spacing}px` }">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.grid-view {
  display: grid;
  grid-template-columns: repeat(v-bind(column), 1fr);
}
</style>
