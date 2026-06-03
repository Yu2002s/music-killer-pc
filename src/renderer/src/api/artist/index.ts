import { Artist, QueryArtistMusicParams, QueryArtistParams } from '@renderer/api/artist/types'
import { Page } from '@renderer/types/http'
import { Music } from '@renderer/api/playlist/types'
import { Album } from '@renderer/api/album/types'

export function getArtistPage(data: QueryArtistParams) {
  return window.api.request<Page<Artist>>({
    url: '/music/artist/list',
    method: 'GET',
    data
  })
}

export function getArtistMusicPage(data: QueryArtistMusicParams) {
  return window.api.request<Page<Music>>({
    url: '/music/artist/music',
    method: 'GET',
    data
  })
}

export function getArtistAlbumPage(data: QueryArtistMusicParams) {
  return window.api.request<Page<Album>>({
    url: '/music/artist/album',
    method: 'GET',
    data
  })
}
