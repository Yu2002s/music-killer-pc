import HomeView from '@renderer/views/home/index.vue'
import { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/',
    component: HomeView,
    name: 'Home',
    meta: {
      title: '首页',
      icon: 'Home',
      home: true
    },
    children: [
      {
        path: '',
        name: 'Recommend',
        component: () => import('@renderer/views/home/recommend.vue')
      },
      {
        path: '/playlist',
        name: 'Playlist',
        component: () => import('@renderer/views/playlist/index.vue')
      },
      {
        path: '/rank',
        name: 'Rank',
        component: () => import('@renderer/views/home/rank.vue')
      },
      {
        path: '/artist',
        name: 'Artist',
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
      icon: 'Favorite',
      home: true
    }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@renderer/views/history/index.vue'),
    meta: {
      title: '历史',
      icon: 'history',
      home: true
    }
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('@renderer/views/download/index.vue'),
    meta: {
      title: '下载',
      icon: 'download',
      home: true
    }
  },
  {
    path: '/search',
    component: () => import('@renderer/views/search/index.vue'),
    meta: {
      title: '搜索',
      icon: 'search'
    },
    children: [
      {
        path: '',
        name: 'Search',
        component: () => import('@renderer/views/search/music.vue')
      },
      {
        path: 'playlist',
        component: () => import('@renderer/views/search/playlist.vue')
      },
      {
        path: 'album',
        component: () => import('@renderer/views/search/album.vue')
      },
      {
        path: 'artist',
        component: () => import('@renderer/views/search/artist.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('@renderer/views/setting/index.vue'),
    meta: {
      title: '设置',
      icon: 'setting'
    }
  },
  {
    path: '/playlist/detail',
    name: 'PlaylistDetail',
    component: () => import('@renderer/views/playlist/detail.vue'),
    meta: {
      title: '歌单详情'
    }
  },
  {
    path: '/playlist/tag/:id',
    component: () => import('@renderer/views/playlist/tag.vue'),
    meta: {
      title: '歌单分类'
    }
  },
  {
    path: '/rank/list',
    component: () => import('@renderer/views/rank/list.vue'),
    meta: {
      title: '排行榜歌曲'
    }
  },
  {
    path: '/artist/detail',
    component: () => import('@renderer/views/artist/detail.vue'),
    meta: {
      title: '歌手详情'
    },
    children: [
      {
        path: '',
        component: () => import('@renderer/views/artist/music.vue')
      },
      {
        path: 'album',
        component: () => import('@renderer/views/artist/album.vue')
      }
    ]
  },
  {
    path: '/album/:id',
    component: () => import('@renderer/views/album/index.vue'),
    meta: {
      title: '专辑歌曲'
    }
  }
] as readonly RouteRecordRaw[]
