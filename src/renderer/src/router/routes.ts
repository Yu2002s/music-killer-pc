import HomeView from '@renderer/views/home/index.vue'
import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    component: HomeView,
    name: 'home',
    meta: {
      title: '首页',
      icon: 'home',
      home: true
    },
    children: [
      {
        path: '',
        name: 'recommend',
        component: () => import('@renderer/views/home/recommend.vue')
      },
      {
        path: '/playlist',
        name: 'playlist',
        component: () => import('@renderer/views/playlist/index.vue')
      },
      {
        path: '/rank',
        name: 'rank',
        component: () => import('@renderer/views/home/rank.vue')
      },
      {
        path: '/artist',
        name: 'artist',
        component: () => import('@renderer/views/home/artist.vue')
      }
    ]
  },
  {
    path: '/favorite',
    name: 'favorite',
    component: () => import('@renderer/views/favorite/index.vue'),
    meta: {
      title: '收藏',
      icon: 'favorite',
      home: true
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@renderer/views/history/index.vue'),
    meta: {
      title: '历史',
      icon: 'history',
      home: true
    }
  },
  {
    path: '/download',
    name: 'download',
    component: () => import('@renderer/views/download/index.vue'),
    meta: {
      title: '下载',
      icon: 'download',
      home: true
    }
  },
  {
    path: '/playlist/detail',
    name: 'playlistDetail',
    component: () => import('@renderer/views/playlist/detail.vue'),
    meta: {
      title: '歌单详情'
    }
  }
] as readonly RouteRecordRaw[]
