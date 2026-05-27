<script setup lang="ts">
import 'mdui/components/circular-progress.js'
import { computed } from 'vue'
import LoadMore from './LoadMore.vue'

interface Props {
  loading?: boolean
  error?: string | Error
  enableLoadMore?: boolean
  total?: number
  itemCount?: number
  page?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  enableLoadMore: false,
  total: 0,
  itemCount: 0,
  page: 1
})

const emit = defineEmits(['load-more', 'refresh'])

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
  emit('load-more')
}
</script>

<template>
  <div v-if="loading && page === 1" class="loading">
    <mdui-circular-progress></mdui-circular-progress>
  </div>
  <div v-else-if="error && page === 1">
    <p>{{ showMessage }}</p>
    <mdui-button @click="refresh">刷新</mdui-button>
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
