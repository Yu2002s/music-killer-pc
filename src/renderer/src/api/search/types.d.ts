import { PageParams } from '@renderer/types/http'

export interface QueryMusicParams extends PageParams {
  /**
   * 关键字
   */
  keyword: string
  [property: string]: any
}
