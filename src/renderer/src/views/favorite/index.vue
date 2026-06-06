<script setup lang="ts">
import { Music, PlayList } from '@renderer/api/playlist/types'
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import MusicList from '@renderer/components/MusicList.vue'
import { useQueryDB } from '@renderer/composeable/useQueryDB'
import { DBStoreName } from '@renderer/enums/store'
import Material3Tab from '@renderer/components/Material3Tab.vue'
import { computed } from 'vue'
import GridPlayList from '@renderer/components/GridPlayList.vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { addData, clearData, getPageData } from '@renderer/db'

const route = useRoute()
const router = useRouter()

const currentTabIndex = computed({
  get() {
    if (!route.query.tab) {
      return 0
    }
    return +route.query.tab
  },
  set(val) {
    router.replace({
      path: '/favorite',
      query: {
        tab: val
      }
    })
  }
})

const {
  data: musicData,
  pageNo: musicPageNo,
  total: musicTotal,
  loading: musicLoading,
  error: musicError,
  refresh: musicRefresh
} = useQueryDB<Music>(DBStoreName.FAVORITE, {
  immediate: currentTabIndex.value === 0
})

const {
  data: playListData,
  pageNo: playListPageNo,
  total: playListTotal,
  loading: playListLoading,
  error: playListError,
  refresh: playListRefresh
} = useQueryDB<PlayList>(DBStoreName.FAVORITE_PLAYLIST, {
  immediate: currentTabIndex.value === 1
})

function refreshData(tab: number) {
  if (tab === 0) {
    musicRefresh()
  } else {
    playListRefresh()
  }
}

onBeforeRouteUpdate((to) => {
  refreshData(+to.query.tab)
})

function getData<T>(storeName: string) {
  return getPageData<T>({
    storeName,
    indexName: 'updateTime' as keyof T,
    pageNo: 1,
    pageSize: 10000
  })
}

async function exportData() {
  const musicList = (await getData<Music>(DBStoreName.FAVORITE)).map((item) => {
    return {
      musicId: item.id,
      name: item.name,
      author: item.artist,
      cover: item.pic,
      duration: item.duration,
      type: 0, // 歌曲
      authorId: item.artistId,
      hasLossless: item.hasLossless,
      createAt: item.updateTime
    }
  })
  const playList = (await getData<PlayList>(DBStoreName.FAVORITE_PLAYLIST)).map((item) => {
    return {
      musicId: item.id,
      name: item.name,
      author: item.uname,
      cover: item.img,
      duration: 0,
      type: 1, // 歌单
      createAt: item.updateTime
    }
  })
  const data = [...musicList, ...playList]
  try {
    await window.api.music.exportMusic(JSON.stringify(data))
    alert(`导出完成，歌曲：${musicList.length}，歌单：${playList.length}`)
  } catch (e) {
    alert(e.message)
  }
}

async function importData() {
  try {
    const content = await window.api.music.importMusic()
    const musicData = JSON.parse(content)
    let musicTotal = 0
    let playListTotal = 0
    if (!musicData.length) {
      alert('要导入的数据为空，已终止')
      return
    }
    await clearData(DBStoreName.FAVORITE)
    await clearData(DBStoreName.FAVORITE_PLAYLIST)
    const promiseList = musicData.map((item: any) => {
      if (item.type === 0) {
        musicTotal++
        // 歌曲
        return addData(DBStoreName.FAVORITE, {
          id: item.musicId,
          name: item.name,
          artist: item.author,
          artistId: item.authorId,
          pic: item.cover,
          duration: item.duration,
          hasLossless: item.hasLossless,
          updateTime: item.createAt
        })
      } else {
        playListTotal++
        // 歌单
        return addData(DBStoreName.FAVORITE_PLAYLIST, {
          id: item.musicId,
          name: item.name,
          uname: item.author,
          img: item.cover,
          updateTime: item.createAt
        })
      }
    })
    await Promise.all(promiseList)
    alert(`导入完成，歌曲: ${musicTotal}, 歌单: ${playListTotal}`)
    refreshData(+route.query.tab)
  } catch (e) {
    alert(e.message)
  }
}
</script>

<template>
  <Material3Tab v-model="currentTabIndex" :list="['歌曲', '歌单']" />
  <div style="height: 10px"></div>
  <mdui-button @click="exportData">导出</mdui-button>
  <mdui-button style="margin-left: 10px" @click="importData">导入</mdui-button>
  <LoadingLayout
    v-if="currentTabIndex === 0"
    v-model="musicPageNo"
    :loading="musicLoading"
    :item-count="musicData.length"
    :total="musicTotal"
    :error="musicError"
    enable-load-more
  >
    <music-list :list="musicData" />
  </LoadingLayout>
  <LoadingLayout
    v-else
    v-model="playListPageNo"
    :loading="playListLoading"
    :item-count="playListData.length"
    :total="playListTotal"
    :error="playListError"
    enable-load-more
  >
    <GridPlayList :play-list="playListData" />
  </LoadingLayout>
</template>

<style scoped></style>
