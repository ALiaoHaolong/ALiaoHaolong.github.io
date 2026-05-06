<template>
  <!-- 首页横幅背景图作者 -->
  <div v-if="bannerBgImg" :class="{ visible: isVisible }" class="tk-banner-bg-img-author flx-center">
    <TkIcon :icon="image" style="margin-right: 3px;opacity: .85;" />
    <a title="背景图" :href="`https://www.pixiv.net/artworks/${bannerBgImg.coverImgPixivId}`" target="_blank" class="hover-color" :aria-label="bannerBgImg.coverImgAuthor">
      {{ bannerBgImg.coverImgAuthor }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { TkIcon } from "vitepress-theme-teek";
import { onMounted, onUnmounted, ref } from "vue";
import { image } from "../icons";

// 当前首页横幅背景图信息
const bannerBgImg = ref<{ coverImgAuthor: string; coverImgPixivId: string } | null>(null);
// 首页横幅背景图监听器
let observer: MutationObserver | null = null;
// 控制显示/隐藏
const isVisible = ref(false);

const parseBgImage = () => {
  const element = document.querySelector(".tk-banner-bg-image");
  if (!element) return;

  const backgroundImage = getComputedStyle(element).getPropertyValue("--tk-banner-img-bg").trim(); // url(/homepage/mmAir_140824539.png) center center / cover no-repeat
  const match = backgroundImage.match(/url\(["']?([^"')]+)["']?\)/); // 组0：url(/homepage/mmAir_140824539.png)，组1：/homepage/mmAir_140824539.png
  if (!match) return;

  const fullUrl = match[1]; // http://localhost:5173/homepage/mmAir_140824539.png
  const fileName = fullUrl.split("/").pop() || ""; // mmAir_140824539.png
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, ""); // mmAir_140824539
  const parts = nameWithoutExt.split("_");

  if (parts.length !== 2) { // 必须符合格式，否则不显示
    bannerBgImg.value = null;
    return;
  }

  const [author, pixivId] = parts; // 解析值
  // 淡出
  isVisible.value = false;
  // 等淡出完成（150ms），再更新内容，淡入
  setTimeout(() => {
    bannerBgImg.value = {
      coverImgAuthor: author,
      coverImgPixivId: pixivId,
    };
    isVisible.value = true;
  }, 500);
};

onMounted(() => {
  const element = document.querySelector(".tk-banner-bg-image");
  if (!element) return;

  // 先执行一次（避免首次空白）
  parseBgImage();

  // 创建监听器，设置回调函数
  observer = new MutationObserver(() => parseBgImage());
  // 设置监听对象
  observer.observe(
    element, // 被监听的元素
    { // 监听选项
      attributes: true,
      attributeFilter: ["style"], // 只监听 style 变化，性能更好
    }
  );
});

onUnmounted(() => {
  observer?.disconnect(); // 清理监听
});
</script>

<style scoped lang="scss">
.tk-banner-bg-img-author {
  position: absolute;
  bottom: 0;
  padding-bottom: 15vh;
  color: rgba(255,255,255,0.4);

  opacity: 0.25; // 切换时的最小透明度
  transition: opacity 0.5s ease-in-out;
  &.visible {
    opacity: 1; // 正常显示时的透明度
  }

  // 窄屏：居中
  left: 50%;
  transform: translateX(-50%);

  // 宽屏：右侧
  @media (min-width: 1024px) {
    left: auto;
    right: 15vh;
    transform: none;
  }
}
</style>
