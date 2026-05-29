<template>
  <div :style="{ width: '100%', height: props.height + 'px' }">
    <div :style="{ margin: 'auto', width: '100%', height: '100%' }" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, useTemplateRef, onMounted, onUnmounted } from "vue";
import { useData } from "vitepress";
import { usePosts, useIntersectionObserver } from "vitepress-theme-teek";
import * as echarts from "echarts/core"; // 引入 ECharts
import { CanvasRenderer } from 'echarts/renderers'; // 引入 Canvas 渲染器
import { HeatmapChart } from "echarts/charts"; // 热力图
import { TooltipComponent, CalendarComponent, VisualMapComponent } from 'echarts/components'; // 组件
import type { ContributeHeatmapChartOptions } from "./types";

// 注册 ECharts 组件
echarts.use([
  TooltipComponent,
  CalendarComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer,
]);

// 接收参数
const props = withDefaults(defineProps<ContributeHeatmapChartOptions>(), {
  // 使用官方默认值
  calenderTop: 60,
  calenderLeft: 80,
  calenderMonthLabelPosition: "start",
});

// 获取当前主题模式
const { isDark } = useData();
// 获取全部文章数据
const posts = usePosts();

// 贡献图数据
const contributeList = computed(() => {
  // 数据初始化 { "2026-05-01": 2, "2026-05-02": 1, "2026-05-03": 5 }
  const contributeObject: any = ref({});
  // 计数
  posts.value.sortPostsByDate.forEach(item => { // sortPostsByDate 根据日期排序的文章列表
    // 获取文章 date 属性
    if (!item.date) return;
    // 获取日期 yyyy-MM-dd
    const date = item.date.substring(0, 10);
    // 计数
    if (contributeObject.value[date]) // 获取 contributeObject.value.${date} 的值（语法错误，如此理解即可）
      contributeObject.value[date]++; // 如果存在，计数值 ++
    else
      contributeObject.value[date] = 1; // 如果不存在，赋初值 1
  });
  // 转换格式
  return Object.keys(contributeObject.value) // [ "2026-05-01", "2026-05-02", "2026-05-03" ]
    .map((item: string) => [item, contributeObject.value[item]]); // [[ "2026-05-01", 2 ], [ "2026-05-02", 1 ], [ "2026-05-03", 5 ]]
});

// 贡献图容器
const chartRef = useTemplateRef("chartRef");
// ECharts 实例
const contributeChart = ref();

// 懒加载
const { create } = useIntersectionObserver(
  chartRef, // 监听元素
  entries => { // 当元素进入/离开屏幕时触发
    entries.forEach(entry => {
      if (entry.isIntersecting) { // 元素进入屏幕
        // 使用 requestAnimationFrame 确保在下一帧执行，避免和浏览器渲染冲突
        requestAnimationFrame(() => {
          try {
            renderChart(contributeList.value); // 绘制
          } catch (error) {
            console.error("初始化动画失败:", error);
          }
        });
      }
    });
  },
  0.1 // 懒加载阈值，元素露出 10% 时触发
);

// 屏幕宽度
const screenWidth = ref();

// 根据屏幕宽度动态计算日期范围
const calendarRange = computed((): string[] => {
  return props.calendarRange(screenWidth.value);
});

// ECharts 配置项
const option = {
  tooltip: {
    formatter: function (params: any) {
      return `${params.value[0]} <br/> ${params.value[1]} 篇文章`;
    },
    backgroundColor: "#fff", // 同文档背景色
    padding: [6, 10],
    textStyle: {
      color: "#3c3c43", // --vp-c-text-1
    },
  },
  visualMap: {
    show: false,
    min: 0,
    max: 5,
    inRange: {
      color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127", "#196127"],
    },
  },
  calendar: {
    top: props.calenderTop,
    left: props.calenderLeft,
    itemStyle: {
      color: "#ebedf0", // 小方块背景色
      borderWidth: 5,
      borderColor: "#fff", // 小方块分割色（同文档背景色）
      shadowBlur: 0,
    },
    cellSize: [20, 20],
    range: calendarRange.value,
    splitLine: true,
    dayLabel: {
      firstDay: 7,
      nameMap: "ZH",
      color: "#67676c", // --vp-c-text-2
      silent: true, // 不响应鼠标事件
    },
    monthLabel: {
      position: props.calenderMonthLabelPosition,
      color: "#67676c", // --vp-c-text-2
      silent: true, // 不响应鼠标事件
    },
    yearLabel: {
      show: true,
      position: "right",
      color: "#929295", // --vp-c-text-3
      silent: true, // 不响应鼠标事件
    },
    silent: {
      show: false,
    },
  },
  series: {
    type: "heatmap",
    coordinateSystem: "calendar",
    data: [],
  },
};

// 渲染贡献图
const renderChart = (data: any) => {
  // 适配暗色模式
  option.tooltip.backgroundColor = isDark.value ? "#1b1b1f;" : "#fff;"; // 同 borderColor
  option.tooltip.textStyle.color = isDark.value ? "#dfdfd6" : "#3c3c43"; // --vp-c-text-1
  option.calendar.itemStyle.borderColor = isDark.value ? "#1b1b1f" : "#fff"; // 保留 Teek 设置
  option.calendar.itemStyle.color = isDark.value ? "#303035" : "#ebedf0"; // 原 Teek 的暗色模式过亮，调暗
  option.calendar.dayLabel.color = isDark.value ? "#98989f" : "#67676c"; // --vp-c-text-2
  option.calendar.monthLabel.color = isDark.value ? "#98989f" : "#67676c"; // --vp-c-text-2
  option.calendar.yearLabel.color = isDark.value ? "#6a6a71" : "#929295"; // --vp-c-text-3
  // 销毁实例
  if (contributeChart.value) echarts.dispose(contributeChart.value);
  // 初始化实例
  if (chartRef.value) contributeChart.value = echarts.init(chartRef.value);
  // 挂载数据
  option.series.data = data;
  option.calendar.range = calendarRange.value;
  // 渲染图表
  contributeChart.value?.setOption(option);
};

watch(contributeList, async newValue => {
    await nextTick();
    renderChart(newValue);
  }, { flush: "post" });

watch(isDark, async () => {
  await nextTick();
  renderChart(contributeList.value);
});

watch(screenWidth, async () => {
  await nextTick();
  renderChart(contributeList.value);
});

// 监听屏幕宽度回调
const handleResize = () => { screenWidth.value = window.innerWidth; };

onMounted(() => {
  if (chartRef.value) create();
  // 初始化屏幕宽度
  screenWidth.value = window.innerWidth;
  // 监听屏幕宽度
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 销毁监听
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">

</style>