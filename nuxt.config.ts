import tailwindcss from "@tailwindcss/vite";
import { bundledLanguages, type BundledLanguage } from "shiki";

export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@/assets/css/main.css"],
  modules: [
    "@nuxt/content",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/color-mode",
    "nuxt-og-image",
  ],
  colorMode: {
    preference: "dark",
    fallback: "dark",
    globalName: "__NUXT_COLOR_MODE__",
    classPrefix: "",
    classSuffix: "",
    storage: "localStorage",
    storageKey: "rmcwiki-color-mode",
  },
  image: {
    provider: "none",
  },
  nitro: {
    preset: "github-pages",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      autoSubfolderIndex: true,
    },
  },
  experimental: {
    asyncContext: true,
  },
  app: {
    baseURL: "/RMC-Wiki/", // Change this to your desired base URL, or remove it if you want to serve from the root.
    cdnURL: "/RMC-Wiki/", // Change this to your desired CDN URL, or remove it if you want to serve from the root.
    head: {
      base: { href: "/RMC-Wiki/" }, // Change this to your desired base URL, or remove it if you want to serve from the root.
    },
  },
  ogImage: {
    compatibility: {
      prerender: {
        browser: "on-demand",
        takumi: "node",
      },
    },
  },
  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
        highlight: {
          theme: {
            default: "github-light",
            dark: "github-dark",
          },
          langs: Object.keys(bundledLanguages).filter(
            (lang) =>
              !lang.includes("+") &&
              !lang.includes("#") &&
              !lang.includes("文"),
          ) as BundledLanguage[],
        },
      },
    },
    experimental: {
      sqliteConnector: "native",
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  scripts: {
    registry: {
      youtubePlayer: {
        trigger: "onNuxtReady",
      },
    },
  },
});
