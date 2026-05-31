import { ipcRenderer } from 'electron'

export default {
  buildParams: (musicId: number, isGetLyricx: boolean) => {
    return ipcRenderer.invoke('music:buildParams', musicId, isGetLyricx)
  },
  decryptLyric: (lyricContent: string, isGetLyricx: boolean) => {
    return ipcRenderer.invoke('music:decryptLyric', lyricContent, isGetLyricx)
  }
}
