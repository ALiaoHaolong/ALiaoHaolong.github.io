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
import { todo } from "@/icons";

const todoList = [
  {
    text: "文章目录的嵌套结构应用",
    tooltip: "使用嵌套目录整理文件夹内容",
  },
  {
    text: "图片目录的结构调整",
    tooltip: "将文章名作为图片目录名",
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