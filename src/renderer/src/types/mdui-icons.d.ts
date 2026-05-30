// types/mdui-icons.d.ts
declare module '@vue/runtime-core' {
  // 使用模板字面量类型匹配所有 mdui-icon- 开头的组件
  export interface GlobalComponents {
    [key: `mdui-icon-${string}`]: {
      new (): HTMLElement & {
        // 如果需要声明 props（对于 Web Component，props 会映射为 attributes）
        size?: string | number
        color?: string
      }
    }
  }
}

export {}
