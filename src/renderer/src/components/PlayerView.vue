<template>
  <Transition name="slide-bottom-top-fade">
    <div v-show="layoutStore.isExpandBottomBar" class="popup">
      <div class="player">
        <img class="music-img" :src="getMusicCover(audioStore.music)" />
        <div class="lyric-section">
          <div class="music-info">
            <div class="music-name">{{ audioStore.music.name }}</div>
            <div class="music-artist">{{ audioStore.music.artist }}</div>
          </div>
          <LyricView
            v-model="audioStore.currentTime"
            :lyric-content="audioStore.lrcContent"
            style="flex: 1; overflow: hidden; padding-top: 20px"
            @select-item="onSelectItem"
          ></LyricView>
        </div>
        <!-- <LyricPlayer ref="player" style="" :lyric-lines="toRaw(audioStore.lrcLines)"></LyricPlayer> -->
        <mdui-button-icon class="btn-close" @click="close">
          <mdui-icon-close></mdui-icon-close>
        </mdui-button-icon>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import '@mdui/icons/close'
import { Music } from '@renderer/api/playlist/types'
import { useAudioStore } from '@renderer/store/modules/audio'
import { useLayoutStore } from '@renderer/store/modules/layout'
import 'mdui/components/button'
import { onMounted, ref, toRaw } from 'vue'
import LyricView from './LyricView.vue'

const layoutStore = useLayoutStore()
const audioStore = useAudioStore()

function close() {
  layoutStore.isExpandBottomBar = false
}

function getMusicCover(item: Music): string {
  if (item.pic) {
    return item.pic
  }
  return item.pic120
}

function onSelectItem(startTime: number) {
  audioStore.setProgress(startTime / 1000)
  audioStore.play()
}
</script>

<style scoped lang="scss">
.popup {
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  width: 100vw;
  height: calc(100vh - 80px);
}

.player {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: calc(100vh - 88px);
  background-color: rgb(var(--mdui-color-background));
  display: flex;
  gap: 60px;
  align-items: center;
  padding: 30px 80px;
  box-sizing: border-box;

  .music-img {
    border-radius: 10px;
    overflow: hidden;
    width: 300px;
    height: 300px;
  }
}

.lyric-section {
  flex: 1;
  align-self: flex-start;
  height: 100%;
  display: flex;
  flex-direction: column;

  .music-info {
    text-align: center;

    .music-name {
      font-size: 18px;
      font-weight: bold;
    }

    .music-artist {
      color: #333;
      font-size: 14px;
      margin-top: 10px;
    }
  }
}

.btn-close {
  position: absolute;
  left: 40px;
  top: 30px;
}

.amll-lyric-player {
  height: 100%;
}

/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-bottom-top-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-bottom-top-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-bottom-top-fade-enter-from,
.slide-bottom-top-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
