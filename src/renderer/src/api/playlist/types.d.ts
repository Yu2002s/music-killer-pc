import { PageParams } from '@renderer/types/http'

/**
 * xyz.jdynb.bean.music.entity.PlayListTag
 *
 * PlayListTag
 */
export interface PlayListTag {
  /**
   * 标签id
   */
  id?: string
  /**
   * 标签名称
   */
  name?: string
  [property: string]: any
}

/**
 * xyz.jdynb.bean.music.entity.PlayList
 *
 * PlayList
 */
export interface PlayList {
  desc?: string
  /**
   * 唯一id
   */
  id?: number
  /**
   * 歌单封面地址
   */
  img?: string
  /**
   * 歌单封面地址(700px)
   */
  img700?: string
  /**
   * 描述信息
   */
  info?: string
  /**
   * 听歌量
   */
  listencnt?: number
  /**
   * 歌曲列表
   */
  musicList?: Music[]
  /**
   * 歌单名称
   */
  name?: string
  /**
   * 所属标签
   */
  tag?: string
  /**
   * 歌曲数量
   */
  total: number
  /**
   * 用户名
   */
  uname: string
  [property: string]: any
}

/**
 * xyz.jdynb.bean.music.entity.Music
 *
 * Music
 */
export interface Music {
  /**
   * 专辑名称
   */
  album: string
  /**
   * 专辑id
   */
  albumId: number
  albumPic: string
  artist: string
  artistId: number
  artistPic: string
  /**
   * 歌曲时长,单位秒
   */
  duration: number
  /**
   * 歌曲展示名称
   */
  fullName: string
  /**
   * 是否有无损音质
   */
  hasLossless?: boolean
  hasMv?: number
  /**
   * 歌曲id
   */
  id: number
  /**
   * 歌曲名称
   */
  name: string
  /**
   * 封面图片
   */
  pic: string
  /**
   * 120px封面图片
   */
  pic120: string
  /**
   * 发行时间
   */
  releaseDate?: string
  [property: string]: any
}

/**
 * 查询歌单参数
 */
export interface QueryPlaylistParams extends PageParams {
  /**
   * 查询id类型
   */
  id?: string
  /**
   * 排序
   */
  order?: string
  /**
   * 歌单id
   */
  pid?: string
  [property: string]: any
}

/**
 * 获取歌单信息参数
 */
export interface QueryPlaylistInfoParams extends PageParams {
  /**
   * 查询id类型
   */
  id?: string
  /**
   * 排序
   */
  order?: string
  /**
   * 歌单id
   */
  pid?: string
  [property: string]: any
}
