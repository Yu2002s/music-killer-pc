import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import music from './ipc/music'
import update from './ipc/update'
import * as request from './ipc/request'

// Custom APIs for renderer
const api = {
  ...request,
  music,
  update
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
