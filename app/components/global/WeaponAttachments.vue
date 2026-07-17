<script setup lang="ts">
const props = defineProps<{
  attachments: Record<string, Array<string>>,
}>()
</script>

<template>
  <h3>Attachments</h3>
  <tabs>
    <ul v-for="(value, key) in props.attachments" :key="key" :title="key">
      <li v-for="attachment in value">
        {{attachment}}
      </li>
    </ul>
  </tabs>
</template>