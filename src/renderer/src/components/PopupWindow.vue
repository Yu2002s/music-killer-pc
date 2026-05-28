<script setup lang="ts">
const isShow = defineModel({
  type: Boolean,
  default: false
})

interface Props {
  animation?: 'slide-bottom-top-fade' | 'slide-right-left-fade'
  closeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'slide-bottom-top-fade',
  closeable: true
})

function close() {
  if (!props.closeable) {
    return
  }
  isShow.value = false
}
</script>

<template>
  <transition :name="animation">
    <template v-if="closeable">
      <div v-show="isShow" class="popup" @click.self="close">
        <slot></slot>
      </div>
    </template>
    <template v-else>
      <div v-show="isShow" class="popup">
        <slot></slot>
      </div>
    </template>
  </transition>
</template>

<style scoped>
.popup {
  position: fixed;
  z-index: 4000;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}

/*
  进入和离开动画可以使用不同
  持续时间和速度曲线。
*/
.slide-bottom-top-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-bottom-top-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-bottom-top-fade-enter-from,
.slide-bottom-top-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-right-left-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-right-left-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-right-left-fade-enter-from,
.slide-right-left-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
