import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useLayoutStore = defineStore('layout', () => {
  const isExpandBottomBar = ref(false)

  return {
    isExpandBottomBar
  }
})
