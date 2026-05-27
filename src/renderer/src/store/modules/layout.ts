import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface LayoutState {}

export const useLayoutStore = defineStore('layout', () => {
  const state = reactive<LayoutState>(<LayoutState>{})

  return {
    state
  }
})
