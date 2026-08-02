<script setup lang="ts">
import StatsBar from "~/components/global/Weapon/StatsBar.vue";

const props = defineProps<{
  stats: Record<string, any>
}>()

const fireModes: Record<string, string> = {
  SemiAuto: "Fires once per pull of the trigger.",
  Burst: "Fires a single burst of bullets per pull of the trigger.",
  FullAuto: "Fires continuously as long as the trigger is held."
}

const speedTiers: Record<string, string> = {
  light: "Very fast with near unrestricted movement.",
  medium: "Standard walking pace for most.",
  heavy: "Slow and sluggish, easily outpaced by others."
}
</script>

<template>
  <table class="table-fixed max-w-full! w-full border-collapse text-md bg-content-bg">
    <tbody>
      <tr v-if="props.stats.fireMode" class="h-10">
        <th class="h-full w-1/3">Fire Modes</th>
        <td class="relative h-full flex flex-row gap-4 items-center">
            <span v-for="mode in props.stats.fireMode"
                    class="hover:cursor-help hover:text-(--link) underline hover:decoration-(--link)"
                    :key="mode"
                    :title="fireModes[mode]"
          >{{mode}}</span>
        </td>
      </tr>
      <tr v-if="props.stats.speedTier" class="h-10">
        <th class="h-full w-1/3">Speed Tier</th>
        <td class="relative h-full flex flex-row gap-4 items-center">
            <span class="hover:cursor-help hover:text-(--link) underline hover:decoration-(--link)"
                  :title="speedTiers[props.stats.speedTier]"
            >{{props.stats.speedTier}}</span>
        </td>
      </tr>
      <stats-bar
          v-if="props.stats.armor"
          v-for="armorType in Object.keys(props.stats.armor)"
          type="armor"
          :value="Number(props.stats.armor[armorType])"
          :label="armorType"/>
      <stats-bar
          v-if="props.stats.damage"
          v-for="damageType in Object.keys(props.stats.damage)"
          type="damage"
          :value="Number(props.stats.damage[damageType])"
          :label="damageType"/>
      <stats-bar
          v-if="props.stats.accuracyWielded"
          type="accuracyWielded"
          :value="Number(props.stats.accuracyWielded)"/>
      <stats-bar
          v-if="props.stats.accuracyUnWielded"
          type="accuracyUnWielded"
          :value="Number(props.stats.accuracyUnWielded)"/>
      <stats-bar
          v-if="props.stats.fireRate"
          type="fireRate"
          :value="Number(props.stats.fireRate)"/>
      <stats-bar
          v-if="props.stats.recoil"
          type="recoil"
          :value="Number(props.stats.recoil)"/>
    </tbody>
  </table>
</template>