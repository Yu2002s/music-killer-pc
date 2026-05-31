import { onMounted, ref, watch } from 'vue'
import { getDataCount, getPageData } from '@renderer/db'

interface Options {
  initPage?: {
    pageNo: number
    pageSize: number
  }
  immediate?: boolean
  indexName?: string
  direction?: 'next' | 'nextunique' | 'prev' | 'prevunique'
}

export function useQueryDB<T>(
  storeName: string,
  options: Options = {
    initPage: {
      pageNo: 1,
      pageSize: 20
    },
    immediate: true,
    indexName: 'updateTime'
  }
) {
  const loading = ref<boolean>(false)
  const pageNo = ref(options.initPage?.pageNo || 1)
  const pageSize = ref(options.initPage?.pageSize || 20)
  const data = ref<T[]>([])
  const error = ref<Error | undefined>()
  const total = ref(0)

  watch([pageNo, pageSize], () => {
    query()
  })

  async function query() {
    loading.value = true
    try {
      const list = await getPageData<T>({
        storeName,
        pageNo: pageNo.value,
        pageSize: pageSize.value,
        indexName: options.indexName,
        direction: options.direction
      })
      if (pageNo.value === 1) {
        data.value = list
        total.value = await getDataCount(storeName)
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.value.push(...list)
      }
      console.log(total.value, data.value)
    } catch (e: any) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (options.immediate) {
      query()
    }
  })

  return {
    query,
    error,
    loading,
    data,
    pageNo,
    pageSize,
    total
  }
}
