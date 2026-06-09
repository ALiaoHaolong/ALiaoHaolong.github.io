<template>
  <TkPageCard
    :page="true"
    v-model="pageNum"
    :page-size="tagConfig.limit"
    :total="tagConfig.total"
    :title="todo + '画大饼'"
    :autoPage="tagConfig.autoPage"
    :pageSpeed="tagConfig.pageSpeed"
  >
    <template #default="{ transitionName }">
      <TransitionGroup v-if="todoData.length > 0" :name="transitionName" tag="div" mode="out-in" class="flx-column" style="position: relative;">
        <a ref="itemRefs" v-for="( item, index ) in currentTodoList" :key="item.text" class="hover-color" :style="`top: ${index * itemRefs?.[index]?.getBoundingClientRect().height || 0}px`">
          <span :title="item.tooltip">{{ item.text }}</span>
          <span style="display: inline-block;min-width: 14px;text-align: center;">{{ todoData.indexOf(item) + 1 }}</span>
        </a>
      </TransitionGroup>

      <div v-else>大饼吃撑了 QAQ</div>
    </template>
  </TkPageCard>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TkPageCard } from "vitepress-theme-teek";
import { todo } from "@/icons";
import { TodoData } from "./types";
import { todoData } from "./data";

// 由于 TransitionGroup 中有多个元素，需要配合 TransitionGroup 的 style 和 a 的 ref :key :style 联合修正淡出动画异常
// 参考：https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/main/packages/components/theme/home-card-category/src/index.vue
const itemRefs = ref<HTMLLIElement[]>([]);

// 卡片
const pageNum = ref(1);
const tagConfig = {
  limit: 5, // 每页显示几条数据
  total: todoData.length, // 一共有几条数据
  autoPage: false, // 自动翻页
  pageSpeed: 8000, // 页面切换间隔
};

// 存储当前显示的待办列表
const currentTodoList = computed<TodoData>(() => {
  return todoData.slice(
    (pageNum.value - 1) * tagConfig.limit,
    Math.min(pageNum.value * tagConfig.limit, todoData.length)
  );
});
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