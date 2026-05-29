import { StorageKey } from '@renderer/enums/storage'

/**
 * 字典项类型
 */
export type DictItem<T = any> = {
  label: string
  value: T
}

/**
 * 字典类型
 */
export type DictType = Record<string, DictItem>

/**
 * 从枚举创建字典配置
 */
export function defineDict<T extends Record<string, string | number>>(dict: {
  [K in keyof T]: DictItem<T[K]>
}) {
  return dict
}

/**
 * 通过字典值获取到字典的label
 * @param dict 字典对象
 * @param value 字典值
 * @param defaultLabel 默认的字典label
 * @returns 字典label
 */
export function getDictLabel<T extends DictType>(
  dict: T,
  value: T[keyof T]['value'],
  defaultLabel: T[keyof T]['label'] = ''
) {
  for (const k in dict) {
    const v = dict[k]
    if (v.value === value) {
      return v.label
    }
  }
  return defaultLabel
}

export function getSavedDictValue<T extends DictType>(
  _: T,
  storageKey: StorageKey,
  defaultValue: T[keyof T]['value']
): T[keyof T]['value'] {
  const savedDictValueStr = localStorage.getItem(storageKey)
  if (!savedDictValueStr) {
    return defaultValue
  }
  const toNumber = Number(savedDictValueStr)
  if (isNaN(toNumber)) {
    return savedDictValueStr
  }
  return toNumber
}

export function saveDictValue<T extends DictType>(
  _: T,
  storageKey: StorageKey,
  value: T[keyof T]['value']
) {
  localStorage.setItem(storageKey, value)
}

// 获取值数组的辅助函数
export function getDictValues<T extends DictType>(dict: T): T[keyof T]['value'][] {
  return Object.values(dict).map((item) => item.value)
}

// 获取标签映射
export function getLabelMap<T extends DictType>(dict: T): Record<T[keyof T]['value'], string> {
  const map = {} as Record<T[keyof T]['value'], string>
  Object.values(dict).forEach((item) => {
    map[item.value] = item.label
  })
  return map
}
