import { ElectronAPI } from '@electron-toolkit/preload'
import request, { Options, Response } from '../utils/request'

interface WindowInfo {
  width: number
  height: number
  x: number
  y: number
}

declare global {
  interface Window {
    electron: ElectronAPI
    /**
     * Api扩展接口
     */
    api: {
      /**
       * 发送http请求
       * @return Promise<T> promise 对象
       */
      request: <T = any>(options: Options) => Promise<T>
      /**
       * 获取窗口信息
       */
      getWindowInfo: () => Promise<WindowInfo>
    }
  }
}
