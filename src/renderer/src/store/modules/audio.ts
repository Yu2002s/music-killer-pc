import { getMusicLyric } from '@renderer/api/lyric'
import { getPlayInfo } from '@renderer/api/play'
import { Music } from '@renderer/api/playlist/types'
import icon from '@renderer/assets/electron.svg'
import { addData, deleteData, getDataByKey, updateData } from '@renderer/db'
import { Bridge, LoopMode, loopModeDict, qualityDict } from '@renderer/enums/music'
import { StorageKey } from '@renderer/enums/storage'
import { DBStoreName } from '@renderer/enums/store'
import { getSavedDictValue, saveDictValue } from '@renderer/utils/dict'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const audio = new Audio()

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

  audio.addEventListener('timeupdate', (e: any) => {
    if (isTrackProgress.value) {
      return
    }
    currentTime.value = e.target.currentTime * 1000
    progress.value = Math.floor(e.target.currentTime)
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

  // 音乐播放列表
  const musicList = ref<Music[]>([])

  // 循环模式
  const loopMode = ref<LoopMode>(
    getSavedDictValue(loopModeDict, StorageKey.LOOP_MODE, LoopMode.SEQUENCE)
  )
  // 进度条进度
  const progress = ref(0)
  // 当前播放时间
  const currentTime = ref(0)
  // 是否正在修改进度
  const isTrackProgress = ref(false)
  // 是否正在播放
  const isPlaying = ref(false)
  // 音量
  const volume = ref(audio.volume)
  // 歌词内容
  const lrcContent = ref<string>('')

  // 音质
  const quality = ref<Bridge>(getSavedDictValue(qualityDict, StorageKey.BRIDGE, Bridge.MP3))

  // 单曲播放歌曲的索引位置
  const currentIndex = computed({
    get() {
      return musicList.value.findIndex((item) => item.id === music.value.id)
    },
    set(val) {
      const length = musicList.value.length
      if (!length || val === length || val < 0) {
        return
      }
      if (music.value.id !== musicList.value[val].id) {
        // 设置播放的音乐
        music.value = musicList.value[val]
      }
    }
  })

  /**
   * 通过指定码率播放音乐
   * @param id 音乐id
   * @param bridge 码率
   */
  async function playForBridge(id: number, bridge: Bridge) {
    if (id === 0) return
    progress.value = 0
    try {
      const playInfo = await getPlayInfo({
        id,
        bridge
      })
      console.log('playInfo: ', playInfo)
      audio.src = playInfo.url
      audio.currentTime = 0
      play()
    } catch (error) {
      alert(error.message)
    }
  }

  // 监听音质改变
  watch(quality, (value) => {
    playForBridge(music.value.id, value)
  })

  // 监听音乐切换
  watch(music, async (value: Music) => {
    playForBridge(value.id, quality.value)
    // 保存历史数据
    saveHistory(value)
    const lyricContent = await getMusicLyric(value.id)
    const decryptedLyricContent = await window.api.music.decryptLyric(lyricContent, false)
    lrcContent.value = decryptedLyricContent
  })

  /**
   * 播放音乐
   * @param m 音乐对象
   */
  function play(m: Music | undefined = undefined) {
    if (!m) {
      audio.play()
      return
    }

    const index = musicList.value.findIndex((item) => item.id === m.id)
    if (index !== -1) {
      music.value = m
      if (!isPlaying.value) {
        play()
      }
      return
    }
    // 不存在队列
    addPlay(m)
  }

  /**
   * 暂停
   */
  function pause() {
    audio.pause()
  }

  /**
   * 播放或暂停
   */
  function playOrPause() {
    if (isPlaying.value) {
      pause()
    } else {
      play()
    }
  }

  /**
   * 添加到播放队列
   * @param m 音乐对象
   * @param play 是否立即播放
   */
  function addPlay(m: Music, play: boolean = true) {
    if (play) {
      music.value = m
      musicList.value.unshift(m)
    } else {
      musicList.value.push(m)
    }
  }

  /**
   * 添加播放列表到播放队列
   * @param list 音乐列表
   * @param start 开始位置
   */
  function addPlaylist(list: Music[], start: number = 0) {
    const length = list.length
    if (length === 0) return
    const subCount = Math.min(20, length - start)
    const subList = list.slice(start, start + subCount)
    music.value = subList[0]
    musicList.value.unshift(...subList)
  }

  /**
   * 设置进度
   * @param p 秒
   */
  function setProgress(p: number) {
    progress.value = p
    audio.currentTime = p
  }

  /**
   * 随机播放
   */
  function playRandom() {
    const length = musicList.value.length
    if (length === 0) return
    let index = getRandomNumber(0, length - 1)
    while (index === currentIndex.value) {
      index = getRandomNumber(0, length - 1)
    }
    // 乱序
    currentIndex.value = index
  }

  /**
   * 播放下一首
   */
  function playNext() {
    const length = musicList.value.length
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
    } else {
      // loop 单曲循环
    }
  }

  /**
   * 播放上一首
   */
  function playPrev() {
    const length = musicList.value.length
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

  /**
   * 开始调整进度
   */
  function startTrackProgress() {
    isTrackProgress.value = true
  }

  /**
   * 停止调整进度
   */
  function stopTrackProgress() {
    isTrackProgress.value = false
  }

  /**
   * 从播放队列删除指定音乐
   * @param m 音乐对象
   */
  function removeMusic(m: Music) {
    musicList.value.splice(musicList.value.indexOf(m), 1)
  }

  /**
   * 清除播放列表
   */
  function clearPlaylist() {
    musicList.value = []
  }

  /**
   * 设置循环播放模式
   * @param mode 模式
   * @see LoopMode
   */
  function setLoopMode(mode: LoopMode) {
    loopMode.value = mode
    saveDictValue(loopModeDict, StorageKey.LOOP_MODE, mode)
  }

  /**
   * 收藏音乐
   * @param m 音乐对象
   * @param reverse 状态反转
   */
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
    const existsMusic = musicList.value.find((item) => item.id === m.id)
    if (existsMusic) {
      existsMusic.isFavorite = isFavorite
    }
  }

  /**
   * 是否收藏
   * @param m 音乐对象
   */
  async function isFavorite(m: Music) {
    return !!(await getDataByKey<Music>(DBStoreName.FAVORITE, m.id))
  }

  /**
   * 设置音量
   * @param val 音量（1-100)
   */
  function setVolume(val: number) {
    volume.value = val
    audio.volume = val
  }

  /**
   * 设置音质
   * @param q 音质等级
   */
  function setQuality(q: Bridge) {
    quality.value = q
    saveDictValue(qualityDict, StorageKey.BRIDGE, q)
  }

  return {
    currentIndex,
    audio,
    music,
    musicList,
    currentTime,
    progress,
    isPlaying,
    volume,
    loopMode,
    quality,
    lrcContent,
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
    setVolume,
    setQuality
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

/**
 * 获取指定范围的随机值
 * @param min 最小值
 * @param max 最大值
 * @returns 返回范围随机值
 */
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
