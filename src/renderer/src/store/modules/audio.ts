import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { Music } from '@renderer/api/playlist/types'
import icon from '@renderer/assets/electron.svg'
import { getPlayInfo } from '@renderer/api/play'

export const useAudioStore = defineStore('audio', () => {
  const audio = new Audio()

  setInterval(() => {
    progress.value = Math.floor(audio.currentTime)
  }, 1000)

  onMounted(() => {
    audio.addEventListener('pause', () => {
      isPlaying.value = false
    })
    audio.addEventListener('play', () => {
      isPlaying.value = true
    })

    audio.addEventListener('progress', (e) => {
      console.log('progress', e, e.loaded / e.total)
    })
  })

  const music = ref<Music>({
    name: 'MusicKiller',
    artist: 'Yu2002s',
    album: '',
    albumId: 0,
    pic120: icon,
    pic: icon,
    albumPic: '',
    artistId: 0,
    artistPic: '',
    duration: 0,
    fullName: '',
    id: 0
  })
  const playlist = ref<Music[]>([])

  const progress = ref(0)
  const isPlaying = ref(false)

  watch(music, async (value: Music) => {
    progress.value = 0
    const playInfo = await getPlayInfo({
      id: value.id,
      bridge: '128kmp3'
    })
    audio.src = playInfo.url
    audio.currentTime = 0
    play()
  })

  function play(m: Music | undefined = undefined) {
    if (!m) {
      audio.play()
      return
    }

    const index = playlist.value.findIndex((item) => item.id === m.id)
    if (index !== -1) {
      music.value = m
      if (!isPlaying.value) {
        play()
      }
      /*if (index !== 0) {
        playlist.value.splice(index, 1)
        playlist.value.unshift(m)
      }*/
      return
    }
    // 不存在队列
    addPlay(m)
  }

  function pause() {
    audio.pause()
  }

  function playOrPause() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  function addPlay(m: Music) {
    music.value = m
    playlist.value.unshift(m)
  }

  function addPlaylist(list: Music[], start: number = 0) {
    const length = list.length
    if (length === 0) return
    const subCount = Math.min(20, length)
    const subList = list.slice(start, subCount)
    music.value = subList[0]
    playlist.value.unshift(...subList)
  }

  function setProgress(p: number) {
    progress.value = p
  }

  return {
    audio,
    music,
    playlist,
    progress,
    isPlaying,
    setProgress,
    play,
    pause,
    playOrPause,
    addPlay,
    addPlaylist
  }
})
