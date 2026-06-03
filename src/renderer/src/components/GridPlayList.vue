<script setup lang="ts">
import GridView from '@renderer/components/GridView.vue'
import useWindow from '@renderer/composeable/useWindow'
import { PlayList } from '@renderer/api/playlist/types'

const { column } = useWindow()

defineProps<{
  playList: PlayList[]
}>()
</script>

<template>
  <grid-view :column="column" style="margin-top: 8px">
    <router-link
      v-for="item in playList"
      :key="item.id"
      :to="`/playlist/detail?id=${item.id}`"
      class="playlist-item"
    >
      <img :alt="item.name" :src="item.img" class="playlist-img" />
      <span class="playlist-name">{{ item.name }}</span>
    </router-link>
  </grid-view>
</template>

<style scoped lang="scss">
.playlist-item {
  cursor: pointer;

  .playlist-img {
    width: 100%;
    border-radius: 10px;
  }

  .playlist-name {
    font-size: 14px;
  }
}
</style>
