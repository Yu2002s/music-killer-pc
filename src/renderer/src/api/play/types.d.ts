export interface QueryPlayInfoParams {
  id: number
  bridge: '128kmp3' | '2000kflac'
}

/**
 * PlayInfo
 */
export interface PlayInfo {
  /**
   * 码率
   */
  bitrate?: number
  /**
   * 时长
   */
  duration: number
  format?: string
  /**
   * 歌曲id
   */
  musicId?: number
  sig?: string
  source?: string
  type?: number
  /**
   * 播放地址
   */
  url: string
  user?: string
  [property: string]: any
}
