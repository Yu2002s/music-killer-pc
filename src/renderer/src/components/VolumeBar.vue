<script setup lang="ts">
import { useAudioStore } from '@renderer/store/modules/audio'
import { computed } from 'vue'
import { throttle } from '@renderer/utils/tools'
import '@mdui/icons/volume-up.js'
import '@mdui/icons/volume-off.js'

const audioStore = useAudioStore()

const volumeValue = computed(() => {
  return audioStore.volume * 100
})

const onChange = throttle((e: any) => {
  audioStore.setVolume(e.target.value / 100)
})

function changeVolume() {
  if (volumeValue.value <= 0) {
    audioStore.setVolume(1)
  } else {
    audioStore.setVolume(0)
  }
}
</script>

<template>
  <div class="volume">
    <mdui-button-icon @click="changeVolume">
      <mdui-icon-volume-up v-if="volumeValue > 0"></mdui-icon-volume-up>
      <mdui-icon-volume-off v-else></mdui-icon-volume-off>
    </mdui-button-icon>
    <mdui-slider :value="volumeValue" :max="100" @input="onChange"></mdui-slider>
  </div>
</template>

<style scoped lang="scss">
.volume {
  position: absolute;
  right: 35px;
  bottom: 80px;
  width: 240px;
  background-color: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
