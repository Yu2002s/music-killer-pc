import { ipcRenderer } from 'electron'
import { ProgressInfo, UpdateInfo } from 'electron-updater'

export default {
  onUpdateAvailable(callback: (args: UpdateInfo) => void) {
    return ipcRenderer.on('update-available', (_, args: UpdateInfo) => {
      callback(args)
    })
  },
  onDownloadProgress(callback: (progress: ProgressInfo) => void) {
    return ipcRenderer.on('download-progress', (_, args: ProgressInfo) => {
      callback(args)
    })
  },
  startDownloadUpdate() {
    ipcRenderer.send('start-download-update')
  }
}
