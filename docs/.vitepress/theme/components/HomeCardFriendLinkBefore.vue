<template>
  <TkPageCard :title="todo + '画大饼'">
    <div>
      <a class="hover-color" v-for="( item, index ) in todoList" :key="index">
        <span :title="item.tooltip">{{ item.text }}</span>
        <span style="display: inline-block;min-width: 14px;text-align: center;">{{ index + 1 }}</span>
      </a>
    </div>
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard } from "vitepress-theme-teek";
import { todo } from "../icons";

const todoList = [
  {
    text: "天气卡片",
    tooltip: "可翻页，每页一天天气，支持 7 天预报",
  },
  {
    text: "组件工程化",
    tooltip: "解耦插槽组件与功能组件；组件结构调整",
  },
  {
    text: "图片目录的结构调整",
    tooltip: "将文章名作为图片目录名",
  },
  {
    text: "侧边栏成组/文件夹嵌套",
    tooltip: "文档风文章页增加子文件夹，并在侧边栏为每个子文件夹组显示一个加粗标题",
  },
  {
    text: "博客更新检测",
    tooltip: "若博客缓存不是最新，提示用户刷新",
  },
]
</script>

<style scoped lang="scss">
a {
  display: flex;
  justify-content: space-between;
  border-left: 2px solid transparent;
  padding: 2px 5px;
  margin-top: -1px;
  font-size: 14px;
}
a:hover {
  background-color: var(--tk-fill-color-light);
  border-color: var(--tk-theme-color);
}
</style>