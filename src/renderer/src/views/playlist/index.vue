<script setup lang="ts">
import { useAudioStore } from '@renderer/store/modules/audio';
const audioStore = useAudioStore()
</script>

<template>
  <div class="wrapper"></div>
</template>

<style scoped>
.wrapper {
  height: 300px;
  overflow: hidden;
}
</style>
