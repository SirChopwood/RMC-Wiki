<script setup lang="ts">
import SpriteImg from "~/components/global/SpriteImg.vue";

const props = defineProps<{
  icon: string,
}>()

const iconPath = `https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/${props.icon}/icon.png?raw=true`
</script>

<template>
  <sprite-img :path="iconPath" class="float-right block size-40"/>
</template>