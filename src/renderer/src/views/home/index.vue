<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import Material3Tab from '@renderer/components/Material3Tab.vue'
import 'mdui/components/tabs.js'
import 'mdui/components/tab.js'
import 'mdui/components/tab-panel.js'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()

defineOptions({
  name: 'Home'
})

const tabList = [
  {
    name: '推荐',
    path: '/'
  },
  {
    name: '歌单',
    path: '/playlist'
  },
  {
    name: '排行榜',
    path: '/rank'
  },
  {
    name: '歌手',
    path: '/artist'
  }
]
const currentTabIndex = computed(() => {
  return tabList.findIndex((tab) => tab.path === route.path)
})
const router = useRouter()

function onTabChange(newVal: number) {
  router.replace(tabList[newVal].path)
}

onMounted(() => {
  console.log('onMounted')
})

onUnmounted(() => {
  console.log('onUnmounted')
})
</script>

<template>
  <Material3Tab
    :model-value="currentTabIndex"
    :list="tabList.map((item) => item.name)"
    @update:model-value="onTabChange"
  />
  <router-view>
    <template #default="{ Component }">
      <keep-alive :include="['Recommend', 'Playlist', 'Rank', 'Artist']">
        <component :is="Component"></component>
      </keep-alive>
    </template>
  </router-view>
</template>

<style scoped></style>
