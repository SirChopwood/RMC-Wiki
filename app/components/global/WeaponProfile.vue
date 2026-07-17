<script setup lang="ts">
const props = defineProps<{
  icon: string,
}>()

const iconPath = `https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/${props.icon}/icon.png?raw=true`
</script>

<template>
    <nuxt-link :to="iconPath" external class="float-right block size-40 aspect-square rounded p-2 m-2" style="background: var(--page-bg);">
      <nuxt-img :src="iconPath" class="pixelated w-full"/>
    </nuxt-link>
</template>