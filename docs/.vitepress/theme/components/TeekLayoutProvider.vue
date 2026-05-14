<template>
  <Teek.Layout>
    <template #teek-notice-content>
      公告内容，暂未启用
    </template>

    <template #teek-home-banner-content-after>
      <HomeBannerContentAfter />
    </template>

    <template #teek-article-banner-info-bottom>
      <ArticleBannerInfoBottom />
    </template>

    <template #teek-article-bottom-tip-before>
      <ArticleBottomTipBefore/>
    </template>

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
import ArticleBannerInfoBottom from "./ArticleBannerInfoBottom.vue";
import ArticleBottomTipBefore from "./ArticleBottomTipBefore.vue";
import NotFound from "./NotFound.vue";

const { theme, frontmatter } = useData();

// 彩带背景
const { start: startRibbon, stop: stopRibbon } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime(theme.value.docAnalysis.createTime, {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `,
});

const watchRuntimeAndRibbon = async (layout: string) => {
  const isHome = layout === "home";
  const isDoc = [undefined, "doc"].includes(layout);

  // 博客类风格的首页显示运行时间
  await nextTick();
  if (isHome) startRuntime();
  else stopRuntime();

  // 博客类风格的首页显示彩带 & 文章页显示彩带
  if (isHome || isDoc) startRibbon();
  else stopRibbon();
};

watch(frontmatter, newVal => setTimeout(() => watchRuntimeAndRibbon(newVal.layout), 700), {
  immediate: true,
  flush: "post",
});
</script>

<style scoped lang="scss">

</style>