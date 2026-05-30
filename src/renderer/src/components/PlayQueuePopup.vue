<script setup lang="ts">
import '@mdui/icons/clear-all.js'
import '@mdui/icons/clear.js'
import '@mdui/icons/favorite-border.js'
import '@mdui/icons/favorite.js'
import { Music } from '@renderer/api/playlist/types'
import { useAudioStore } from '@renderer/store/modules/audio'

const audioStore = useAudioStore()

function favorite(item: Music) {
  console.log(item)
  audioStore.favoriteMusic(item, true)
}

function deleteItem(item: Music) {
  audioStore.removeMusic(item)
}

function clearAll() {
  audioStore.clearPlaylist()
}
</script>

<template>
  <div class="playlist-content">
    <div class="playlist-header">
      <div class="playlist-title">播放队列({{ audioStore.musicList.length }})</div>
      <mdui-button-icon title="清空队列" @click="clearAll">
        <mdui-icon-clear-all></mdui-icon-clear-all>
      </mdui-button-icon>
    </div>
    <div class="music-list">
      <div
        v-for="item in audioStore.musicList"
        :key="item.id"
        class="music-item"
        :class="{ active: audioStore.music.id === item.id }"
        @dblclick="audioStore.play(item)"
      >
        <img class="music-img" :src="item.pic" :alt="item.name" />
        <div class="music-info">
          <router-link :to="`/search?q=${item.name}`" class="music-name" :title="item.name">{{
            item.name
          }}</router-link>
          <router-link to="" class="music-artist">{{ item.artist }}</router-link>
        </div>
        <mdui-button-icon
          title="收藏/取消收藏"
          class="btn-item btn-favorite"
          @click="favorite(item)"
        >
          <mdui-icon-favorite-border v-if="!item.isFavorite"> </mdui-icon-favorite-border>
          <mdui-icon-favorite v-else> </mdui-icon-favorite>
        </mdui-button-icon>
        <mdui-button-icon title="移除播放" class="btn-item btn-delete" @click="deleteItem(item)">
          <mdui-icon-clear> </mdui-icon-clear>
        </mdui-button-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playlist-content {
  position: fixed;
  z-index: 4000;
  bottom: 100px;
  right: 30px;
  height: 400px;
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.music-list {
  flex: 1;
  height: 100%;
  overflow: auto;
}

.playlist-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.playlist-title {
  font-size: 18px;
}

.music-list {
  .music-item {
    display: flex;
    align-items: center;
    padding: 6px;
    border-radius: 6px;
    overflow: hidden;

    &.active {
      background-color: rgba(var(--mdui-color-secondary-container));
    }

    &:hover {
      &:not(.active) {
        background-color: rgba(
          var(--mdui-comp-ripple-state-layer-color, var(--mdui-color-on-surface)),
          var(--mdui-state-layer-hover)
        );
      }

      .btn-item {
        display: inline-block;
      }
    }

    .music-img {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 4px;
    }

    .btn-item {
      display: none;
    }

    .music-info {
      width: 100%;
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      align-items: start;

      .music-name {
        font-size: 14px;
      }

      .music-artist {
        margin-top: 4px;
        font-size: 12px;
        color: #888;
      }
    }
  }
}
</style>
