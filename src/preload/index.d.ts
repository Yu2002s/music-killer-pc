import { ElectronAPI, IpcRenderer } from "@electron-toolkit/preload";
import request, { Options, Response } from "../utils/request";
import { ProgressInfo, UpdateInfo } from "electron-updater";

declare global {
  interface Window {
    electron: ElectronAPI;
    /**
     * Api扩展接口
     */
    api: {
      /**
       * 发送http请求
       * @return Promise<T> promise 对象
       */
      request: <T = any>(options: Options) => Promise<T>

      music: {
        buildParams: (musicId: number, isGetLyricx: boolean) => Promise<string>
        decryptLyric: (lyricContent: ArrayBuffer, isGetLyricx: boolean) => Promise<string>
      },

      update: {
        onUpdateAvailable: (callback: (info: UpdateInfo) => void) => IpcRenderer
        onDownloadProgress: (callback: (progress: ProgressInfo) => void) => IpcRenderer
        startDownloadUpdate: () => void
      }
    };
  }
}
