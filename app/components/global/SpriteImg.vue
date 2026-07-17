<script setup lang="ts">
const props = defineProps<{
  path: string,
}>()
</script>

<template>
  <nuxt-link :to="props.path" external class="relative block aspect-square rounded m-2" style="background: var(--page-bg);">
    <nuxt-img :src="props.path" class="absolute pixelated w-full scale-95"/>
    <slot/>
  </nuxt-link>
</template>

<style scoped>

</style>