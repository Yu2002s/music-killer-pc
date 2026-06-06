<script setup lang="ts">
import 'mdui/components/circular-progress.js'
import { computed } from 'vue'
import LoadMore from './LoadMore.vue'

interface Props {
  /**
   * 加载状态
   */
  loading?: boolean
  /**
   * 错误
   */
  error?: string | Error
  /**
   * 是否开启加载更多
   */
  enableLoadMore?: boolean
  /**
   * 总数据数
   */
  total?: number
  /**
   * 实际展示在页面的数据数
   */
  itemCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  enableLoadMore: false,
  total: 0,
  itemCount: 0,
  page: 1
})

const emit = defineEmits(['load-more', 'refresh'])

// 页码
const pageNo = defineModel({
  type: Number,
  default: 1
})

const showMessage = computed(() => {
  const error = props.error
  if (typeof error === 'string') {
    return error
  }
  return error?.message || '加载错误，请稍后重试'
})

function refresh() {
  emit('refresh')
}

function onLoadMore() {
  pageNo.value++
  emit('load-more')
}
</script>

<template>
  <div v-if="loading && pageNo === 1" class="loading">
    <mdui-circular-progress></mdui-circular-progress>
  </div>
  <div v-else-if="error && pageNo === 1">
    <p>{{ showMessage }}，请重新打开此页面</p>
    <mdui-button v-if="false" @click="refresh">刷新</mdui-button>
  </div>
  <template v-else>
    <slot></slot>
    <LoadMore
      v-if="enableLoadMore"
      :loading="loading || false"
      :total="total || 0"
      :item-count="itemCount || 0"
      @load-more="onLoadMore"
    />
  </template>
</template>

<style scoped>
.loading {
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
