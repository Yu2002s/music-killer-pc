import { ElectronAPI } from '@electron-toolkit/preload'
import request from "../utils/request";
import { Options, Response } from "../utils/request"

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
      request: <T = any> (options: Options) => Promise<T>
    }
  }
}
