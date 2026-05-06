import Teek from "vitepress-theme-teek";

// 主题增强
import "vitepress-theme-teek/index.css";

// VitePress 增强：https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/main/packages/theme-chalk/src/vp-plus
import "vitepress-theme-teek/vp-plus/aside.scss"; // 右侧目栏录文字悬停和激活动画
import "vitepress-theme-teek/vp-plus/blockquote.scss"; // > 引用块样式
import "vitepress-theme-teek/vp-plus/code-block-mobile.scss"; // 移动端代码块样式优化 (不那么贴边显示)
import "vitepress-theme-teek/vp-plus/doc-h1-gradient.scss"; // 一级标题渐变色
import "vitepress-theme-teek/vp-plus/mark.scss"; // <mark></mark> 样式
import "vitepress-theme-teek/vp-plus/nav-blur.scss"; // 导航栏毛玻璃样式
import "vitepress-theme-teek/vp-plus/nav-search-button.scss"; // 导航栏搜索按钮优化
import "vitepress-theme-teek/vp-plus/scrollbar.scss"; // 滚动条样式
import "vitepress-theme-teek/vp-plus/sidebar.scss"; // 侧边栏文字悬停和激活动画
import "vitepress-theme-teek/vp-plus/table.scss"; // 表格样式调整，去掉单元格之间的线条

// Teek 增强：https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/main/packages/theme-chalk/src/tk-plus
import "vitepress-theme-teek/tk-plus/banner-desc-gradient.scss"; // 博客风格 Banner 描述渐变样式
import "vitepress-theme-teek/tk-plus/fade-up-animation.scss"; // 首次加载的动画渐入效果
import "vitepress-theme-teek/tk-plus/home-card-hover.scss"; // 首页卡片悬停效果

import "./styles/overrides.css"
import "./styles/custom.css"
import TeekLayoutProvider from "./components/TeekLayoutProvider.vue";

// noinspection JSUnusedGlobalSymbols
export default {
  extends: Teek,
  Layout: TeekLayoutProvider,
  setup: () => {
  },
};
