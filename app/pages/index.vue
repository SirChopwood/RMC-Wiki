<script setup lang="ts">
const { wikiName, wikiLogo, wikiBackground } = useAppConfig()
</script>

<template>
  <nuxt-img :src="wikiBackground" class="w-full h-full -z-50 fixed"/>
    <div class="flex h-screen items-center justify-center text-lg sm:text-2xl text-center">
      <div class="flex flex-col p-4 rounded-2xl" style="background: var(--page-bg);">
        <div>
          Welcome to the <span class="text-red-600">{{wikiName}}</span> Wiki!
        </div>
        <nuxt-img :src="wikiLogo" class="pixelated -mt-10 sm:-mt-32"/>
        <nuxt-link to="/equipment">Click here to browse the Wiki</nuxt-link>
      </div>
    </div>
</template>