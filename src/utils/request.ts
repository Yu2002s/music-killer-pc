import { net } from 'electron'

export interface Options {
  /**
   * 请求路径
   */
  url: string
  /**
   * 请求方法
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /**
   * 请求数据(Get为query数据，POST为请求体数据)
   */
  data?: any
  /**
   * 请求头数据
   */
  header?: Record<string, string>
  /**
   * 是否显示错误的提示信息
   */
  showErrorTips?: boolean
}

/**
 * Http响应通用结果
 */
export interface Response<T> {
  /**
   * 状态码
   */
  code: number
  /**
   * 响应具体数据
   */
  data: T
  msg: string
  timestamp: number
}

export default async function request<R>(options: Options): Promise<Response<R>> {
  const { url, method = 'GET', data, header } = options

  return net
    .fetch('http://music.jdynb.xyz' + url, {
      method,
      body: data,
      headers: header
    })
    .then((res) => {
      return res.json()
    })
}

request.get = function <R>(url: string, header: Record<string, string> | undefined = undefined) {
  return request<R>({
    method: 'GET',
    url,
    header
  })
}
