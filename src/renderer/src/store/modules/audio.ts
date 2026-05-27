import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { Music } from '@renderer/api/playlist/types'
import icon from '@renderer/assets/electron.svg'
import { getPlayInfo } from '@renderer/api/play'
import { addData, deleteData, getDataByKey, updateData } from '@renderer/db'
import { DBStoreName } from '@renderer/enums/store'
import { StorageKey } from '@renderer/enums/storage'
import { LoopMode } from '@renderer/enums/music'

export const useAudioStore = defineStore('audio', () => {
  const audio = new Audio()

  setInterval(() => {
    if (isTrackProgress.value) {
      return
    }
    progress.value = Math.floor(audio.currentTime)
  }, 1000)

  audio.addEventListener('pause', () => {
    isPlaying.value = false
  })

  audio.addEventListener('play', () => {
    isPlaying.value = true
  })

  audio.addEventListener('ended', () => {
    console.log('ended')
    // 默认顺序播放
    playNext()
  })

  audio.addEventListener('progress', (e) => {
    console.log('progress', e, e.loaded / e.total)
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
    id: 0,
    isFavorite: false,
    updateTime: Date.now()
  })
  const playlist = ref<Music[]>([])

  // 循环模式
  const loopMode = ref<number>(
    Number(localStorage.getItem(StorageKey.LOOP_MODE) || LoopMode.SEQUENCE)
  )
  const progress = ref(0)
  const isTrackProgress = ref(false)
  const isPlaying = ref(false)
  const volume = ref(audio.volume)
  const currentIndex = computed({
    get() {
      return playlist.value.findIndex((item) => item.id === music.value.id)
    },
    set(val) {
      const length = playlist.value.length
      if (!length || val === length || val < 0) {
        return
      }
      if (music.value.id !== playlist.value[val].id) {
        // 设置播放的音乐
        music.value = playlist.value[val]
      }
    }
  })

  watch(music, async (value: Music) => {
    progress.value = 0
    const playInfo = await getPlayInfo({
      id: value.id,
      bridge: '128kmp3'
    })
    audio.src = playInfo.url
    audio.currentTime = 0
    play()
    // 保存历史数据
    saveHistory(value)
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

  function addPlay(m: Music, play: boolean = true) {
    if (play) {
      music.value = m
      playlist.value.unshift(m)
    } else {
      playlist.value.push(m)
    }
  }

  function addPlaylist(list: Music[], start: number = 0) {
    const length = list.length
    if (length === 0) return
    const subCount = Math.min(20, length - start)
    const subList = list.slice(start, start + subCount)
    music.value = subList[0]
    playlist.value.unshift(...subList)
  }

  function setProgress(p: number) {
    progress.value = p
    audio.currentTime = p
  }

  function playRandom() {
    const length = playlist.value.length
    if (length === 0) return
    let index = getRandomNumber(0, length - 1)
    while (index === currentIndex.value) {
      index = getRandomNumber(0, length - 1)
    }
    // 乱序
    currentIndex.value = index
  }

  function playNext() {
    const length = playlist.value.length
    if (length === 0) return
    if (loopMode.value == LoopMode.SEQUENCE) {
      // 顺序
      if (currentIndex.value >= length - 1) {
        // 最后一个
        currentIndex.value = 0
      } else {
        currentIndex.value++
      }
    } else if (loopMode.value == LoopMode.SHUFFLE) {
      playRandom()
    }
  }

  function playPrev() {
    const length = playlist.value.length
    if (loopMode.value == LoopMode.SEQUENCE) {
      if (currentIndex.value === 0) {
        currentIndex.value = length - 1
      } else {
        currentIndex.value--
      }
    } else if (loopMode.value == LoopMode.SHUFFLE) {
      playRandom()
    }
  }

  function startTrackProgress() {
    isTrackProgress.value = true
  }

  function stopTrackProgress() {
    isTrackProgress.value = false
  }

  function removeMusic(m: Music) {
    playlist.value.splice(playlist.value.indexOf(m), 1)
  }

  function clearPlaylist() {
    playlist.value = []
  }

  function setLoopMode(mode: LoopMode) {
    loopMode.value = mode
    localStorage.setItem(StorageKey.LOOP_MODE, mode.toString())
  }

  function favoriteMusic(m: Music, reverse: boolean = false) {
    const isFavorite = reverse ? !m.isFavorite : m.isFavorite
    if (isFavorite) {
      addData(DBStoreName.FAVORITE, m)
    } else {
      deleteData(DBStoreName.FAVORITE, m.id)
    }
    if (music.value.id === m.id) {
      music.value.isFavorite = isFavorite
      return
    }
    const existsMusic = playlist.value.find((item) => item.id === m.id)
    if (existsMusic) {
      existsMusic.isFavorite = isFavorite
    }
  }

  async function isFavorite(m: Music) {
    return !!(await getDataByKey<Music>(DBStoreName.FAVORITE, m.id))
  }

  function setVolume(val: number) {
    volume.value = val
    audio.volume = val
  }

  return {
    currentIndex,
    audio,
    music,
    playlist,
    progress,
    isPlaying,
    volume,
    loopMode,
    setProgress,
    play,
    pause,
    playOrPause,
    addPlay,
    addPlaylist,
    playNext,
    playPrev,
    startTrackProgress,
    stopTrackProgress,
    removeMusic,
    clearPlaylist,
    setLoopMode,
    favoriteMusic,
    isFavorite,
    setVolume
  }
})

/**
 * 保存历史数据
 * @param music 音乐对象
 */
async function saveHistory(music: Music) {
  const existsMusic = await getDataByKey<Music>(DBStoreName.HISTORY, music.id)
  music.updateTime = Date.now()
  if (!existsMusic) {
    // 添加
    addData(DBStoreName.HISTORY, music)
  } else {
    // 更新
    updateData(DBStoreName.HISTORY, music)
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
