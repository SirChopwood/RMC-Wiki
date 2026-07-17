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
  pmc: 'PMC',
  tse: 'TSE',
  spp: 'SPP',
  unmc: 'UNMC',
  clf: 'CLF',
  civ: 'Civ',
}

const tooltips: Record<string, string> = {
  pmc: 'Private Military Contractors, often from Weston-Yamada, AEGIS Armaments or one of the many other private corporations.',
  tse: 'Three Suns Empire, a federation uniting British and Japanese empires maintaining a position as the leading economic power.',
  spp: "Socialist Progressive Peoples, a vast, authoritarian socialist state commanding a vast territory across many star systems. Based on the idea of collective ownership and the elimination of class distinction.",
  unmc: 'United Nations Marine Corps, governed by the civilian government of the United Nations, and regulated by the Provost Marshal Office. The UNMC was primarily assigned to the defense of the growing frontiers of the United Nations government.',
  clf: 'Colony Liberation Front, also known as the Free Colonists, form in response to growing discontent among the distant colonies. What starts as peaceful protests, evolves into an armed resistance.',
  civ: 'Civilian, not specifically affiliated with one of the major military powers in the galaxy.',
}
</script>

<template>
  <span
    class="inline-flex items-center text-sm font-bold uppercase tracking-wide px-1.5 py-0.5 border rounded-xs align-middle mx-1 opacity-75 not-italic"
    :class="styles[type]"
    :title="tooltips[type]"
  >
    <slot>{{ labels[type] }}</slot>
  </span>
</template>