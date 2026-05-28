<script setup lang="ts">
import Material3Tab from '@renderer/components/Material3Tab.vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTab = ref<number>(0)

const tabList = [
  {
    name: '单曲',
    value: 0,
    path: '/search'
  },
  {
    name: '专辑'
  },
  {
    name: '歌单',
    path: '/search/playlist'
  },
  {
    name: '歌手'
  }
]

watch(currentTab, (val) => {
  router.replace(tabList[val].path)
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
