import { ipcRenderer } from 'electron'

export default {
  buildParams: (musicId: number, isGetLyricx: boolean) => {
    return ipcRenderer.invoke('music:buildParams', musicId, isGetLyricx)
  },
  decryptLyric: (lyricContent: string, isGetLyricx: boolean) => {
    return ipcRenderer.invoke('music:decryptLyric', lyricContent, isGetLyricx)
  },
  showLyric: (isShow: boolean) => {
    ipcRenderer.send('music:showLyric', isShow)
  },
  exportMusic: (content: string) => {
    return ipcRenderer.invoke('music:export', content)
  },
  importMusic: () => {
    return ipcRenderer.invoke('music:import')
  }
}
