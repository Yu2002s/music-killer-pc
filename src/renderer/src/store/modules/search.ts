import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')

  return {
    keyword
  }
})
