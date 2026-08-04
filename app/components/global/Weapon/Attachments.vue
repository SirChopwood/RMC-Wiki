<script setup lang="ts">
import AttachmentItem from "~/components/global/Weapon/AttachmentItem.vue";

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
  <h3 v-if="Object.keys(props.attachments).length > 0">Attachments</h3>
  <accordion v-if="Object.keys(props.attachments).length > 0">
    <div v-for="(value, key) in props.attachments"
         :key="key"
         :title="key"
         class="flex flex-col gap-1">
      <attachment-item v-for="attachment in value"
                       :key="attachment.id"
                       :name="attachment.name"
                       :id="attachment.id"
                       :description="attachment.description"
                       :sprite="attachment.sprite"/>
    </div>
  </accordion>
</template>