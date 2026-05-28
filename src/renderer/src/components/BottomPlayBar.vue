<script setup lang="ts">
import '@mdui/icons/arrow-right-alt.js'
import '@mdui/icons/favorite-border.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/high-quality.js'
import '@mdui/icons/pause.js'
import '@mdui/icons/play-arrow.js'
import '@mdui/icons/queue-music.js'
import '@mdui/icons/shuffle.js'
import '@mdui/icons/skip-next.js'
import '@mdui/icons/skip-previous.js'
import '@mdui/icons/volume-off.js'
import '@mdui/icons/volume-up.js'
import PlaylistPopup from '@renderer/components/PlaylistPopup.vue'
import PopupWindow from '@renderer/components/PopupWindow.vue'
import VolumeBar from '@renderer/components/VolumeBar.vue'
import { LoopMode, QualityItem } from '@renderer/enums/music'
import { useAudioStore } from '@renderer/store/modules/audio'
import { useLayoutStore } from '@renderer/store/modules/layout.js'
import { formatDuration } from '@renderer/utils/time'
import 'mdui/components/button'
import 'mdui/components/button-icon.js'
import 'mdui/components/slider.js'
import { computed, nextTick, onMounted, ref } from 'vue'
import PlayerView from './PlayerView.vue'
import QualitySelector from './QualitySelector.vue'

const audioStore = useAudioStore()
const layoutStore = useLayoutStore()

const isShowPlaylist = ref(false)
const isShowVolumeBar = ref(false)
const isShowQuality = ref(false)
const slider = ref<any | null>(null)

function onMouseDown() {
  audioStore.startTrackProgress()
}

async function onMouseUp(e) {
  await nextTick()
  console.log('onMouseUp', e.target.value)
  audioStore.setProgress(e.target.value)
  audioStore.stopTrackProgress()
}

onMounted(() => {
  slider.value.labelFormatter = (value: number) => {
    return formatDuration(value)
  }
})

function setLoopMode() {
  audioStore.setLoopMode(
    audioStore.loopMode === LoopMode.SEQUENCE ? LoopMode.SHUFFLE : LoopMode.SEQUENCE
  )
}

function favorite() {
  audioStore.favoriteMusic(audioStore.music, true)
}

function onQualityChange(e: QualityItem) {
  isShowQuality.value = false
  audioStore.setQuality(e)
}
</script>

<template>
  <div class="bottom-play-bar">
    <img
      class="music-img"
      :src="audioStore.music.pic"
      :alt="audioStore.music.name"
      @click="layoutStore.isExpandBottomBar = !layoutStore.isExpandBottomBar"
    />
    <div class="music-info">
      <router-link class="name" to="">{{ audioStore.music.name }}</router-link>
      <div class="desc">
        <router-link class="artist" to="">{{ audioStore.music.artist }}</router-link>
        <span class="time"
          >{{ formatDuration(audioStore.progress) }}/{{
            formatDuration(audioStore.music.duration)
          }}</span
        >
      </div>
    </div>
    <div style="flex: 1"></div>
    <div class="music-control">
      <mdui-button-icon title="上一首">
        <mdui-icon-skip-previous @click="audioStore.playPrev"></mdui-icon-skip-previous>
      </mdui-button-icon>
      <mdui-button-icon
        title="播放/暂停"
        style="width: 50px; height: 50px; margin: 0 10px"
        variant="filled"
        @click="audioStore.playOrPause"
      >
        <mdui-icon-pause v-if="audioStore.isPlaying"></mdui-icon-pause>
        <mdui-icon-play-arrow v-else></mdui-icon-play-arrow>
      </mdui-button-icon>
      <mdui-button-icon title="下一首" @click="audioStore.playNext">
        <mdui-icon-skip-next></mdui-icon-skip-next>
      </mdui-button-icon>
    </div>
    <div class="music-operator">
      <mdui-button title="音质" variant="text" @click="isShowQuality = true">{{
        audioStore.quality.label
      }}</mdui-button>
      <mdui-button-icon title="设置音量" @click="isShowVolumeBar = true">
        <mdui-icon-volume-up v-if="audioStore.volume > 0"></mdui-icon-volume-up>
        <mdui-icon-volume-off v-else></mdui-icon-volume-off>
      </mdui-button-icon>
      <mdui-button-icon title="收藏/取消收藏" @click="favorite">
        <mdui-icon-favorite-border v-if="!audioStore.music.isFavorite"></mdui-icon-favorite-border>
        <mdui-icon-favorite v-else></mdui-icon-favorite>
      </mdui-button-icon>
      <mdui-button-icon
        :title="audioStore.loopMode === LoopMode.SEQUENCE ? '顺序播放' : '随机播放'"
        @click="setLoopMode"
      >
        <mdui-icon-arrow-right-alt
          v-if="audioStore.loopMode === LoopMode.SEQUENCE"
        ></mdui-icon-arrow-right-alt>
        <mdui-icon-shuffle v-else-if="audioStore.loopMode === LoopMode.SHUFFLE"></mdui-icon-shuffle>
      </mdui-button-icon>
      <mdui-button-icon title="打开播放队列" @click="isShowPlaylist = !isShowPlaylist">
        <mdui-icon-queue-music></mdui-icon-queue-music>
      </mdui-button-icon>
    </div>

    <div class="progress">
      <mdui-slider
        ref="slider"
        :value="audioStore.progress"
        :max="audioStore.music.duration"
        step="1"
        @change="onMouseUp"
        @focus="onMouseDown"
      ></mdui-slider>
    </div>

    <player-view></player-view>

    <popup-window v-model="isShowPlaylist" animation="slide-right-left-fade">
      <playlist-popup></playlist-popup>
    </popup-window>
    <popup-window v-model="isShowVolumeBar">
      <volume-bar></volume-bar>
    </popup-window>
    <popup-window v-model="isShowQuality">
      <quality-selector
        v-model="audioStore.quality"
        @update:model-value="onQualityChange"
      ></quality-selector>
    </popup-window>
  </div>
</template>

<style scoped lang="scss">
.bottom-play-bar {
  width: 100%;
  display: flex;
  align-items: center;

  .music-img {
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
  }

  .music-info {
    margin-left: 10px;

    .name {
      font-size: 16px;
      font-weight: bold;
    }

    .desc {
      font-size: 13px;
      color: #333;
      margin-top: 6px;

      .time {
        display: inline-block;
        margin-left: 10px;
      }
    }
  }

  .music-control {
    flex: 1;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .progress {
    position: absolute;
    left: 0;
    top: -18px;
    width: 100%;
  }
}
</style>
