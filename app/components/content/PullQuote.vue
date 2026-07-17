<script setup lang="ts">
defineProps<{
  cite?: string
}>()
</script>

<template>
  <figure class="my-4 ml-6 mr-8">
    <blockquote class="font-heading text-[17px] italic color-text border-l-3 border-border pl-3.5 m-0 leading-normal">
      <slot />
    </blockquote>
    <figcaption class="text-xs text-text-muted pl-3.5 mt-1" v-if="cite">— {{ cite }}</figcaption>
  </figure>
</template>