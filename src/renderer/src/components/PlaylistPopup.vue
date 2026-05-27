<script setup lang="ts">
import { useAudioStore } from '@renderer/store/modules/audio'

const audioStore = useAudioStore()

const isShow = defineModel({
  type: Boolean,
  default: false
})
</script>

<template>
  <div v-show="isShow" class="playlist-popup" @click="isShow = false">
    <div class="playlist-content" @click.stop>
      <div class="playlist-title">播放队列({{ audioStore.playlist.length }})</div>
      <div class="music-list">
        <div
          v-for="item in audioStore.playlist"
          :key="item.id"
          class="music-item"
          @click="audioStore.play(item)"
        >
          <img class="music-img" :src="item.pic" />
          <div class="music-info">
            <router-link to="" class="music-name">{{ item.name }}</router-link>
            <router-link to="" class="music-artist">{{ item.artist }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playlist-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  .playlist-content {
    position: absolute;
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

  .playlist-title {
    font-size: 18px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }

  .music-list {
    .music-item {
      display: flex;
      align-items: center;
      padding: 6px;
      border-radius: 6px;
      overflow: hidden;

      &:hover {
        background-color: rgba(
          var(--mdui-comp-ripple-state-layer-color, var(--mdui-color-on-surface)),
          var(--mdui-state-layer-hover)
        );
      }

      .music-img {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 4px;
      }

      .music-info {
        width: 100%;
        margin-left: 8px;
        display: flex;
        flex-direction: column;

        .music-name {
          font-size: 16px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .music-artist {
          margin-top: 4px;
          font-size: 14px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #888;
        }
      }
    }
  }
}
</style>
