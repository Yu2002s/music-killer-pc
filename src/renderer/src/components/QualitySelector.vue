<template>
  <div class="quality-selector">
    <mdui-menu selects="single" :value="model.value" @change="onChange">
      <mdui-menu-item v-for="item in Quality" :key="item.label" :value="item.value">{{
        item.label
      }}</mdui-menu-item>
    </mdui-menu>
  </div>
</template>

<script setup lang="ts">
import { Quality } from '@renderer/enums/music'
import 'mdui/components/menu'
import 'mdui/components/menu-item'

const model = defineModel<import('@renderer/enums/music').QualityItem>({
  default: Quality.MP3
})

function onChange(e: any) {
  Object.entries(Quality).forEach(([_, v]) => {
    if (v.value === e.target.value) {
      model.value = v
    }
  })
}
</script>

<style scoped lang="scss">
.quality-selector {
  position: absolute;
  width: 250px;
  right: 100px;
  bottom: 80px;
}
</style>
