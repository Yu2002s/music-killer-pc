<script setup lang="ts">
import '@mdui/icons/search.js'
import '@mdui/icons/settings.js'
import '@mdui/icons/home.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/history.js'
import '@mdui/icons/download.js'
import '@mdui/icons/refresh.js'
import '@mdui/icons/arrow-back.js'
import 'mdui/components/navigation-rail-item.js'
import 'mdui/components/navigation-rail.js'
import 'mdui/components/top-app-bar.js'
import 'mdui/components/top-app-bar-title.js'
import 'mdui/components/bottom-app-bar.js'
import { useRoute, useRouter } from 'vue-router'
import routes from '@renderer/router/routes'
import { computed, onMounted } from 'vue'
import BottomPlayBar from '@renderer/components/BottomPlayBar.vue'

const router = useRouter()
const route = useRoute()

const menuList = routes
  .filter((item) => item.meta?.home)
  .map((item) => {
    return {
      icon: item.meta?.icon,
      name: item.meta?.title,
      path: item.path,
      children: item.children
    }
  })

onMounted(() => {
  router.push('/')
})

function onMenuItemClick(item): void {
  router.replace(item.path)
}

function back(): void {
  if (menuList.some((item) => item.path === route.path)) {
    router.replace('/')
    return
  }
  router.back()
}

const isHome = computed(() => {
  const allMenu = menuList.filter((item) => item.children).flatMap((item) => item.children)
  return allMenu.some((item) => (item?.path || '/') === route.path)
})

function refresh(): void {
  // window.location.reload()
}
</script>

<template>
  <mdui-navigation-rail divider alignment="center" :value="route.path">
    <mdui-button-icon slot="top" variant="filled">
      <mdui-icon-search></mdui-icon-search>
    </mdui-button-icon>
    <mdui-button-icon slot="bottom">
      <mdui-icon-settings></mdui-icon-settings>
    </mdui-button-icon>
    <mdui-navigation-rail-item
      v-for="item in menuList"
      :key="item.path"
      :value="item.path"
      @click="onMenuItemClick(item)"
    >
      <span>
        {{ item.name }}
      </span>
      <component :is="`mdui-icon-` + item.icon" slot="icon" />
    </mdui-navigation-rail-item>
  </mdui-navigation-rail>

  <div class="main">
    <mdui-top-app-bar variant="small" style="left: 82px">
      <mdui-button-icon v-if="!isHome" @click="back">
        <mdui-icon-arrow-back></mdui-icon-arrow-back>
      </mdui-button-icon>
      <mdui-top-app-bar-title>{{ route.meta.title }}</mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
      <mdui-button-icon @click="refresh">
        <mdui-icon-refresh></mdui-icon-refresh>
      </mdui-button-icon>
    </mdui-top-app-bar>
    <div class="content">
      <router-view>
        <template #default="{ Component }">
          <keep-alive include="home,recommend">
            <component :is="Component"></component>
          </keep-alive>
        </template>
      </router-view>
    </div>
    <mdui-bottom-app-bar style="left: 82px">
      <bottom-play-bar></bottom-play-bar>
    </mdui-bottom-app-bar>
  </div>
</template>

<style lang="scss">
.main {
  overflow: hidden;

  .content {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
    height: calc(100vh - 80px - 80px);
  }
}
</style>
