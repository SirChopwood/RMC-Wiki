<script setup lang="ts">
const props = defineProps<{
  type: string
  value: number
  label?: string
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
    max: 2
  },
  accuracyUnWielded: {
    name: "Accuracy (Un-Wielded)",
    tooltip: "Multiplier to Accuracy when only holding the weapon with one hand.",
    max: 2
  },
  fireRate: {
    name: "Fire Rate",
    tooltip: "The rate at which the weapon fires per second.",
    max: 10
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
  armor: {
    name: "Armor",
    tooltip: "Damage reduction when worn.",
    max: 50
  }
}

onMounted(() => {
  BarInner.value!.style.width = `${(props.value / getType().max)*100}%`
})
</script>

<template>
  <tr class="h-10 group hover:cursor-help" :title="getType().tooltip">
    <th class="h-full group-hover:text-(--link)">{{getType().name}}<span v-if="props.label"> ({{props.label}})</span>
    </th>
    <td class="h-full relative">
      <div class="bevel w-full bg-(--page-bg) rounded p-1 h-full">
        <div ref="BarInner" class="bevel min-w-fit bg-(--text-muted) retro:bg-(--header-band) group-hover:bg-(--link) min-h-6 h-full text-sm text-(--content-bg) font-bold px-1 content-center">
          <span class="bevel h-fit bg-(--page-bg)/75 px-2 text-(--text)">{{props.value}}</span>
        </div>
      </div>
    </td>
  </tr>
</template>

<style scoped>

</style>