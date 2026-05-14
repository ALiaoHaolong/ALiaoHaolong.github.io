<template>
  <TkVpContainer v-bind="bottomTipBeforeConfig" />
  <TkArticleShare v-if="isShowBottomShare" />
</template>

<script setup lang="ts">
import { TkArticleShare, TkVpContainer } from "vitepress-theme-teek";
import { useData, useRoute } from "vitepress";
import { computed } from "vue";
import type { VpContainerProps } from "vitepress-theme-teek/lib/components/common/VpContainer/src/vpContainer"

// 作者
const { theme, frontmatter } = useData(); // 获取 teekConfig 和 frontmatter
const author = computed(() =>
  frontmatter.value.tk?.author?.name ?? // 主页值
  frontmatter.value.author?.name ?? // 文章值
  theme.value.author?.name ?? // 全局值
  undefined // 默认值
) // ?? 是空值合并运算符，只有当左侧是 null 或 undefined 时，才返回右侧的值

// 生成 VpContainer 需要的参数
const route = useRoute();
const bottomTipBeforeConfig = computed<VpContainerProps>(() => {
  // 链接
  let url = frontmatter.value.permalink || route.path;
  // 延迟获取当前域名，否则会导致编译时 SSR 错误
  if (typeof window !== 'undefined') {
    const { origin } = window.location;
    url = `${origin}${url}`;
  }

  return {
    type: "tip",
    title: "声明",
    text: `<p>作者：${author.value}</p>
           <p>链接：<a href="${decodeURIComponent(url)}" target="_blank">${decodeURIComponent(url)}</a></p>
           <p style="margin-bottom: 0">本作品采用 <a href="https://creativecommons.org/licenses/by/4.0/deed.zh" target="_blank">知识共享署名 4.0 国际许可协议 (CC BY 4.0)</a> 进行许可。转载或使用请注明出处。</p>
           `,
  }
});

// 是否显示底部分享
const isShowBottomShare = computed(() => {
  // 是否启用分享功能（文档配置 > 全局配置 > 默认禁用）
  const enabled = frontmatter.value.articleShare ?? theme.value.articleShare.enabled ?? false;
  // 如果启用了分享功能，但是文章级别禁用了侧边栏显示（frontmatter.aside），则在文章末尾显示分享按钮
  return enabled && frontmatter.value.aside === false;
})
</script>

<style scoped lang="scss">

</style>
