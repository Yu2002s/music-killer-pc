<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading: boolean
  total: number
  itemCount: number
}

const props = defineProps<Props>()

const hasMore = computed(() => {
  return props.total > props.itemCount
})

const emit = defineEmits(['load-more'])

function loadMore() {
  console.log('loadMore')
  emit('load-more')
}

// 自定义指令
const vLoadMore = {
  mounted(el: any, binding: any) {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          // 元素进入视口，触发加载
          binding.value()
        }
      },
      {
        root: null, // 使用视口作为根元素
        rootMargin: '40px', // 提前触发距离
        threshold: 0.1 // 元素露出 10% 时触发
      }
    )

    observer.observe(el)
    // 保存 observer 以便卸载时断开
    el._observer = observer
  },

  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect()
      delete el._observer
    }
  }
}
</script>

<template>
  <!-- 加载触发器 -->
  <div v-load-more="loadMore" class="observer-trigger">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="hasMore" class="load-more">下拉加载更多</div>
    <div v-else class="no-more">没有更多数据了</div>
  </div>
</template>

<style scoped>
.observer-trigger {
  padding: 20px;
  text-align: center;
  color: #666;
}

.loading,
.load-more {
  color: #409eff;
}

.no-more {
  color: #999;
}
</style>
