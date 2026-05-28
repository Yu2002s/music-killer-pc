/// <reference types="vite/client" />

import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export { }

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 标题
     */
    title?: string
    /**
     * 图标
     */
    icon?: string
    /**
     * 是否显示在主页面
     */
    home?: boolean
    /**
     * 是否隐藏头部区域
     */
    hiddenHeader?: boolean
  }
}
