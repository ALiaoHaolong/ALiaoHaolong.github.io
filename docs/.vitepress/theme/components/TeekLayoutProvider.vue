<template>
  <Teek.Layout>
    <!-- 公告内容，暂未启用 -->
    <template #teek-notice-content>

    </template>

    <!-- 首页 Banner 背景图作者及来源标注 -->
    <template #teek-home-banner-content-after>
      <HomeBannerContentAfter />
    </template>

    <!-- 首页个人卡片背景图来源标注 -->
    <template #teek-home-card-my-avatar-before>
      <HomeCardMyAvatarBefore />
    </template>

    <!-- 博客风文章页 Banner 背景图作者及来源标注 -->
    <template #teek-article-banner-info-bottom>
      <ArticleBannerInfoBottom />
    </template>

    <!-- 文章底部版权信息标注 -->
    <template #teek-article-bottom-tip-before>
      <ArticleBottomTipBefore/>
    </template>

    <!-- 自定义 404 内容 -->
    <template #not-found>
      <NotFound/>
    </template>
  </Teek.Layout>
</template>

<script setup lang="ts">
import Teek, { clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { nextTick, watch } from "vue";
import { useRibbon } from "../composables/useRibbon";
import { useRuntime } from "../composables/useRuntime";
import HomeBannerContentAfter from "./HomeBannerContentAfter.vue";
import HomeCardMyAvatarBefore from "./HomeCardMyAvatarBefore.vue";
import ArticleBannerInfoBottom from "./ArticleBannerInfoBottom.vue";
import ArticleBottomTipBefore from "./ArticleBottomTipBefore.vue";
import NotFound from "./NotFound.vue";

const { theme, frontmatter } = useData();

// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ alpha: 0.4, immediate: false, clickReRender: true, });
const watchRibbon = async (layout: string) => {
  const isHome = layout === "home";
  const isDoc = [undefined, "doc"].includes(layout);
  await nextTick();
  // 博客类风格的首页显示彩带 & 文章页显示彩带
  if (isHome || isDoc) startRibbon();
  else stopRibbon();
};
watch(frontmatter, newVal => setTimeout(() => watchRibbon(newVal.layout), 700), { immediate: true, flush: "post", });

// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime(theme.value.docAnalysis.createTime, {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `,
});
const watchRuntime = async (layout: string) => {
  const isHome = layout === "home";
  await nextTick();
  // 博客类风格的首页显示运行时间
  if (isHome) startRuntime();
  else stopRuntime();
};
watch(frontmatter, newVal => setTimeout(() => watchRuntime(newVal.layout), 700), { immediate: true, flush: "post", });

// 文档页背景
const docBgLayer0 = document.createElement('img');
const docBgLayer1 = document.createElement('img');
docBgLayer0.classList.add("doc-background-image");
docBgLayer1.classList.add("doc-background-image");
docBgLayer0.style.opacity = "0.0";
docBgLayer1.style.opacity = "0.0";
docBgLayer0.src = '';
docBgLayer1.src = '';
docBgLayer0.dataset.src = '';
docBgLayer1.dataset.src = '';
document.body.appendChild(docBgLayer0);
document.body.appendChild(docBgLayer1);
let activeDocBackgroundImage = 0;
const watchDocBackgroundImage = async (layout: string) => {
  const isDoc = [undefined, "doc"].includes(layout); // 首页 & 文章页
  const showAside = frontmatter.value.aside !== false; // 文档风文章页 & 博客风文章页
  await nextTick();
  // 切换文档页背景图片
  const nextSrc = isDoc && showAside && frontmatter.value.coverImg ? frontmatter.value.coverImg : '';
  const oldBgLayer = activeDocBackgroundImage === 0 ? docBgLayer0 : docBgLayer1;
  const newBgLayer = activeDocBackgroundImage === 0 ? docBgLayer1 : docBgLayer0;
  // 相同图片不切换
  if (oldBgLayer.dataset.src === nextSrc) return;
  // 旧图不存在且新图不存在
  if (oldBgLayer.dataset.src === '' && nextSrc === '') return;
  // 旧图不存在且新图存在，直接挂载并显示新图
  if (oldBgLayer.dataset.src === '') {
    oldBgLayer.src = nextSrc;
    oldBgLayer.dataset.src = nextSrc;
    oldBgLayer.style.transitionDuration = "0.7s"
    oldBgLayer.style.opacity = "0.25";
    return;
  }
  // 旧图存在但新图不存在，直接消失旧图
  if (nextSrc === '') {
    oldBgLayer.dataset.src = '';
    oldBgLayer.style.transitionDuration = "0.7s"
    oldBgLayer.style.opacity = "0.0";
    return;
  }
  // 旧图存在且新图存在，更新状态，切图
  activeDocBackgroundImage = activeDocBackgroundImage === 0 ? 1 : 0;
  // 旧图消失事件处理
  const handleTransitionEnd = () => {
    // 消失完成后卸载旧图
    oldBgLayer.removeEventListener('transitionend', handleTransitionEnd);
    // 新图开始显示
    newBgLayer.style.transitionDuration = "0.35s"
    newBgLayer.style.opacity = "0.25";
  };
  // 更新新图并挂载，但不显示，透明度为 0
  newBgLayer.src = nextSrc;
  newBgLayer.dataset.src = nextSrc;
  // 监听旧图消失
  oldBgLayer.addEventListener('transitionend', handleTransitionEnd);
  // 开始消失旧图
  oldBgLayer.style.transitionDuration = "0.35s"
  oldBgLayer.style.opacity = "0.0";
};
watch(frontmatter, newVal => setTimeout(() => watchDocBackgroundImage(newVal.layout), 0), { immediate: true, flush: "post", });
</script>

<style lang="scss">
.doc-background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  pointer-events: none;
  filter: blur(4px);
  transition: opacity ease-out;
}
</style>