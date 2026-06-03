<script setup lang="ts">
import { getIndexPlayList, getIndexPlayListTags, getPlayListByTag } from '@renderer/api/playlist'
import GridView from '@renderer/components/GridView.vue'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import useRequest from '@renderer/composeable/useRequest'
import useWindow from '@renderer/composeable/useWindow'
import { onMounted, ref, watch } from 'vue'
import GridPlayList from '@renderer/components/GridPlayList.vue'

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

const { data: playList, send: getPlaylistMusic } = useRequest(
  (id: string) => {
    if (!id) {
      return getIndexPlayList()
    }
    return getPlayListByTag(id)
  },
  {
    transform: (data) => {
      return data.data
    },
    defaultData: []
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
    <GridPlayList :play-list="playList" />
  </loading-layout>
</template>

<style scoped lang="scss"></style>
