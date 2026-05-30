export async function getMusicLyric(id: number) {
  const params = await window.api.music.buildParams(id, false)
  return window.api.request<ArrayBuffer>({
    url: `http://newlyric.kuwo.cn/newlyric.lrc?${params}`,
    method: 'GET',
    rawType: 'arraybuffer'
  })
}
