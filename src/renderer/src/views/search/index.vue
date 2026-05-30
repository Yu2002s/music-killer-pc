<script setup lang="ts">
import Material3Tab from '@renderer/components/Material3Tab.vue'
import { computed } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@renderer/store/modules/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const tabList = [
  {
    name: '单曲',
    path: '/search'
  },
  {
    name: '专辑',
    path: '/search/album'
  },
  {
    name: '歌单',
    path: '/search/playlist'
  },
  {
    name: '歌手',
    path: '/search/artist'
  }
]

const currentTab = computed({
  get() {
    return tabList.findIndex((tab) => tab.path === route.path)
  },
  set(val: number) {
    router.replace({
      path: tabList[val].path,
      query: {
        q: searchStore.keyword
      }
    })
  }
})

if (route.query.q && route.query.q !== searchStore.keyword) {
  searchStore.keyword = route.query.q as string
}

onBeforeRouteUpdate((to) => {
  searchStore.keyword = to.query.q as string
})
</script>

<template>
  <div class="search-container">
    <div class="tab">
      <Material3Tab v-model="currentTab" :list="tabList.map((item) => item.name)" />
    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  .tab {
    background-color: rgb(var(--mdui-color-background));
    position: sticky;
    left: 0;
    width: 100%;
    top: 0;
    padding-bottom: 10px;
  }
}
</style>
