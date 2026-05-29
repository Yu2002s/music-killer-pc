import { defineDict } from '@renderer/utils/dict'

/**
 * 循环模式
 */
export enum LoopMode {
  /**
   * 顺序播放
   */
  SEQUENCE = 1,
  /**
   * 随机播放
   */
  SHUFFLE = 2,
  /**
   * 单曲循环
   */
  REPEAT = 3
}

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
 * 音质
 */
export enum Bridge {
  /**
   * 128k
   */
  MP3 = '128kmp3',
  /**
   * 2000k
   */
  FLAC = '2000kflac'
}

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
