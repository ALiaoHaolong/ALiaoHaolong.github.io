<template>
  <div :style="{ width: '100%', height: props.height + 'px' }">
    <div :style="{ margin: 'auto', width: '100%', height: '100%' }" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, useTemplateRef, onMounted, onUnmounted } from "vue";
import { useData } from "vitepress";
import { usePosts, useIntersectionObserver, formatDate } from "vitepress-theme-teek";
import * as echarts from "echarts/core"; // 引入 ECharts
import { CanvasRenderer } from 'echarts/renderers'; // 引入 Canvas 渲染器
import { HeatmapChart } from "echarts/charts"; // 热力图
import { TooltipComponent, CalendarComponent, VisualMapComponent } from 'echarts/components'; // 组件
import type { ContributeHeatmapChartOptions, CommitRecordData, CommitRecordItem } from "./types";

// 缓存
const COMMIT_RECORD_DATA_STORAGE_KEY = 'lhl:commitRecord' as const;

// 注册 ECharts 组件
echarts.use([
  CanvasRenderer,
  HeatmapChart,
  TooltipComponent,
  CalendarComponent,
  VisualMapComponent,
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
// 转换后的文章统计数据 { "2026-05-01": 2, "2026-05-02": 1, "2026-05-03": 5 }
const transformedPosts: any = {};
// 获取仓库 commit 数据
const commitRecordData = ref<CommitRecordData>({
  timestamp: 0,
  data: [],
});
// 转换后的 commit 统计数据 { "2026-05-01": 2, "2026-05-02": 1, "2026-05-03": 5 }
const transformedCommitRecord: any = {};

// 使用 UTC 日期比较，避免时区问题
const isToday = (timestamp: number) => {
  const a = new Date();
  const b = new Date(timestamp);
  return b.getUTCFullYear() === a.getUTCFullYear() && b.getUTCMonth() === a.getUTCMonth() && b.getUTCDate() === a.getUTCDate();
};

const isFetching = ref(false); // 请求锁
const fetchCommitRecord = async () => {
  // 过滤重复请求
  if (isFetching.value === true) return;
  // 加锁
  isFetching.value = true;

  // 检查缓存
  const cached = localStorage.getItem(COMMIT_RECORD_DATA_STORAGE_KEY); // 获取缓存
  if (cached) { // 如果缓存存在
    // 获取保存的数据
    const data: CommitRecordData = JSON.parse(cached);
    // 如果上次请求时间是今天
    if (isToday(data.timestamp)) {
      // 使用缓存数据
      commitRecordData.value = data;
      // 释放锁
      isFetching.value = false;
      return;
    }
  }

  // 缓存不存在或已过期，请求数据
  try {
    const url = `https://api.github.com/repos/ALiaoHaolong/ALiaoHaolong.github.io/stats/commit_activity`;
    const response = await fetch(url);
    const result: CommitRecordItem[] = await response.json();

    // 更新数据并存入缓存
    commitRecordData.value = { timestamp: Date.now(), data: result };
    localStorage.setItem(COMMIT_RECORD_DATA_STORAGE_KEY, JSON.stringify(commitRecordData.value));
  } catch (err) {
    console.error(err);
  } finally {
    // 释放锁
    isFetching.value = false;
  }
};

// 贡献图数据
const contributeList = computed(() => {
  // 文档计数
  posts.value.sortPostsByDate.forEach(item => { // sortPostsByDate 根据日期排序的文章列表
    // 获取文章 date 属性 yyyy-MM-dd HH:mm:ss
    if (!item.date) return;
    // 获取日期 yyyy-MM-dd
    const date = item.date.substring(0, 10);
    // 计数
    if (transformedPosts[date]) // 获取 transformedPosts.${date} 的值（语法错误，如此理解即可）
      transformedPosts[date]++; // 如果存在，计数值 ++
    else
      transformedPosts[date] = 1; // 如果不存在，赋初值 1
  });
  // 提交计数
  commitRecordData.value.data.forEach(item => { // commitRecordData.value.data 提交记录数据
    // 本周无提交 跳过
    if (item.total == 0) return;
    // 遍历 item.days
    for (let i = 0; i < item.days.length; i++) { // 遍历 item.days
      // 本日无提交 跳过
      if (item.days[i] == 0) continue;
      // 获取日期
      const date = formatDate(item.week * 1000 + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
      // 计数
      if (!transformedCommitRecord[date]) // 获取 transformedCommitRecord.${date} 的值（语法错误，如此理解即可）
        transformedCommitRecord[date] = 0; // 如果不存在，赋初值 0
      transformedCommitRecord[date] += item.days[i]; // 计数值叠加
    }
  });
  // 合并数据
  const mergedData: any = {};
  Object.keys(transformedPosts).forEach(date => {
    mergedData[date] = transformedPosts[date];
  });
  Object.keys(transformedCommitRecord).forEach(date => {
    if (mergedData[date]) {
      mergedData[date] += transformedCommitRecord[date];
    } else {
      mergedData[date] = transformedCommitRecord[date];
    }
  });
  // 转换格式
  return Object.keys(mergedData) // [ "2026-05-01", "2026-05-02", "2026-05-03" ]
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // 排序
    .map((item: string) => [item, mergedData[item]]); // [[ "2026-05-01", 2 ], [ "2026-05-02", 1 ], [ "2026-05-03", 5 ]]
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
      return `${params.value[0]}` +
      (transformedPosts[params.value[0]] ? ` <br/>📝 ${transformedPosts[params.value[0]]} 篇文章` : '') +
      (transformedCommitRecord[params.value[0]] ? ` <br/>💻 ${transformedCommitRecord[params.value[0]]} 次提交` : '');
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
    max: 10,
    inRange: {
      color: ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127", "#196127"]
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
  option.tooltip.backgroundColor = isDark.value ? props.darkBgColor : "#fff;"; // 同 borderColor
  option.tooltip.textStyle.color = isDark.value ? "#dfdfd6" : "#3c3c43"; // --vp-c-text-1
  option.calendar.itemStyle.borderColor = isDark.value ? props.darkBgColor : "#fff"; // 保留 Teek 设置
  option.calendar.itemStyle.color = isDark.value ? "#303035" : "#ebedf0"; // 原 Teek 的暗色模式过亮，调暗
  option.calendar.dayLabel.color = isDark.value ? "#98989f" : "#67676c"; // --vp-c-text-2
  option.calendar.monthLabel.color = isDark.value ? "#98989f" : "#67676c"; // --vp-c-text-2
  option.calendar.yearLabel.color = isDark.value ? "#98989f" : "#67676c"; // --vp-c-text-2
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
  // 请求 Commit 数据
  fetchCommitRecord();
});

onUnmounted(() => {
  // 销毁监听
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">

</style>