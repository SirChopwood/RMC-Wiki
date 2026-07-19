<script setup lang="ts">
const props = defineProps<{
  type: string
  value: number
}>()

const BarInner = useTemplateRef("BarInner")

function getType() {
  return statType[props.type]!
}

const statType: Record<string, {
  name: string,
  tooltip: string,
  max: number
}> = {
  accuracyWielded: {
    name: "Accuracy (Wielded)",
    tooltip: "Multiplier to Accuracy when Wielding the weapon with both hands.",
    max: 3
  },
  accuracyUnWielded: {
    name: "Accuracy (Un-Wielded)",
    tooltip: "Multiplier to Accuracy when only holding the weapon with one hand.",
    max: 3
  },
  fireRate: {
    name: "Fire Rate",
    tooltip: "The rate at which the weapon fires per second.",
    max: 5
  },
  recoil: {
    name: "Recoil",
    tooltip: "The amount of recoil received when firing without wielding.",
    max: 5
  },
  damage: {
    name: "Damage",
    tooltip: "Base damage inflicted on an attack.",
    max: 100
  },
  ap: {
    name: "Armor Piercing",
    tooltip: "Amount of armour ignored when struck by the attack.",
    max: 100
  },
}

onMounted(() => {
  BarInner.value!.style.width = `${(props.value / getType().max)*100}%`
})
</script>

<template>
  <tr class="h-10 group hover:cursor-help" :title="getType().tooltip">
    <th class="h-full group-hover:text-(--link)">{{getType().name}}
    </th>
    <td class="h-full relative">
      <div class="w-full bg-(--page-bg) rounded p-1 h-full">
        <div ref="BarInner" class="min-w-fit bg-(--text-muted) group-hover:bg-(--link) rounded h-full text-sm text-(--content-bg) font-bold px-1 content-center">
          <span class="h-fit">{{props.value}}</span>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>

</style>