<script setup lang="ts">
import { ref, useSlots, computed } from 'vue'

const slots = useSlots()
const openIndex = ref<number | null>(null)

const items = computed(() => {
  const defaultSlot = slots.default ? slots.default() : []
  const children = defaultSlot.flatMap(node => {
    if (node.type === Symbol.for('v-fgt') && Array.isArray(node.children)) {
      return node.children
    }
    return node
  })
  return children.map((node: any, index) => ({
    title: node.props?.title || `Punkt ${index + 1}`,
    vnode: node
  }))
})

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<template>
  <div class="rounded-xs my-4 p-2 bg-(--page-bg) bevel-lg">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="group border-b border-border-light last:border-b-0"
    >
      <button
        type="button"
        @click="toggle(index)"
        class="w-full flex items-center justify-between text-left px-3 py-2 bg-header-band retro:hover:text-(--page-bg) hover:bg-border-light text-[13px] font-bold text-text group-first:bevel-tr group-last:bevel-bl group-only:bevel-lg"
      >
        {{ item.title }}
        <span class="text-text-muted">{{ openIndex === index ? '−' : '+' }}</span>
      </button>
      <div v-show="openIndex === index" class="px-3 py-2 text-[13.5px]">
        <component :is="item.vnode" />
      </div>
    </div>
  </div>
</template>