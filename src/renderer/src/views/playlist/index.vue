<script setup lang="ts">
import { useAudioStore } from '@renderer/store/modules/audio'
import 'mdui/components/button'
import { ref } from 'vue'

const isShow = ref(false)
const audioStore = useAudioStore()
</script>

<template>
  <div class="wrapper"></div>
</template>

<style scoped>
.wrapper {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
