<template>
  <LhlContributeHeatmapChart
    :height="260"
    :calender-left="'center'"
    :calendar-range="calendarRange"
  />
</template>

<script setup lang="ts">
import { formatDate } from "vitepress-theme-teek";
import { LhlContributeHeatmapChart } from "@/components/theme";

const calendarRange = (screenWidth: number): string[] => {
  // 动态日期计算的屏幕宽度阈值
  const oneDay = 24 * 60 * 60 * 1000;
  const screenWidthThresholdMin = 345;
  const screenWidthThresholdMax = 1280;
  // 获取当前时间
  const date = new Date();
  // 计算今天
  const today = formatDate(date, 'yyyy-MM-dd');
  // 根据屏幕宽度动态计算起始日期
  if (screenWidth < screenWidthThresholdMax) { // 屏幕宽度小于最大阈值时，文章页宽度等于屏幕宽度
    date.setTime(date.getTime() - (6 * 7 + date.getDay()) * oneDay); // 基础 6 列 + 当前星期数动态一列
    if (screenWidth > screenWidthThresholdMin) // 大于起始计算阈值后，屏幕每宽一个 cell 的宽度，就增加一列
      date.setTime(date.getTime() - Math.ceil((screenWidth - screenWidthThresholdMin) / 20) * 7 * oneDay);
  }
  if (screenWidth >= screenWidthThresholdMax) // 屏幕宽度大于最大阈值时，文章页宽度固定，使用静态值
    date.setTime(date.getTime() - (36 * 7 + date.getDay()) * oneDay); // 基础 36 列 + 当前星期数动态一列
  // 返回日期范围
  return [formatDate(date, 'yyyy-MM-dd'), today];
};
</script>

<style scoped lang="scss">

</style>