import { Music } from '@renderer/api/playlist/types'

/**
 * xyz.jdynb.bean.music.entity.RankMenu
 *
 * RankMenu
 */
export interface RankMenu {
  list?: Item[]
  name?: string
  [property: string]: any
}

/**
 * xyz.jdynb.bean.music.entity.RankMenu.Item
 *
 * Item
 */
export interface Item {
  id?: string
  intro?: string
  name?: string
  pic?: string
  pub?: string
  source?: string
  sourceId?: string
  [property: string]: any
}

export interface QueryRankParams {
  /**
   * 页码
   */
  pageNo: number
  /**
   * pageSize
   */
  pageSize: number
  /**
   * 排行榜 id
   * 排行榜id
   */
  rankId: string
  [property: string]: any
}

/**
 * MusicRank
 */
export interface MusicRank {
  id?: number
  leader?: string
  musicList?: Music[]
  name?: string
  num?: number
  pic?: string
  pub?: string
  [property: string]: any
}
