<template>
  <!-- 控制组件是否展示 -->
  <div v-if="coverImgInfo" class="tk-article-cover-img-author">
    <!-- 一个项 -->
    <div style="color: var(--tk-article-banner-text-color);opacity: .85;" class="flx-center">
      <TkIcon :icon="image" style="margin-right: 3px;opacity: .85;" />
      <a title="背景图" :href="`https://www.pixiv.net/artworks/${coverImgInfo.coverImgPixivId}`" target="_blank" class="hover-color" :aria-label="coverImgInfo.coverImgAuthor">
        {{ coverImgInfo.coverImgAuthor }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TkIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { image } from "../icons";
import { computed } from "vue";

const { frontmatter } = useData();

// cover 图来源
const coverImgInfo = computed(() => {
  const coverImg = frontmatter.value.coverImg; // /articles/ぴっぴ_55647411.jpg
  const fileName = coverImg.split("/").pop(); // ぴっぴ_55647411.jpg
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, ""); // ぴっぴ_55647411
  const parts = nameWithoutExt.split("_");
  if (parts.length !== 2)
    return undefined;
  return {
    coverImgAuthor: parts[0],
    coverImgPixivId: parts[1],
  };
});
</script>

<style scoped lang="scss">
.tk-article-cover-img-author {
  margin-bottom: 24px;
}
</style>
