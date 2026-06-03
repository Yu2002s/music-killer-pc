export function getAlbumMusicPage(id: number) {
  return window.api.request({
    url: '/music/album/info',
    method: 'GET',
    data: {
      id
    }
  })
}
