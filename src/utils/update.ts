import { BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

/**
 * 检查更新
 * @param mainWindow 主窗口
 */
export function checkUpdate(mainWindow: BrowserWindow) {
  // autoUpdater.forceDevUpdateConfig = true // 强制使用开发更新配置
  autoUpdater.autoInstallOnAppQuit = true // App退出时自动安装
  autoUpdater.autoDownload = false // 关闭自动下载
  // 监听更新事件
  autoUpdater.on('checking-for-update', () => {})

  autoUpdater.on('update-available', (info) => {
    // 通知更新到页面
    mainWindow.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('更新不可用', info)
  })

  autoUpdater.on('error', (err) => {
    console.log('更新失败', err)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    // 下载进度
    mainWindow.webContents.send('download-progress', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.info('新版本下载完成，即将安装', info)
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('start-download-update', () => {
    autoUpdater.downloadUpdate()
  })

  // 开始检查更新
  autoUpdater.checkForUpdates()
}
