import { Music, PlayList, PlayListTag, QueryPlaylistParams } from '@renderer/api/playlist/types'
import { Page } from '@renderer/types/http'

/**
 * 获取首页歌单分类tag列表
 */
export function getIndexPlayListTags() {
  return window.api.request<PlayListTag[]>({
    url: '/music/playlist/getIndexPlayListTags',
    method: 'GET'
  })
}

/**
 * 获取首页歌单列表
 */
export function getIndexPlayList() {
  return window.api.request<Page<PlayList>>({
    url: '/music/playlist/recommend',
    method: 'GET'
  })
}

/**
 * 获取歌单分类tag列表
 */
export function getPlayListTags() {
  return window.api.request<PlayListTag[]>({
    url: '/music/playlist/getPlayListTags',
    method: 'GET'
  })
}

/**
 * 通过分类tag获取到歌单列表
 * @param id 分类tag id
 */
export function getPlayListByTag(id: string) {
  return window.api.request<Page<PlayList>>({
    url: `/music/playlist/getPlayListByTag?id=${id}`,
    method: 'GET'
  })
}

/**
 * 获取歌单歌曲列表
 * @param params 查询参数
 */
export function getPlaylistPage(params: QueryPlaylistParams) {
  return window.api.request<Page<PlayList>>({
    url: `/music/playlist/page`,
    data: params,
    method: 'GET'
  })
}

/**
 * 通过分类tag获取对应的歌单列表
 * @param params 查询参数
 */
export function getTagPlaylistPage(params: QueryPlaylistParams) {
  return window.api.request<Page<PlayList>>({
    url: `/music/playlist/getTagPlaylist`,
    data: params,
    method: 'GET'
  })
}

/**
 * 获取歌单信息
 * @param params 查询参数
 */
export function getPlaylistInfo(params: QueryPlaylistParams) {
  return window.api.request<PlayList>({
    url: `/music/playlist/info`,
    data: params,
    method: 'GET'
  })
}
