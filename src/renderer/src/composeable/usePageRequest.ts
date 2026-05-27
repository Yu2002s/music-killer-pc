import { computed, onMounted, ref, watch } from 'vue'
import { Page } from '@renderer/types/http'

interface Options<T> {
  immediate?: boolean
  initialPage?: {
    pageNo: number
    pageSize: number
  }
  onSuccess?: (data: T[]) => void
}

export default function usePageRequest<T>(
  promiseFunc: (pageNo: number, pageSize: number, ...args: any) => Promise<Page<T>>,
  options: Options<T> = {}
) {
  const { immediate = false, initialPage = { pageNo: 1, pageSize: 10 }, onSuccess } = options

  const pageNo = ref(initialPage.pageNo)
  const pageSize = ref(initialPage.pageSize)
  const loading = ref(false)
  const data = ref<T[]>([])
  const error = ref('')
  const total = ref(0)

  const isLastPage = computed(() => {
    return total.value <= data.value.length
  })

  async function send(...args: any) {
    try {
      loading.value = true
      const result = await promiseFunc(pageNo.value, pageSize.value, ...args)
      total.value = result.total
      if (pageNo.value === 1) {
        data.value = result.data
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data.value.push(...result.data)
      }
      onSuccess && onSuccess(result.data)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    onMounted(() => {
      send()
    })
  }

  watch([pageNo, pageSize], () => {
    send()
  })

  return {
    pageNo,
    pageSize,
    isLastPage,
    total,
    loading,
    data,
    error,
    send
  }
}
