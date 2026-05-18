<template>
  <div class="flx-center" style="display: flex;">
    <a title="背景图" :href="link" target="_blank" class="flx-center hover-color" aria-label="和平鸽" style="margin-left: auto;">
      <TkIcon :icon="image" style="opacity: .4;" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { TkIcon } from "vitepress-theme-teek";
import { image } from "../icons";

const link = "https://github.com/ALiaoHaolong/ALiaoHaolong.github.io/blob/master/docs/public/homepage/LiaoHaolong_20150912_raw.jpg";
</script>

<style scoped lang="scss">

</style>