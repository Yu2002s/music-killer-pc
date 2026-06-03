<script setup lang="ts">
import 'mdui/components/button'
import useRequest from '@renderer/composeable/useRequest'
import { PlayListTag } from '@renderer/api/playlist/types'
import { getPlaylistPage, getPlayListTags } from '@renderer/api/playlist'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import { computed, ref } from 'vue'
import GridPlayList from '@renderer/components/GridPlayList.vue'
import GridView from '@renderer/components/GridView.vue'
import usePageRequest from '@renderer/composeable/usePageRequest'

defineOptions({
  name: 'Playlist'
})

const currentTagId = ref('')
const currentSortBy = ref('new')
const currentTags = computed(() => {
  if (currentTagId.value) {
    return data.value.find((tag) => tag.id === currentTagId.value).data
  }
  return []
})

const { data } = useRequest<PlayListTag[]>(getPlayListTags, {
  immediate: true,
  defaultData: [],
  onSuccess: (data: PlayListTag[]) => {
    if (data.length) {
      currentTagId.value = data[0].id
      send()
    }
  }
})

const {
  data: playlistData,
  pageNo,
  error,
  loading,
  total,
  send,
  refresh
} = usePageRequest(
  (pageNo, pageSize) =>
    getPlaylistPage({
      pageNo,
      pageSize,
      id: currentTagId.value,
      order: currentSortBy.value
    }),
  {
    initialPage: {
      pageNo: 1,
      pageSize: 20
    }
  }
)

function onTagChange(e: any) {
  currentTagId.value = e.target.value
}

function onSortChange(e: any) {
  currentSortBy.value = e.target.value
  refresh()
}
</script>

<template>
  <loading-layout
    v-model="pageNo"
    :loading="loading"
    :error="error"
    :total
    enable-load-more
    :item-count="playlistData.length"
  >
    <mdui-tabs :value="currentTagId" @change="onTagChange">
      <mdui-tab v-for="item in data" :key="item.id" :value="item.id">{{ item.name }}</mdui-tab>
    </mdui-tabs>
    <div class="tags">
      <grid-view :column="6">
        <router-link
          v-for="item in currentTags"
          :key="item.id"
          :to="`/playlist/tag/${item.id}`"
          class="tag-item"
          >{{ item.name }}</router-link
        >
      </grid-view>
    </div>
    <mdui-tabs :value="currentSortBy" @change="onSortChange">
      <mdui-tab value="new">最新</mdui-tab>
      <mdui-tab value="hot">最热</mdui-tab>
    </mdui-tabs>
    <GridPlayList :play-list="playlistData" />
  </loading-layout>
</template>

<style scoped>
.tags {
  display: grid;
  grid-template-columns: 1fr;
  padding: 10px 0;

  .tag-item {
    background-color: rgb(var(--mdui-color-secondary-container));
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    text-align: center;

    &.active {
      color: rgb(var(--mdui-color-primary));
    }
  }
}
</style>
