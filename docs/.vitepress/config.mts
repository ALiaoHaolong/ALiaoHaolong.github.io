import { defineConfig, UserConfig } from 'vitepress'
import { withI18n } from 'vitepress-i18n'
import { VitePressI18nOptions } from "vitepress-i18n/types";
import { teekConfig } from './teekConfig.mts'
import path from 'path';

// VitePress 基础配置 https://vitepress.dev/zh/
const vitePressOptions: UserConfig = {
  title: "白羽拾光 🕊️",
  titleTemplate: ":title - 白羽拾光 🕊️",
  description: "拾起光阴落下的羽毛。",
  head: [
    [ 'link', { rel: 'icon', href: '/favicon.ico' } ],
    [ "link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/qweather-icons@1.8.0/font/qweather-icons.css" } ],
  ],
  lang: 'zh-CN',
  themeConfig: {
    search: {
      provider: 'local',
    },
    logo: '/favicon.jpg',
    nav: [
      { text: '首页', link: '/' },
      {
        text: '统计',
        items: [
          { text: '分类', link: '/categories.html' },
          { text: '标签', link: '/tags.html' },
          { text: '归档', link: '/archives.html' },
          { text: '文章清单', link: '/articleOverview.html' },
        ]
      },
      { text: '关于', link: '/about.html' },
      { text: '✨ 赞赏', link: '/tea.html' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aliaohaolong' }
    ],
    editLink: {
      text: "编辑此页",
      pattern: "https://github.com/ALiaoHaolong/ALiaoHaolong.github.io/edit/master/docs/:path",
    },
  },
  lastUpdated: true, // 显示最后更新时间（基于 /git log 的时间）
  markdown: {
    lineNumbers: true, // 启用行号
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './theme'),
      }
    },
  },
  extends: teekConfig,
}

// 国际化配置 https://vitepress-i18n.cdget.com/
const vitePressI18nOptions: VitePressI18nOptions = {
  locales: [{ path: 'zh', locale: 'zhHans' }], // 仅配置中文
  rootLocale: 'zhHans',
  searchProvider: 'local', // 为搜索栏提供翻译
}

// noinspection JSUnusedGlobalSymbols
export default defineConfig(withI18n(vitePressOptions, vitePressI18nOptions))
