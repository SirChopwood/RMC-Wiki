<script setup lang="ts">
import StatsBar from "~/components/global/Weapon/StatsBar.vue";

const props = defineProps<{
  fireMode: Array<string>
  accuracyWielded: number
  accuracyUnWielded: number
  fireRate: number
  recoil: number
}>()

const fireModes: Record<string, string> = {
  SemiAuto: "Fires once per pull of the trigger.",
  Burst: "Fires a single burst of bullets per pull of the trigger.",
  FullAuto: "Fires continuously as long as the trigger is held."
}
</script>

<template>
  <table class="table-fixed max-w-full! w-full border-collapse text-md bg-content-bg">
    <tbody>
      <tr class="h-10">
        <th class="h-full w-1/3">Fire Modes</th>
        <td class="relative h-full flex flex-row gap-4 items-center">
            <span v-for="mode in props.fireMode"
                    class="hover:cursor-help hover:text-(--link) underline hover:decoration-(--link)"
                    :key="mode"
                    :title="fireModes[mode]"
          >{{mode}}</span>
        </td>
      </tr>
      <stats-bar
          v-if="props.accuracyWielded"
          type="accuracyWielded"
          :value="props.accuracyWielded"/>
      <stats-bar
          v-if="props.accuracyUnWielded"
          type="accuracyUnWielded"
          :value="props.accuracyUnWielded"/>
      <stats-bar
          v-if="props.fireRate"
          type="fireRate"
          :value="props.fireRate"/>
      <stats-bar
          v-if="props.recoil"
          type="recoil"
          :value="props.recoil"/>
    </tbody>
  </table>
</template>