<script setup lang="ts">
interface Props {
  list: string[]
}

defineProps<Props>()

const currentIndex = defineModel({
  type: Number,
  default: 0
})

function onTabItemClick(index: number) {
  currentIndex.value = index
}
</script>

<template>
  <div class="material3-tab">
    <div
      v-for="(item, index) in list"
      :key="item"
      class="tab-item"
      :class="{ active: currentIndex === index }"
      @click="onTabItemClick(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.material3-tab {
  display: flex;
  align-items: center;

  .tab-item {
    margin-right: 20px;
    padding: 6px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;

    &.active {
      transition: background-color 0.5s ease;
      background-color: rgb(var(--mdui-color-secondary-container));
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
