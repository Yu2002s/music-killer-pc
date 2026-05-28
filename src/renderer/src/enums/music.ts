/**
 * 循环模式
 */
export enum LoopMode {
  SEQUENCE,
  SHUFFLE
}

export enum Bridge {
  MP3 = '128kmp3',
  FLAC = '2000kflac'
}

export type QualityType = {
  [K in keyof typeof Bridge]: {
    label: string
    value: (typeof Bridge)[K]
  }
}

export const Quality: QualityType = {
  MP3: {
    label: '流畅',
    value: Bridge.MP3
  },
  FLAC: {
    label: '无损',
    value: Bridge.FLAC
  }
}

export type QualityItem = QualityType[keyof typeof Quality]
