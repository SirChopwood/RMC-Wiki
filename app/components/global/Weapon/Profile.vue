<script setup lang="ts">
import SpriteImg from "~/components/global/SpriteImg.vue";

const props = defineProps<{
  sprite: Array<string>,
}>()
</script>

<template>
  <sprite-img :sprite="props.sprite" class="float-right block size-40"/>
</template>