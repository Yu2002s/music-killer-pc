import { onMounted, Ref, ref } from 'vue'

interface Options<T, R = T> {
  immediate?: boolean
  defaultData?: R
  onSuccess?: (data: R) => void
  transform?: (data: T) => R
}

interface ReturnType<T> {
  loading: Ref<boolean>
  data: Ref<T | undefined>
  error: Ref<Error | undefined>
  send: (...args: any) => Promise<void>
}

export default function useRequest<T, R = T>(
  promiseFunc: (...args: any) => Promise<T>,
  options: Options<T, R> = {}
): ReturnType<R> {
  const loading = ref(false)
  const data = ref<R | undefined>(options.defaultData)
  const error = ref<Error>()

  async function send(...args: any) {
    try {
      loading.value = true
      if (!options.transform) {
        options.transform = (value: T): R => {
          return value as unknown as R
        }
      }
      data.value = options.transform(await promiseFunc(...args))
      if (options.onSuccess) {
        options.onSuccess(data.value)
      }
    } catch (e) {
      console.error(e)
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  if (options.immediate) {
    onMounted(() => {
      send()
    })
  }

  return {
    loading,
    data: data as Ref<R | undefined>,
    error,
    send
  }
}
