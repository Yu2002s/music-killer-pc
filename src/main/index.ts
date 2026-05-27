import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import request from '../utils/request'

function createWindow(): void {
  // 构建一个浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 600,
    minHeight: 400,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  // mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    // 当窗口准备就绪后进行显示
    mainWindow.show()
  })

  // 设置window打开处理器
  mainWindow.webContents.setWindowOpenHandler((details) => {
    // 从外部打开
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 基于electron-vite cli的渲染器HMR。
  // 加载远程URL进行开发，或加载本地html文件进行生产。
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 当 Electron 完成时，将调用此方法
// 初始化完成，已准备好创建浏览器窗口。
// 某些API仅在此事件发生后才能使用。
app.whenReady().then(() => {
  // 为Windows设置应用程序用户模型ID
  electronApp.setAppUserModelId('xyz.jdynb.music')

  // 在开发环境中，默认通过 F12 打开或关闭开发者工具
  // 在生产环境中忽略 CommandOrControl + R。
  // 参见 https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('request', (_, options) => {
    console.log('request', options)
    return request(options)
  })

  createWindow()

  app.on('activate', function () {
    // 在macOS上，当activate时，在应用中重新创建一个窗口是很常见的
    // 点击了Dock图标，且没有其他窗口处于打开状态。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口都关闭时退出程序，macOS 平台除外。在 macOS 上，这是常见的做法
// 确保应用程序及其菜单栏保持活动状态，直至用户退出
// 明确使用Cmd + Q退出。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 在此文件中，您可以包含应用程序其余特定的主进程代码。您也可以将它们放在单独的文件中，并在此处引入它们。
