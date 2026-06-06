import { BrowserWindow, IpcMain, dialog } from 'electron'
import { buildParams, convertKuwoLrc, decodeLyrics } from '../../utils/lyric'
import * as fs from 'node:fs'

function createLyricWindow(): BrowserWindow {
  const lyricWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    show: false,
    backgroundMaterial: 'none',
    backgroundColor: 'transparent'
  })

  lyricWindow.loadURL('http://localhost:5173/lyric')

  return lyricWindow
}

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

  let lyricWindow: BrowserWindow | null = null

  ipcMain.on('music:showLyric', (_, isShow: boolean) => {
    console.log('showLyric', isShow)
    if (isShow) {
      lyricWindow?.close()
      lyricWindow = createLyricWindow()
      lyricWindow.show()
    } else {
      lyricWindow?.close()
      lyricWindow = null
    }
  })

  // 导出数据
  ipcMain.handle('music:export', async (_, content: string) => {
    const result = await dialog.showSaveDialog({
      title: '选择导出路径',
      defaultPath: 'music-export.json',
      properties: ['showOverwriteConfirmation']
    })
    if (result.canceled) {
      return Promise.reject(new Error('已取消导出'))
    }
    fs.writeFile(result.filePath, content, (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('导出成功')
      }
    })
  })

  ipcMain.handle('music:import', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择导入文件',
      properties: ['openFile']
    })
    if (result.canceled) {
      return Promise.reject(new Error('已取消导入'))
    }
    return fs.readFileSync(result.filePaths[0], 'utf-8')
  })
}
