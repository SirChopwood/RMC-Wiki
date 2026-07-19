<script setup lang="ts">
import WeaponStatsBar from "~/components/global/weapons/WeaponStatsBar.vue";

const props = defineProps<{
  magazines: Array<{
    name: string,
    icon: string,
    color?: string,
    capacity?: number,
    damage?: number,
    ap?: number,
  }>,
}>()

function getIconPath (path: string, state: string = "base") {
  return `https://github.com/RMC-14/RMC-14/blob/master/Resources/Textures/${path}/${state}.png?raw=true`
}
</script>

<template>
  <h3>Ammunition</h3>
  <tabs>
    <div v-for="(value, key) in props.magazines"
        :key="key"
        :title="value.name">
      <sprite-img :path="getIconPath(value.icon)" class="size-20 float-right">
        <div v-if="value.color" class="absolute pixelated size-full">
          <div class="drop-shadow-example">
            <nuxt-img class="pixelated size-full" :src="getIconPath(value.icon, 'ammo_band')"/>
            <nuxt-img class="pixelated size-full duplicate" :src="getIconPath(value.icon, 'ammo_band')" :style="`filter: drop-shadow(0px 1000px 0 ${value.color});`"/>
          </div>
        </div>
      </sprite-img>
      <table class="table-fixed border-collapse text-md bg-content-bg">
        <tbody>
        <tr class="h-10" v-if="value.capacity">
          <th class="h-full w-1/3">Capacity</th>
          <td class="">{{value.capacity}} Rounds</td>
        </tr>
        <weapon-stats-bar
            v-if="value.damage"
            type="damage"
            :value="value.damage"/>
        <weapon-stats-bar
            v-if="value.ap"
            type="ap"
            :value="value.ap"/>
        </tbody>
      </table>
    </div>
  </tabs>
</template>

<style scoped>
.drop-shadow-example {
  position: relative;
  overflow: hidden;
  img:first-child {
    mix-blend-mode: multiply;
    z-index: 2;
  }
  .duplicate {
    position: absolute;
    inset: 0;
    transform: translateY(-1000px);
  }
}
</style>