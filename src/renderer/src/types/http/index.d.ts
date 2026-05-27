/**
 * 分页对象
 */
export interface Page<T> {
  /**
   * 分页数据
   */
  data: T[]
  /**
   * 总数
   */
  total: number
}

/**
 * 分页参数
 */
export interface PageParams {
  /**
   * 页码
   */
  pageNo: number
  /**
   * 分页大小
   */
  pageSize: number
}
