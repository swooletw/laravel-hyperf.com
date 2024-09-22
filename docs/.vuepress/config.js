import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance"
import { redirectPlugin } from '@vuepress/plugin-redirect'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { sidebarConfig } from './sidebar.js'
import { removeHtmlExtensionPlugin } from 'vuepress-plugin-remove-html-extension'
import { seoPlugin } from '@vuepress/plugin-seo'

export default defineUserConfig({
  lang: 'en-US',
  title: 'Laravel Hyperf',
  description: 'The Laravel-Style Hyperf Framework for Web Artisans.',

  ignoreDeadLinks: true,
  bundler: viteBundler(),

  plugins: [
    seoPlugin({
      hostname: 'https://laravel-hyperf.com',
      fallBackImage: '/icon.png',
      ogp: (ogp, page) => ({
        ...ogp,
        'og:title': 'Laravel Hyperf - The Laravel Style Hyperf Framework For Web Artisans',
        'og:description': "Laravel Hyperf is a PHP framework which aims to help Laravel artisans enjoy the high performance of Hyperf while maintaining familiar Laravel development practices.",
      }),
    }),
    removeHtmlExtensionPlugin(),
    mdEnhancePlugin({
      hint: true,
      tasklist: true,
      include: true,
      tabs: true,
      align: true,
      chart: true,
    }),
    redirectPlugin({
        config: {
          '/docs': '/docs/introduction.html',
        },
    }),
    docsearchPlugin({
      appId: 'A2UA6ZNU27',
      apiKey: '03f51299803c8172f7b3008d88a12c86',
      indexName: 'laravel-hyperf'
    }),
  ],

  theme: defaultTheme({
    logo: 'icon.svg',

    docsRepo: 'swooletw/laravel-hyperf.com',

    docsBranch: 'master',

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
