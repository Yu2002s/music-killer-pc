import { PlayInfo, QueryPlayInfoParams } from '@renderer/api/play/types'

/**
 * 获取歌曲播放信息
 * @param params 查询参数
 */
export function getPlayInfo(params: QueryPlayInfoParams) {
  return window.api.request<PlayInfo>({
    url: '/music/play/info',
    method: 'GET',
    data: params
  })
}
