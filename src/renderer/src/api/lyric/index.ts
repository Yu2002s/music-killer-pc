import { buildParams } from '@renderer/utils/lyric'

export function getMusicLyric(id: number) {
  console.log('params:', buildParams(id, false))
  return window.api.request<string>({
    url: `http://newlyric.kuwo.cn/newlyric.lrc?${buildParams(id, false)}`,
    method: 'GET',
    raw: true
  })
}
