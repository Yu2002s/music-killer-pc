<script setup lang="ts">
import '@mdui/icons/favorite-border.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/play-arrow.js'
import '@mdui/icons/playlist-add.js'
import 'mdui/components/snackbar.js'
import { Music } from '@renderer/api/playlist/types'
import { useAudioStore } from '@renderer/store/modules/audio'
import { formatDuration } from '@renderer/utils/time'
import { ref, watch } from 'vue'

const audioStore = useAudioStore()

interface Props {
  list: Music[]
  /**
   * 点击播放时是否添加列表音乐
   */
  addListOnPlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  addListOnPlay: true
})
const isShowTips = ref(false)

watch(
  props.list,
  (value) => {
    // 检查歌曲是否被收藏
    if (value.length === 0) {
      return
    }
    value.forEach(async (item) => {
      item.isFavorite = await audioStore.isFavorite(item)
    })
  },
  {
    immediate: true,
    deep: false
  }
)

function play(m: Music, index: number) {
  if (props.addListOnPlay) {
    audioStore.addPlaylist(props.list, index)
  } else {
    audioStore.addPlay(m, true)
  }
}

function addPlay(m: Music) {
  audioStore.addPlay(m, false)
  isShowTips.value = true
}

function favorite(m: Music) {
  m.isFavorite = !m.isFavorite
  audioStore.favoriteMusic(m)
}

function getMusicCover(item: Music): string {
  if (item.pic120) {
    return item.pic120
  }
  return item.pic
}

function onCloseTips() {
  isShowTips.value = false
}
</script>

<template>
  <div class="music-list">
    <div
      v-for="(item, index) in list"
      :key="item.id"
      class="music-item"
      :class="{ active: audioStore.music.id === item.id }"
      @dblclick="play(item, index)"
    >
      <img class="music-img" :alt="item.name" :src="getMusicCover(item)" />
      <div class="music-info">
        <router-link class="music-name" :to="`/search?q=${item.name}`" :title="item.name">{{
          item.name
        }}</router-link>
        <router-link :to="`/artist/detail?id=${item.artistId}`" class="music-artist">{{
          item.artist
        }}</router-link>
      </div>
      <div class="music-album">
        <router-link :to="`/album/${item.albumId}`" class="album-text" :align="item.album">{{
          item.album
        }}</router-link>
      </div>
      <span class="music-duration">{{ formatDuration(item.duration) }}</span>
      <div class="music-control">
        <mdui-button-icon class="playlist-add" @click.stop="addPlay(item)">
          <mdui-icon-playlist-add> </mdui-icon-playlist-add>
        </mdui-button-icon>
        <mdui-button-icon class="play-arrow" @click.stop="play(item, index)">
          <mdui-icon-play-arrow> </mdui-icon-play-arrow>
        </mdui-button-icon>
        <mdui-button-icon class="favorite" @click.stop="favorite(item)">
          <mdui-icon-favorite-border v-if="!item.isFavorite"> </mdui-icon-favorite-border>
          <mdui-icon-favorite v-else> </mdui-icon-favorite>
        </mdui-button-icon>
      </div>
    </div>
    <mdui-snackbar
      :open="isShowTips"
      auto-close-delay="2000"
      close-on-outside-click
      @close="onCloseTips"
      >歌曲已添加</mdui-snackbar
    >
  </div>
</template>

<style scoped lang="scss">
.music-list {
  .music-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 8px;
    overflow: hidden;

    &.active {
      background-color: rgb(var(--mdui-color-secondary-container));
    }

    &:hover {
      &:not(.active) {
        background-color: rgba(
          var(--mdui-comp-ripple-state-layer-color, var(--mdui-color-on-surface)),
          var(--mdui-state-layer-hover)
        );
      }

      .music-control {
        .playlist-add,
        .play-arrow {
          visibility: visible;
        }
      }
    }

    .music-img {
      width: 50px;
      height: 50px;
      border-radius: 10px;
    }

    .music-info {
      width: 200px;
      overflow: hidden;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      align-items: start;

      .music-name {
        font-size: 15px;
      }

      .music-artist {
        font-size: 12px;
        color: #666;
        margin-top: 4px;
      }
    }

    .music-album {
      overflow: hidden;
      flex: 1;
      font-size: 13px;
      color: #666;
      text-align: center;
      margin: 0 10px;

      .album-text {
        display: inline-block;
      }
    }

    .music-control {
      text-align: right;

      .playlist-add,
      .play-arrow {
        visibility: hidden;
      }
    }

    .music-duration {
      margin-right: 10px;
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
