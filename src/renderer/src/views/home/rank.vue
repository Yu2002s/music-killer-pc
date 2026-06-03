<script setup lang="ts">
import LoadingLayout from '@renderer/components/LoadingLayout.vue'
import useRequest from '@renderer/composeable/useRequest'
import { getMusicRankMenu } from '@renderer/api/rank'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Rank'
})

const router = useRouter()

const { loading, error, data } = useRequest(getMusicRankMenu, {
  immediate: true
})

function toList(id: string) {
  router.push({
    path: '/rank/list',
    query: {
      id
    }
  })
}
</script>

<template>
  <loading-layout :loading="loading" :error="error">
    <mdui-card v-for="item in data" :key="item.id" class="card">
      <div class="header">{{ item.name }}</div>
      <mdui-divider />
      <mdui-list class="items">
        <mdui-list-item
          v-for="rank in item.list"
          :key="rank.id"
          :headline="rank.name"
          :description="rank.intro"
          rounded
          class="rank-item"
          @click="toList(rank.sourceId)"
        >
          <img slot="icon" class="rank-img" :src="rank.pic" />
        </mdui-list-item>
      </mdui-list>
    </mdui-card>
  </loading-layout>
</template>

<style scoped lang="scss">
.card {
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  margin: 10px;

  .header {
    margin-left: 10px;
    font-size: 18px;
    margin-bottom: 10px;
  }

  .items {
    .rank-item {
      .rank-img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
      }
    }
  }
}
</style>
