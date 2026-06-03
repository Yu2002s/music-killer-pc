import { MusicRank, QueryRankParams, RankMenu } from '@renderer/api/rank/types'
import { Page } from '@renderer/types/http'

export function getMusicRankMenu() {
  return window.api.request<RankMenu[]>({
    url: '/music/rank/menu',
    method: 'GET'
  })
}

export function getRankMusicPage(params: QueryRankParams) {
  return window.api.request<MusicRank>({
    url: '/music/rank/getMusicList',
    method: 'GET',
    data: params
  })
}
