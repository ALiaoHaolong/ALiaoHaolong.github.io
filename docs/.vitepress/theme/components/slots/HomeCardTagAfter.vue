<template>
  <TkPageCard :title="quill + '羽落成章'">
    <LhlContributeHeatmapChart
      :height="165"
      :calender-top="0"
      :calender-left="26"
      calender-month-label-position="end"
      dark-bg-color="#202127"
      :calendar-range="calendarRange"
    />
  </TkPageCard>
</template>

<script setup lang="ts">
import { TkPageCard, formatDate } from "vitepress-theme-teek";
import { LhlContributeHeatmapChart } from "@/components/modules";
import { quill } from "@/icons";

const calendarRange = (screenWidth: number): string[] => {
  // 动态日期计算的屏幕宽度阈值
  const oneDay = 24 * 60 * 60 * 1000;
  const screenWidthThreshold = 768;
  // 获取当前时间
  const date = new Date();
  // 计算今天
  const today = formatDate(date, 'yyyy-MM-dd', false);
  // 根据屏幕宽度动态计算起始日期
  if (screenWidth >= screenWidthThreshold) // 屏幕宽度大于等于阈值时，组件宽度固定，使用静态值
    date.setTime(date.getTime() - (8 * 7 + date.getDay()) * oneDay); // 基础 6 列 + 当前星期数动态一列
  if (screenWidth < screenWidthThreshold) // 屏幕宽度小于阈值时，组件宽度随屏幕宽度变化，屏幕每宽一个 cell 的宽度，就增加一列
    date.setTime(date.getTime() - (Math.ceil(screenWidth / 20) - 8) * 7 * oneDay); // 基础 36 列 + 当前星期数动态一列
  // 返回日期范围
  return [formatDate(date, 'yyyy-MM-dd', false), today];
};
</script>

<style scoped lang="scss">

</style>