export interface QueryArtistParams {
  /**
   * 分类
   */
  category: number
  /**
   * 页码
   */
  pageNo: number
  /**
   * pageSize
   */
  pageSize: number
  /**
   * 首字母
   */
  prefix?: string
  [property: string]: any
}

export interface QueryArtistMusicParams {
  pageNo: number
  pageSize: number
  artistId?: number
}

/**
 * xyz.jdynb.bean.music.entity.Artist
 *
 * Artist
 */
export interface Artist {
  aartist?: string
  albumNum?: number
  artistFans?: number
  contentType?: number
  id?: number
  isStar?: number
  musicNum?: number
  mvNum?: number
  name?: string
  pic?: string
  pic120?: string
  pic300?: string
  pic70?: string
  [property: string]: any
}
