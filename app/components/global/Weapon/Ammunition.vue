<script setup lang="ts">
import StatsBar from "~/components/global/Weapon/StatsBar.vue";

const props = defineProps<{
  magazines: Array<{
    name: string,
    id: string,
    description: string,
    sprite: Array<string>,
    color?: string,
    capacity?: number,
    damage?: number,
    ap?: number,
  }>,
}>()

</script>

<template>
  <h3>Ammunition</h3>
  <tabs>
    <div v-for="(value, key) in props.magazines"
        :key="key"
        :title="value.name">
      <sprite-img :sprite="value.sprite" class="size-20 float-right"/>
      <hatnote icon="false">
        ID: {{value.id}}
      </hatnote>
      <pull-quote>
        {{value.description}}
      </pull-quote>
      <table class="table-fixed border-collapse text-md bg-content-bg">
        <tbody>
        <tr class="h-10" v-if="value.capacity">
          <th class="h-full w-1/3">Capacity</th>
          <td class="">{{value.capacity}} Rounds</td>
        </tr>
        <stats-bar
            v-if="value.damage"
            type="damage"
            :value="value.damage"/>
        <stats-bar
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