<template>
  <div class="lyric-container">
    <ul ref="container" class="lyric-list" @scroll="onScroll" @scrollend="onScrollEnd">
      <li style="height: 300px"></li>
      <li
        v-for="(item, index) in lyric"
        :key="index"
        class="lyric-item"
        :class="{ active: isActive(item) }"
        @click="selectItem(item.startTime)"
      >
        <div class="lyric-line">{{ getLyricLine(item) }}</div>
        <!--        <span v-for="word in item.words" :key="String(word.startTime) + word">{{ word.word }}</span>-->
        <div v-if="item.translatedLyric" class="lyric-line translate">
          {{ item.translatedLyric }}
        </div>
      </li>
      <li style="height: 300px"></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { LyricLine, parseLrc } from '@applemusic-like-lyrics/lyric'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  lyricContent: string
}

const props = defineProps<Props>()

const lyric = computed(() => {
  return parseLrc(props.lyricContent)
})

const model = defineModel({
  type: Number,
  default: 0
})

const container = ref<HTMLDivElement>()
const containerHeight = ref(0)
const isScrolling = ref(false)

const emit = defineEmits<{
  (e: 'selectItem', startTime: number): void
}>()

watch(
  model,
  () => {
    if (isScrolling.value) return
    // 计算歌词居中的位置
    const activeLi = container.value.getElementsByClassName('active')
    if (activeLi.length) {
      // console.log((activeLi[0] as HTMLLIElement).offsetTop - 300)
      container.value.scrollTop = (activeLi[0] as HTMLLIElement).offsetTop - 300
    }
  },
  {
    flush: 'post'
  }
)

function getLyricLine(word: LyricLine) {
  return word.words.map((item) => item.word).join('')
}

const resizeListener = () => {
  getContainerHeight()
}

function onScroll() {
  isScrolling.value = true
}

let timerId: any = 0

function onScrollEnd() {
  if (timerId) {
    clearTimeout(timerId)
  }
  timerId = setTimeout(() => {
    isScrolling.value = false
  }, 3000)
}

onMounted(() => {
  window.addEventListener('resize', resizeListener)
  getContainerHeight()
})

function getContainerHeight() {
  containerHeight.value = container.value.offsetHeight || 0
}

onUnmounted(() => {
  window.removeEventListener('resize', resizeListener)
})

function isActive(item: LyricLine): boolean {
  return model.value >= item.startTime && model.value < item.endTime
}

function selectItem(startTime: number) {
  emit('selectItem', startTime)
}
</script>

<style scoped lang="scss">
.lyric-container {
  height: 100%;
  box-sizing: border-box;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .lyric-list {
    height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;

    -ms-overflow-style: none; /* IE 和旧版 Edge 隐藏滚动条 */
    scrollbar-width: none; /* Firefox 隐藏滚动条 */

    &::-webkit-scrollbar {
      display: none;
    }

    .lyric-item {
      text-align: center;
      margin: 10px 0;
      transition: transform 0.2s ease-in;
      cursor: pointer;

      .lyric-line {
        word-break: break-word;
      }

      &.active {
        transform: scale(1.2);
        color: rgb(var(--mdui-color-primary));
      }

      .translate {
        color: #888;
        font-size: 13px;
      }
    }
  }
}
</style>
