import { defineDict } from '@renderer/utils/dict'
import { Status } from '@renderer/enums/common'

/**
 * 状态字典
 */
export const statusDict = defineDict<typeof Status>({
  ENABLED: {
    label: '已开启',
    value: Status.ENABLED
  },
  DISABLED: {
    label: '已关闭',
    value: Status.DISABLED
  }
})
