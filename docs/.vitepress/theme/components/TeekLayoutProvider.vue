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
</script>

<style scoped lang="scss">

</style>