import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { Options, Response } from '../utils/request'

// 是否显示错误提示
let isShowErrorTips = false

/**
 * 显示错误的提示信息
 * @param msg 错误信息
 */
async function showErrorTips(msg: string) {
  if (isShowErrorTips) {
    return
  }
  isShowErrorTips = true
  alert(msg || '系统异常，请稍后重试！')
  isShowErrorTips = false
}

// Custom APIs for renderer
const api = {
  /**
   * 发送一个请求
   * @param options 请求配置项
   */
  request: <T>(options: Options): Promise<T> => {
    let query = ''
    if (options.method === 'GET' && options.data) {
      if (options.url.indexOf('?') === -1) {
        query += '?'
      }
      const keySize = Object.keys(options.data).length
      Object.entries(options.data).forEach(([key, value], index) => {
        query += `${key}=${value}`
        if (index !== keySize - 1) {
          query += '&'
        }
      })
      options.data = undefined
      options.url += query
    }

    return new Promise((resolve, reject) => {
      ;(ipcRenderer.invoke('request', options) as Promise<Response<T>>)
        .then((response) => {
          if (options.raw) {
            return resolve(response as T)
          }
          if (response.code !== 200) {
            if (options.showErrorTips) {
              showErrorTips(response.msg)
            }
            return reject(new Error(response.msg))
          }
          resolve(response.data)
        })
        .catch((error) => {
          if (options.showErrorTips) {
            showErrorTips(error.message)
          }
          reject(error)
        })
    })
  },
  getWindowInfo: () => {
    return ipcRenderer.invoke('getWindowInfo')
  }
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
