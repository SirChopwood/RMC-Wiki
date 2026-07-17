<script setup lang="ts">
const props = withDefaults(defineProps<{
  type?: 'weya' | 'tse' | 'spp' | 'unmc' | 'clf' | 'civ'
}>(), {
  type: 'unmc'
})

const styles: Record<string, string> = {
  weya: 'bg-amber-50 text-amber-800 border-amber-300',
  tse: 'bg-green-50 text-green-800 border-green-300',
  spp: 'bg-red-50 text-red-800 border-red-300',
  unmc: 'bg-blue-50 text-blue-800 border-blue-300',
  clf: 'bg-gray-100 text-neutral-800 border-border',
  civ: 'bg-purple-50 text-purple-800 border-purple-300',
}

const labels: Record<string, string> = {
  weya: 'WeYa',
  tse: 'TSE',
  spp: 'SPP',
  unmc: 'UNMC',
  clf: 'CLF',
  civ: 'Civ',
}

const tooltips: Record<string, string> = {
  weya: 'Weston-Yamada',
  tse: 'Three Sun Empire',
  spp: "Socialist People's Protectorate",
  unmc: 'United Nations Marine Corps',
  clf: 'Colonial Liberation Front',
  civ: 'Civilian',
}
</script>

<template>
  <span
    class="inline-flex items-center text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 border rounded-xs align-middle mx-1 opacity-75"
    :class="styles[type]"
    :title="tooltips[type]"
  >
    <slot>{{ labels[type] }}</slot>
  </span>
</template>