<script setup lang="ts">
import GridView from '@renderer/components/GridView.vue'
import useWindow from '@renderer/composeable/useWindow'
import { Album } from '@renderer/api/album/types'

const { column } = useWindow()

defineProps<{
  albumList: Album[]
}>()
</script>

<template>
  <grid-view class="album-list" :column="column" :spacing="20">
    <router-link
      v-for="item in albumList"
      :key="item.albumId"
      :to="`/album/${item.albumId}`"
      class="album-item"
    >
      <img :src="item.pic" class="album-image" />
      <div class="album-name">{{ item.album }}</div>
      <div class="album-date">{{ item.releaseDate }}</div>
    </router-link>
  </grid-view>
</template>

<style scoped lang="scss">
.album-list {
  .album-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .album-image {
      width: 80px;
      height: 80px;
      overflow: hidden;
      border-radius: 10px;
    }

    .album-name {
      margin-top: 10px;
      font-size: 15px;
    }

    .album-date {
      margin-top: 4px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
