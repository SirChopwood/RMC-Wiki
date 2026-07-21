<script setup lang="ts">
const props = defineProps<{
  sprite: Array<string>,
}>()

function getTexturePath(layer: string) {
  return `https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/${layer}?raw=true`
}
</script>

<template>
  <nuxt-link v-if="sprite && sprite.length > 0" :to="getTexturePath(props.sprite[0]!)" external class="relative block aspect-square rounded m-2 overflow-clip" style="background: var(--page-bg);">
    <nuxt-img v-for="layer of props.sprite" :src="getTexturePath(layer)" class="absolute pixelated w-full scale-95"/>
    <slot/>
  </nuxt-link>
</template>

<style scoped>

</style>