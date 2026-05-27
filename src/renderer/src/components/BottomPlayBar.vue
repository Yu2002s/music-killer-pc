<script setup lang="ts">
import 'mdui/components/button-icon.js'
import '@mdui/icons/play-arrow.js'
import '@mdui/icons/pause.js'
import '@mdui/icons/skip-next.js'
import '@mdui/icons/skip-previous.js'
import '@mdui/icons/favorite.js'
import '@mdui/icons/playlist-play.js'
import '@mdui/icons/loop.js'
import 'mdui/components/slider.js'
import { onMounted, ref } from 'vue'
import { useAudioStore } from '@renderer/store/modules/audio'
import { formatDuration } from '@renderer/utils/time'
import PlaylistPopup from '@renderer/components/PlaylistPopup.vue'
const audioStore = useAudioStore()

const isShowPlaylist = ref(false)

onMounted(() => {})
</script>

<template>
  <div class="bottom-play-bar">
    <img class="music-img" :src="audioStore.music.pic" :alt="audioStore.music.name" />
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
      <mdui-button-icon>
        <mdui-icon-skip-previous></mdui-icon-skip-previous>
      </mdui-button-icon>
      <mdui-button-icon style="width: 50px; height: 50px" @click="audioStore.playOrPause">
        <mdui-icon-pause v-if="audioStore.isPlaying"></mdui-icon-pause>
        <mdui-icon-play-arrow v-else></mdui-icon-play-arrow>
      </mdui-button-icon>
      <mdui-button-icon>
        <mdui-icon-skip-next></mdui-icon-skip-next>
      </mdui-button-icon>
    </div>
    <div class="music-operator">
      <mdui-button-icon>
        <mdui-icon-favorite></mdui-icon-favorite>
      </mdui-button-icon>
      <mdui-button-icon>
        <mdui-icon-loop></mdui-icon-loop>
      </mdui-button-icon>
      <mdui-button-icon @click="isShowPlaylist = !isShowPlaylist">
        <mdui-icon-playlist-play></mdui-icon-playlist-play>
      </mdui-button-icon>
    </div>

    <div class="progress">
      <mdui-slider
        :value="audioStore.progress"
        :max="audioStore.music.duration"
        step="1"
      ></mdui-slider>
    </div>

    <playlist-popup v-model="isShowPlaylist"></playlist-popup>
  </div>
</template>

<style scoped lang="scss">
.bottom-play-bar {
  width: 100%;
  display: flex;
  align-items: center;

  .audio-player {
  }

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
