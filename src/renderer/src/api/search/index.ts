import { Page } from '@renderer/types/http'
import { Music, PlayList } from '../playlist/types'
import { QueryMusicParams } from './types'
import { Album } from '@renderer/api/album/types'
import { Artist } from '@renderer/api/artist/types'

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

/**
 * 搜索专辑
 * @param params 搜索参数
 * @returns 专辑分页列表
 */
export function searchAlbum(params: QueryMusicParams) {
  return window.api.request<Page<Album>>({
    method: 'GET',
    url: '/music/search/album',
    data: params
  })
}

/**
 * 搜索歌单
 * @param params 搜索参数
 * @returns 歌单分页列表
 */
export function searchPlaylist(params: QueryMusicParams) {
  return window.api.request<Page<PlayList>>({
    method: 'GET',
    url: '/music/search/playlist',
    data: params
  })
}

/**
 * 搜索歌手
 * @param params 搜索参数
 * @returns 歌手分页列表
 */
export function searchArtist(params: QueryMusicParams) {
  return window.api.request<Page<Artist>>({
    method: 'GET',
    url: '/music/search/artist',
    data: params
  })
}
