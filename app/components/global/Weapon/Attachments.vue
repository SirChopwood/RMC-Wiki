<script setup lang="ts">
const props = defineProps<{
  attachments: Record<string, Array<{
    id: string,
    name: string,
    description: string,
    sprite: Array<string>,
  }>>,
}>()
</script>

<template>
  <h3>Attachments</h3>
  <accordion>
    <div v-for="(value, key) in props.attachments" :key="key" :title="key">
      <div v-for="attachment in value">
        <sprite-img :sprite="attachment.sprite" class="size-12 float-right"/>
        <h3>
          {{attachment.name}}
        </h3>
        <hatnote icon="false">
          ID: {{attachment.id}}
        </hatnote>
        <pull-quote>
          {{attachment.description}}
        </pull-quote>
      </div>
    </div>
  </accordion>
</template>