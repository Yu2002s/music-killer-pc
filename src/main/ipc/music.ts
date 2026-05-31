import { IpcMain } from 'electron'
import { buildParams, convertKuwoLrc, decodeLyrics } from '../../utils/lyric'

/**
 * 处理音乐相关ipc通信
 * @param ipcMain ipcMain
 */
export default function handleMusicIpc(ipcMain: IpcMain) {
  ipcMain.handle('music:buildParams', (_, musicId: number) => {
    return buildParams(musicId, false)
  })

  ipcMain.handle('music:decryptLyric', async (_, content: ArrayBuffer) => {
    const lyricContent = await decodeLyrics(Buffer.from(content), false)
    return convertKuwoLrc(lyricContent)
  })
}
