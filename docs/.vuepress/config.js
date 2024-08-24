import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"
import { sidebarConfig } from './sidebar.js'

export default defineUserConfig({
  lang: 'en-US',
  title: 'Laravel Hyperf',
  description: 'The Laravel-Style Hyperf Framework for Artisans.',

  ignoreDeadLinks: true,
  bundler: viteBundler(),

  plugins: [
    mdEnhancePlugin({
      hint: true,
      tasklist: true,
      include: true,
      tabs: true,
      align: true,
      chart: true,
    }),
  ],

  theme: defaultTheme({
    // logo: 'https://vuejs.press/images/hero.png',

    docsRepo: 'swooletw/laravel-hyperf.com',

    docsBranch: 'main',

    navbar: [
      '/',
      {
        text: 'Documentation',
        link: '/docs/introduction',
      },
      {
        text: 'GitHub',
        link: 'https://github.com/swooletw/laravel-hyperf',
      }
    ],

    sidebar: sidebarConfig,

    sidebarDepth: 0,
  }),
})
