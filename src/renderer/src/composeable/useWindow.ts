import { ref } from 'vue'

export default function useWindow() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const column = ref(getColumnForWidth(width.value))

  function getColumnForWidth(width: number) {
    if (width > 1000 && width < 1200) {
      return 6
    } else if (width > 1200) {
      return 8
    }
    return 5
  }

  window.addEventListener('resize', () => {
    width.value = window.innerWidth
    height.value = window.innerHeight
    column.value = getColumnForWidth(width.value)
  })

  return {
    column,
    width,
    height
  }
}
