<template>
  <mdui-dropdown>
    <div slot="trigger" style="display: inline-block">
      <slot></slot>
    </div>
    <mdui-menu selects="single" :value="currentValue" @change="onChange">
      <mdui-menu-item v-for="item in dictType" :key="item.label" :value="item.value">{{
        item.label
      }}</mdui-menu-item>
    </mdui-menu>
  </mdui-dropdown>
</template>

<script setup lang="ts">
import { DictType } from '@renderer/utils/dict';
import 'mdui/components/dropdown';
import 'mdui/components/menu';
import 'mdui/components/menu-item';

defineProps<{
  currentValue: any
  dictType: DictType
  position?: 'top' | 'bottom'
  offset?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'onMenuItemClick', value: any): void
  (e: 'open'): void
  (e: 'close'): void
}>()

function onChange(e: any) {
  emit('onMenuItemClick', e.target.value)
}
</script>

<style scoped></style>
