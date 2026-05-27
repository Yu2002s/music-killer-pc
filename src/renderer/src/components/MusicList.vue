<script setup lang="ts">
import { Music } from '@renderer/api/playlist/types'
import '@mdui/icons/play-arrow.js'
import '@mdui/icons/favorite--outlined.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/playlist-add.js'
import { formatDuration } from '@renderer/utils/time'
import { useAudioStore } from '@renderer/store/modules/audio'

const audioStore = useAudioStore()

interface Props {
  list?: Music[]
}

const props = defineProps<Props>()

function play(_: Music, index: number) {
  audioStore.addPlaylist(props.list || [], index)
}
</script>

<template>
  <div class="music-list">
    <div v-for="(item, index) in list" :key="item.id" class="music-item">
      <img class="music-img" :alt="item.name" :src="item.pic120" />
      <div class="music-info">
        <router-link class="music-name" to="" :title="item.name">{{ item.name }}</router-link>
        <router-link class="music-artist" to="">{{ item.artist }}</router-link>
      </div>
      <div class="music-album">
        <router-link to="" class="album-text" :align="item.album">{{ item.album }}</router-link>
      </div>
      <span class="music-duration">{{ formatDuration(item.duration) }}</span>
      <div class="music-control">
        <mdui-button-icon class="playlist-add">
          <mdui-icon-playlist-add> </mdui-icon-playlist-add>
        </mdui-button-icon>
        <mdui-button-icon class="play-arrow" @click="play(item, index)">
          <mdui-icon-play-arrow> </mdui-icon-play-arrow>
        </mdui-button-icon>
        <mdui-button-icon class="favorite">
          <mdui-icon-favorite--outlined> </mdui-icon-favorite--outlined>
        </mdui-button-icon>
      </div>
    </div>
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

    &:hover {
      background-color: rgba(
        var(--mdui-comp-ripple-state-layer-color, var(--mdui-color-on-surface)),
        var(--mdui-state-layer-hover)
      );

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
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
