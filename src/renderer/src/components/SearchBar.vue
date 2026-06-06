<template>
  <div class="search-bar">
    <input
      v-model.trim="model"
      class="search-input"
      type="text"
      placeholder="请输入关键字搜索"
      @keyup.enter="onSearch"
      @focus="onFocus"
    />
    <mdui-button-icon class="clear" @click="clear">
      <mdui-icon-clear></mdui-icon-clear>
    </mdui-button-icon>

    <div class="dropdown">
      <mdui-menu v-if="keywordList.length">
        <mdui-menu-item
          v-for="item in keywordList"
          :key="item.name"
          @mousedown.self="onKeyMenuClick(item.name)"
        >
          <mdui-icon-history slot="icon"></mdui-icon-history>
          {{ item.name }}
          <mdui-button-icon slot="end-icon" @mousedown.stop="onDeleteKey(item.name)">
            <mdui-icon-close></mdui-icon-close>
          </mdui-button-icon>
        </mdui-menu-item>
        <!--        <mdui-menu-item>
          <mdui-icon-search slot="icon"></mdui-icon-search>
          Item3
        </mdui-menu-item>-->
      </mdui-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import '@mdui/icons/clear.js'
import '@mdui/icons/search.js'
import '@mdui/icons/history.js'
import 'mdui/components/menu'
import 'mdui/components/menu-item'
import { SearchKeyword } from '@renderer/types/search'
import { DBStoreName } from '@renderer/enums/store'
import { ref } from 'vue'
import { addData, deleteData, getDataByKey, getPageData, updateData } from '@renderer/db'

const model = defineModel({
  type: String,
  default: ''
})

const emit = defineEmits<{
  (e: 'onSubmit', content: string): void
}>()

const keywordList = ref<SearchKeyword[]>([])

async function onSearch() {
  if (!model.value.trim()) return
  emit('onSubmit', model.value)

  keywordList.value.unshift({
    name: model.value,
    updateTime: Date.now()
  })

  const value = await getDataByKey<SearchKeyword>(DBStoreName.SEARCH_HISTORY, model.value)
  if (value) {
    value.updateTime = Date.now()
    updateData<SearchKeyword>(DBStoreName.SEARCH_HISTORY, value)
  } else {
    addData<SearchKeyword>(DBStoreName.SEARCH_HISTORY, {
      name: model.value,
      updateTime: Date.now()
    })
  }
}

function clear() {
  model.value = ''
}

async function onFocus() {
  keywordList.value = await getPageData<SearchKeyword>({
    pageNo: 1,
    pageSize: 4,
    storeName: DBStoreName.SEARCH_HISTORY,
    indexName: 'updateTime'
  })
}

function onKeyMenuClick(name: string) {
  console.log('onKeyMenuClick:', name)
  model.value = name
  updateData<SearchKeyword>(DBStoreName.SEARCH_HISTORY, {
    name,
    updateTime: Date.now()
  })
  onFocus()
  console.log('onSubmitInner:', model.value)
  emit('onSubmit', name)
}

function onDeleteKey(name: string) {
  console.log('onDeleteKey:', name)
  deleteData(DBStoreName.SEARCH_HISTORY, name)
  onFocus()
}
</script>

<style scoped lang="scss">
.search-bar {
  position: relative;
  display: flex;
  align-items: center;

  &:has(.search-input:focus) {
    .dropdown {
      display: inline-block;
    }
  }

  .dropdown {
    position: absolute;
    width: 250px;
    display: none;
    top: 30px;

    .divider {
      height: 1px;
      width: 100%;
      background-color: rgba(var(--mdui-color-surface-variant));
    }
  }

  .clear {
    position: absolute;
    z-index: 2;
    width: 24px;
    height: 24px;
    right: 10px;
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
