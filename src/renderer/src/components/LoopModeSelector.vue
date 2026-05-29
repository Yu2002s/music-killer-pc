<template>
  <div class="loop-mode-selector">
    <mdui-menu selects="single" :value="model" @change="onChange">
      <mdui-menu-item v-for="item in loopModeDict" :key="item.label" :value="item.value">{{
        item.label
      }}</mdui-menu-item>
    </mdui-menu>
  </div>
</template>

<script setup lang="ts">
import { LoopMode, loopModeDict } from '@renderer/enums/music';

const model = defineModel<LoopMode>({
  default: LoopMode.SEQUENCE
})

function onChange(e: any) {
  model.value = e.target.value
}
</script>

<style scoped lang="scss">
.loop-mode-selector {
  position: absolute;
  width: 250px;
  right: 20px;
  bottom: 80px;
}
</style>
