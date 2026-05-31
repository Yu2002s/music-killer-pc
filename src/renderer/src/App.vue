<script setup lang="ts">
import '@mdui/icons/arrow-back.js'
import '@mdui/icons/download.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/history.js'
import '@mdui/icons/home.js'
import '@mdui/icons/refresh.js'
import '@mdui/icons/search.js'
import '@mdui/icons/settings.js'
import BottomPlayBar from '@renderer/components/BottomPlayBar.vue'
import routes from '@renderer/router/routes'
import 'mdui/components/bottom-app-bar.js'
import 'mdui/components/navigation-rail-item.js'
import 'mdui/components/navigation-rail.js'
import 'mdui/components/top-app-bar-title.js'
import 'mdui/components/top-app-bar.js'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SearchBar from './components/SearchBar.vue'
import { useSearchStore } from './store/modules/search.js'
import { UpdateInfo } from 'electron-updater'
import UpdateDialog from '@renderer/components/UpdateDialog.vue'

const router = useRouter()
const route = useRoute()
const isUpdate = ref(true)
const downloadProgress = ref(-1)
const updateInfo = ref<UpdateInfo | null>(null)
const searchStore = useSearchStore()

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

  window.api.update.onUpdateAvailable((info) => {
    console.log('updateAvailable:', info)
    updateInfo.value = info
  })

  window.api.update.onDownloadProgress((progress) => {
    console.log('downloadProgress:', progress)
    downloadProgress.value = progress.percent
  })
})

function onMenuItemClick(item: any): void {
  router.replace(item.path)
}

function back(): void {
  if (routes.some((item) => item.path === route.path)) {
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
  isUpdate.value = false
  setTimeout(() => {
    isUpdate.value = true
  }, 500)
}

function navigateToSearch() {
  router.push('/search')
}

function navigateToSetting() {
  router.push('/setting')
}

function onSearchSubmit(e: string) {
  console.log('onSearchSubmit:', e)
  // 搜索
  router.push({
    path: `/search`,
    query: {
      q: e
    }
  })
}

function onUpdate() {
  window.api.update.startDownloadUpdate()
}
</script>

<template>
  <mdui-navigation-rail divider alignment="center" :value="route.path">
    <mdui-button-icon
      slot="top"
      :variant="route.path === '/search' ? 'filled' : 'outline'"
      @click="navigateToSearch"
    >
      <mdui-icon-search></mdui-icon-search>
    </mdui-button-icon>
    <mdui-button-icon
      slot="bottom"
      :variant="route.path === '/setting' ? 'filled' : 'outline'"
      @click="navigateToSetting"
    >
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
    <mdui-top-app-bar v-if="!route.meta.hiddenHeader" variant="small" style="left: 82px">
      <mdui-button-icon v-if="!isHome" @click="back">
        <mdui-icon-arrow-back></mdui-icon-arrow-back>
      </mdui-button-icon>
      <mdui-top-app-bar-title>{{ route.meta.title }}</mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
      <div class="header-right">
        <search-bar
          v-model="searchStore.keyword"
          style="margin-right: 10px"
          @on-submit="onSearchSubmit"
        />
        <mdui-button-icon @click="refresh">
          <mdui-icon-refresh></mdui-icon-refresh>
        </mdui-button-icon>
      </div>
    </mdui-top-app-bar>
    <div class="content">
      <router-view>
        <template #default="{ Component }">
          <keep-alive :include="['Home']">
            <component :is="Component" v-if="isUpdate"></component>
          </keep-alive>
        </template>
      </router-view>
      <div v-if="!isUpdate" class="loading">
        <mdui-circular-progress></mdui-circular-progress>
      </div>
    </div>
    <mdui-bottom-app-bar style="left: 82px">
      <bottom-play-bar></bottom-play-bar>
    </mdui-bottom-app-bar>

    <update-dialog
      :download-progress="downloadProgress"
      :update-info="updateInfo"
      @on-update="onUpdate"
    />
  </div>
</template>

<style lang="scss">
.main {
  overflow: hidden;

  .header-right {
    display: flex;
    align-items: center;
  }

  .content {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--mdui-color-primary)) #f1f1f1;
    height: calc(100vh - 80px - 80px);

    .loading {
      width: 100%;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
