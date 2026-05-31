import { defineDict } from '@renderer/utils/dict'
import { Bridge, LoopMode } from '@renderer/enums/music'

/**
 * 循环模式字典
 */
export const loopModeDict = defineDict<typeof LoopMode>({
  SEQUENCE: {
    label: '顺序播放',
    value: LoopMode.SEQUENCE
  },
  SHUFFLE: {
    label: '随机播放',
    value: LoopMode.SHUFFLE
  },
  REPEAT: {
    label: '单曲循环',
    value: LoopMode.REPEAT
  }
})

/**
 * 音质字典
 */
export const qualityDict = defineDict<typeof Bridge>({
  MP3: {
    label: '流畅',
    value: Bridge.MP3
  },
  FLAC: {
    label: '无损',
    value: Bridge.FLAC
  }
})
