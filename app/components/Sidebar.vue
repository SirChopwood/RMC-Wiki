<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()

defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits(['close'])

const { data: navigation } = await useAsyncData('navigation', async () => {
    const nav = await queryCollectionNavigation('content')

    function sortNavigation(items: any[]): any[] {
        return items
            .filter(item => !item.hide)
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .map(item => ({
                ...item,
                children: item.children ? sortNavigation(item.children) : []
            }))
    }
    return sortNavigation(nav)
})

watch(() => route.path, () => {
    emit('close')
})

import { ref } from 'vue'

const collapsedGroups = ref<Record<string, boolean>>({})

function toggleGroup(path: string) {
    collapsedGroups.value[path] = !collapsedGroups.value[path]
}

function isGroupOpen(path: string) {
    return collapsedGroups.value[path] !== true
}
</script>

<template>
    <aside class="hidden sm:block sticky top-2 h-[calc(100dvh-0.5rem)] pt-3 min-h-0 pb-16 w-fit max-w-96 overflow-y-scroll">
        <div v-for="group in navigation" :key="group.path" class="mb-3.5 px-4">
            <h3 v-if="group.children.length > 0" @click="toggleGroup(group.path)"
                class="cursor-pointer flex items-center select-none justify-between text-xl uppercase tracking-[0.02em] text-text-muted mb-1 font-bold border-b border-border-light pb-0.75 text-nowrap">
                {{ group.title }}

                <span class="mx-2">
                    {{ isGroupOpen(group.path) ? '−' : '+' }}
                </span>
            </h3>

            <ul v-if="group.children && isGroupOpen(group.path)" class="list-none m-0 p-0">
                <li v-for="item in group.children" :key="item.path"
                    :class="{ 'pl-1.5 border-l-2 border-link -ml-0.5': route.path === item.path }"
                    class="relative pl-2 py-1">
                    <NuxtLink :to="item.path" class="text-md font-bold text-text-muted hover:text-text dynamic-link"
                        :class="{ 'italic text-text': route.path === item.path }">
                        {{ item.title }}
                    </NuxtLink>
                    <li v-if="item.children && item.children.length > 0" v-for="item2 in item.children" :key="item2.path"
                        :class="{ 'pl-1.5 border-l-2 border-link -ml-0.5': route.path === item2.path }"
                        class="relative pl-2 py-1 block">
                      - <NuxtLink :to="item2.path" class="text-md text-text-muted hover:text-text dynamic-link"
                                :class="{ 'italic text-text': route.path === item2.path }">
                        {{ item2.title }}
                      </NuxtLink>
                    </li>
                </li>
            </ul>
        </div>
    </aside>

    <div class="sm:hidden">
        <Transition name="fade">
            <div v-if="isOpen" @click="emit('close')" class="fixed inset-0 bg-black/40 z-850 backdrop-blur-xs" />
        </Transition>

        <Transition name="slide">
            <div v-if="isOpen"
                class="bg-sidebar-bg h-dvh z-900 w-5/6 fixed top-0 left-0 border-r border-border shadow-2xl flex flex-col">

                <div class="flex items-center justify-between px-3 py-2 border-b border-border-light shrink-0">
                    <h3 class="text-[11.5px] uppercase tracking-[0.02em] text-text-muted font-bold">
                        Navigation
                    </h3>
                    <button @click="emit('close')" class="text-text-muted hover:text-text p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div class="overflow-y-auto flex-1 min-h-0 py-3">
                    <div v-for="group in navigation" :key="group.path" class="mb-3.5 px-3">
                        <h3 class="text-lg uppercase tracking-[0.02em] text-text-muted mb-1 font-bold border-b border-border-light pb-0.75"
                            v-if="group.children.length > 0">
                            {{ group.title }}
                        </h3>

                        <ul v-if="group.children" class="list-none m-0 p-0">
                            <li v-for="item in group.children" :key="item.path"
                                :class="{ 'pl-1.5 border-l-2 border-link -ml-0.5': route.path === item.path }"
                                class="relative pl-2 py-1">
                                <NuxtLink :to="item.path"
                                    class="text-md font-bold text-text-muted hover:text-text dynamic-link block w-full"
                                    :class="{ 'italic text-text': route.path === item.path }">
                                    {{ item.title }}
                                </NuxtLink>
                                <li  v-if="item.children && item.children.length > 0" v-for="item2 in item.children" :key="item2.path"
                                    :class="{ 'pl-1.5 border-l-2 border-link -ml-0.5': route.path === item2.path }"
                                    class="relative pl-2 py-1 block">
                                    - <NuxtLink :to="item2.path"
                                              class="text-md text-text-muted hover:text-text dynamic-link w-full"
                                              :class="{ 'italic text-text': route.path === item2.path }">
                                      {{ item2.title }}
                                    </NuxtLink>

                                </li>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </Transition>
    </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s linear;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>