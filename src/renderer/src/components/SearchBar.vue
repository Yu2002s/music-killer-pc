<template>
  <div class="search-bar">
    <input
      v-model.trim="model"
      class="search-input"
      type="text"
      placeholder="请输入关键字搜索"
      @keyup.enter="onSearch"
    />
    <mdui-button-icon class="clear" @click="clear">
      <mdui-icon-clear></mdui-icon-clear>
    </mdui-button-icon>
  </div>
</template>

<script setup lang="ts">
import '@mdui/icons/clear.js';

const model = defineModel({
  type: String,
  default: ''
})

const emit = defineEmits<{
  (e: 'onSubmit', content: string): void
}>()

function onSearch() {
  emit('onSubmit', model.value)
}

function clear() {
  model.value = ''
}
</script>

<style scoped lang="scss">
.search-bar {
  display: flex;
  align-items: center;

  .clear {
    position: absolute;
    z-index: 2;
    width: 24px;
    height: 24px;
    right: 65px;
  }

  .search-input {
    width: 200px;
    height: 30px;
    outline: none;
    border: none;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 10px;
    padding-right: 40px;
    background-color: rgba(
      var(--mdui-comp-ripple-state-layer-color, var(--mdui-color-on-surface)),
      var(--mdui-state-layer-hover)
    );
    border-radius: 4px;
    transition: width 0.3s linear;

    &:focus {
      width: 250px;
      background-color: rgb(var(--mdui-color-secondary-container));
    }
  }
}
</style>
