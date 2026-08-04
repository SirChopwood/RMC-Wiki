<script setup lang="ts">
const props = defineProps<{
  name: string,
  id: string,
  description: string,
  sprite: any
}>()
</script>

<template>
  <div class="relative group/atch">
    <h2 class="group-hover/atch:text-(--link) transition-all duration-100">
      {{props.name}}
    </h2>
    <sprite-img :sprite="props.sprite" class="size-14 float-right"/>
    <hatnote icon="false" class="group-hover/atch:text-(--text) transition-all duration-100">
      ID: {{props.id}}
    </hatnote>
    <pull-quote class="group-hover/atch:text-(--text) transition-all duration-100">
      {{props.description}}
    </pull-quote>
  </div>
</template>

<style scoped>

</style>