<script setup lang="ts">
import Material3Tab from '@renderer/components/Material3Tab.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const artistId = route.query.id as string

const tabList = [
  {
    title: '歌曲',
    path: '/artist/detail'
  },
  {
    title: '专辑',
    path: '/artist/detail/album'
  }
]

const currentIndex = computed({
  get() {
    return tabList.findIndex((item) => item.path === route.path)
  },
  set(val) {
    router.replace({
      path: tabList[val].path,
      query: {
        id: artistId
      }
    })
  }
})
</script>

<template>
  <div>
    <Material3Tab v-model="currentIndex" :list="tabList.map((item) => item.title)" />
    <div style="margin-top: 10px">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped></style>
