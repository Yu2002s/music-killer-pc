export function getMusicLyric(id: number) {
  return window.api.request<string>({
    url: `http://newlyric.kuwo.cn/newlyric.lrc`,
    method: 'GET'
  })
}
