<script setup lang="ts">
import useRequest from '@renderer/composeable/useRequest'
import { getIndexPlayList, getIndexPlayListTags, getPlayListByTag } from '@renderer/api/playlist'
import { onMounted, ref, watch } from 'vue'
import GridView from '@renderer/components/GridView.vue'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import useWindow from '@renderer/composeable/useWindow'

const currentPlaylistTab = ref('')

defineOptions({
  name: 'Recommend'
})

const loading = ref(false)
const error = ref<string | undefined>()
const { data: playListTags, send: getPlaylistTags } = useRequest(getIndexPlayListTags, {
  onSuccess: (data) => {
    data.unshift({
      id: '',
      name: '每日推荐'
    })
  }
})

const { data: musicList, send: getPlaylistMusic } = useRequest(
  (id: string) => {
    if (!id) {
      return getIndexPlayList()
    }
    return getPlayListByTag(id)
  },
  {
    transform: (data) => {
      return data.data
    }
  }
)

watch(
  currentPlaylistTab,
  async () => {
    console.log('getMusicList')
    loading.value = true
    try {
      await getPlaylistMusic(currentPlaylistTab.value)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  },
  {
    immediate: false
  }
)

const { column } = useWindow()

onMounted(async () => {
  try {
    loading.value = true
    await getPlaylistTags(currentPlaylistTab.value)
    await getPlaylistMusic()
  } catch (e: any) {
    console.error(e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})

function onChange(e: any) {
  currentPlaylistTab.value = e.target.value
}
</script>

<template>
  <h3 style="margin-bottom: 0">推荐歌单</h3>
  <mdui-tabs v-if="playListTags?.length" :value="currentPlaylistTab" @change="onChange">
    <mdui-tab v-for="item in playListTags" :key="item.name" :value="item.id">{{
      item.name
    }}</mdui-tab>
  </mdui-tabs>
  <loading-layout :loading="loading" :error="error">
    <grid-view :column="column" style="margin-top: 8px">
      <router-link
        v-for="item in musicList"
        :key="item.id"
        :to="`/playlist/detail?id=${item.id}`"
        class="playlist-item"
      >
        <img :alt="item.name" :src="item.img" class="playlist-img" />
        <span class="playlist-name">{{ item.name }}</span>
      </router-link>
    </grid-view>
  </loading-layout>
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
