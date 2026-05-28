import { Page } from '@renderer/types/http'
import { Music } from '../playlist/types'
import { QueryMusicParams } from './types'

/**
 * 搜索歌曲
 * @param params 搜索参数
 * @returns 歌曲分页列表
 */
export function searchMusic(params: QueryMusicParams) {
  return window.api.request<Page<Music>>({
    method: 'GET',
    url: '/music/search',
    data: params
  })
}
