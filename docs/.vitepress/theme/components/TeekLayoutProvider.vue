<!--suppress VueUnrecognizedSlot -->
<template>
  <Teek.Layout>
    <!-- 公告内容，暂未启用 -->
    <template #teek-notice-content>

    </template>

    <!-- 首页 Banner 背景图作者及来源标注 -->
    <template #teek-home-banner-content-after>
      <LhlHomeBannerContentAfter />
    </template>

    <!-- 首页个人卡片背景图来源标注 -->
    <template #teek-home-card-my-avatar-before>
      <LhlHomeCardMyAvatarBefore />
    </template>

    <!-- 首页个人卡片后的天气卡片 -->
    <template #teek-home-card-my-after>
      <LhlHomeCardMyAfter />
    </template>

    <!-- 首页标签卡片后的贡献卡片 -->
    <template #teek-home-card-tag-after>
      <LhlHomeCardTagAfter />
    </template>

    <!-- 首页友情链接前的待办卡片 -->
    <template #teek-home-card-friend-link-before>
      <LhlHomeCardFriendLinkBefore />
    </template>

    <!-- 博客风文章页 Banner 背景图作者及来源标注 -->
    <template #teek-article-banner-info-bottom>
      <LhlArticleBannerInfoBottom />
    </template>

    <!-- 文章底部版权信息标注 -->
    <template #teek-article-bottom-tip-before>
      <LhlArticleBottomTipBefore/>
    </template>

    <!-- 归档页贡献图 -->
    <template #teek-archives-top-before>
      <LhlArchivesTopBefore />
    </template>

    <!-- 自定义 404 内容 -->
    <template #not-found>
      <LhlNotFound/>
    </template>
  </Teek.Layout>
</template>

<script setup lang="ts">
import Teek, { clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { nextTick, watch } from "vue";
import { useRibbon } from "../composables/useRibbon";
import { useRuntime } from "../composables/useRuntime";
import { useDocBgImage } from "../composables/useDocBgImage.ts";
import {
  LhlArchivesTopBefore,
  LhlArticleBannerInfoBottom,
  LhlArticleBottomTipBefore,
  LhlHomeBannerContentAfter,
  LhlHomeCardFriendLinkBefore,
  LhlHomeCardMyAfter,
  LhlHomeCardMyAvatarBefore,
  LhlHomeCardTagAfter,
  LhlNotFound,
} from "./slots";

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

// 文档页背景图片
const { switchDocBgImage } = useDocBgImage({});
const watchDocBgImage = async (layout: string) => {
  const isDoc = [undefined, "doc"].includes(layout); // 首页 & 文章页
  const showAside = frontmatter.value.aside !== false; // 文档风文章页 & 博客风文章页
  await nextTick();
  // 切换文档页背景图片
  switchDocBgImage(isDoc && showAside && frontmatter.value.coverImg ? frontmatter.value.coverImg : '');
};
watch(frontmatter, newVal => setTimeout(() => watchDocBgImage(newVal.layout), 0), { immediate: true, flush: "post", });
</script>

<style scoped lang="scss">

</style>