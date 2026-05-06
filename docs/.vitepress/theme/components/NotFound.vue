<template>
  <div class="NotFound">
    <p class="code">404</p>
    <h1 class="title">咕咕～网页不见啦 🕊️</h1>
    <div class="divider"></div>
    <blockquote class="quote">咕？咕？(°◇° ) 这里没有撒下的面包屑🍞，也没有你要找的那页时光欸📖......让我先带你飞回去叭！</blockquote>
    <div class="action">
      <a class="link" href="/" aria-label="go to home">起飞回首页！咕！</a>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<!-- 样式来自 VitePress 原版 404 组件 -->
<style scoped lang="scss">
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;

  @media (min-width: 768px) {
    padding: 96px 32px 168px;
  }
}
.code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}
.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}
.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}
.quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.action {
  padding-top: 20px;
}
.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: border-color 0.25s,
  color 0.25s;
}
</style>