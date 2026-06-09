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
import { HeatmapChart, CustomChart } from "echarts/charts"; // 热力图
import { TooltipComponent, CalendarComponent, VisualMapComponent } from 'echarts/components'; // 组件
import type { ContributeHeatmapChartOptions, CommitsData, CommitsItem } from "./types";
import { getCommitsColor, getPostsColor } from "./utils";

// 缓存
const COMMIT_RECORD_DATA_STORAGE_KEY = 'lhl:commitRecord' as const;

// 注册 ECharts 组件
echarts.use([
  CanvasRenderer,
  HeatmapChart,
  CustomChart,
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
// 获取仓库 commit 数据
const commits = ref<CommitsData>({
  timestamp: 0,
  data: [],
});

const fetchCommits = async () => {
  // 检查缓存
  const cached = localStorage.getItem(COMMIT_RECORD_DATA_STORAGE_KEY); // 获取缓存
  if (cached) { // 如果缓存存在
    // 获取保存的数据
    const data: CommitsData = JSON.parse(cached);
    // 缓存有效期：1 小时
    if (Date.now() - data.timestamp > 60 * 60 * 1000) {
      // 使用缓存数据
      commits.value = data;
      return;
    }
  }

  // 缓存不存在或已过期，请求数据
  try {
    const url = `https://api.github.com/repos/ALiaoHaolong/ALiaoHaolong.github.io/stats/commit_activity`;
    const response = await fetch(url);
    const result: CommitsItem[] = await response.json();

    // 更新数据并存入缓存
    commits.value = { timestamp: Date.now(), data: result };
    localStorage.setItem(COMMIT_RECORD_DATA_STORAGE_KEY, JSON.stringify(commits.value));
  } catch (err) {
    // 考虑到网络因素，允许忽略提交数据
    commits.value = { timestamp: 0, data: [] };
    console.error(err);
  }
};

// 贡献图数据
// 若使用默认的 series.type = "heatmap", series.coordinateSystem = "calendar"，默认数据格式为 [[ "2026-05-01", 2 ], [ "2026-05-02", 1 ], [ "2026-05-03", 5 ]]
// 本组件使用自定义渲染，数据格式为 [[date, postsCount, commitsCount, type], ...]
const contributeList = computed(() => {
  // 记录所有有数据的日期
  const dateList = new Set<string>();
  // 文档计数 { "2026-05-01": 2, "2026-05-02": 1, "2026-05-03": 5 }
  const postsByData: Record<string, number> = {};
  posts.value.sortPostsByDate.forEach(item => { // sortPostsByDate 根据日期排序的文章列表
    // 获取文章 date 属性 yyyy-MM-dd HH:mm:ss
    if (!item.date) return;
    // 获取日期 yyyy-MM-dd
    const date = item.date.substring(0, 10);
    dateList.add(date);
    // 计数
    if (postsByData[date]) // 获取 originalData.${date} 的值（语法错误，如此理解即可）
      postsByData[date]++; // 如果存在，计数值 ++
    else
      postsByData[date] = 1; // 如果不存在，赋初值 1
  });
  // 提交计数 { "2026-05-01": 2, "2026-05-02": 1, "2026-05-03": 5 }
  const commitsByData: Record<string, number> = {};
  commits.value.data.forEach(item => { // commitRecordData.value.data 提交记录数据
    // 本周无提交 跳过
    if (item.total == 0) return;
    // 遍历 item.days
    for (let i = 0; i < item.days.length; i++) { // 遍历 item.days
      // 本日无提交 跳过
      if (item.days[i] == 0) continue;
      // 获取日期
      const date = formatDate(item.week * 1000 + i * 24 * 60 * 60 * 1000, "yyyy-MM-dd");
      dateList.add(date);
      // 计数
      if (!commitsByData[date]) // 获取 originalData.${date} 的值（语法错误，如此理解即可）
        commitsByData[date] = 0; // 如果不存在，赋初值 0
      commitsByData[date] += item.days[i]; // 计数值叠加
    }
  });
  // 转换格式
  return Array.from(dateList) // [ "2026-05-01", "2026-05-02", "2026-05-03" ]
    .sort((a, b) => new Date(a as string).getTime() - new Date(b as string).getTime()) // 排序
    .map((date: string) => {
      const postsCount = postsByData[date];
      const commitsCount = commitsByData[date];
      let type;
      if (postsCount && commitsCount) type = "mixed";
      else if (postsCount) type = "posts";
      else if (commitsCount) type = "commits";
      else type = "none";
      return [ date, postsCount, commitsCount, type ];
    });
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
  series: [{
    type: 'custom',
    coordinateSystem: 'calendar',
    renderItem: function (params: any, api: any) {
      // 获取数据中的参数
      const date = api.value(0);
      const postsCount = api.value(1);
      const commitsCount = api.value(2);
      const type = api.value(3);

      // 获取方块中心点坐标
      const centerPoint = api.coord([date, 0]);

      // 若数据并未在当前展示的时间范围之内，此时获取不到坐标，直接跳过
      if (!centerPoint) return null;

      // 计算 cell 相关坐标及大小
      const borderWidth = 5;
      const left = centerPoint[0] - (params.coordSys.cellWidth - borderWidth) / 2; // 左 x 坐标
      const top = centerPoint[1] - (params.coordSys.cellHeight - borderWidth) / 2; // 上 y 坐标
      const right = centerPoint[0] + (params.coordSys.cellWidth - borderWidth) / 2; // 右 x 坐标
      const bottom = centerPoint[1] + (params.coordSys.cellHeight - borderWidth) / 2; // 下 y 坐标
      const cellWidth = params.coordSys.cellWidth - borderWidth;
      const cellHeight = params.coordSys.cellHeight - borderWidth;

      if (type === "posts") {
        return {
          type: 'rect',
          shape: { x: left, y: top, width: cellWidth, height: cellHeight, },
          style: { fill: getPostsColor(postsCount), },
        };
      }
      if (type === "commits") {
        return {
          type: 'rect',
          shape: { x: left, y: top, width: cellWidth, height: cellHeight, },
          style: { fill: getCommitsColor(commitsCount), },
        };
      }
      if (type === "mixed") {
        return {
          type: 'group',
          children: [
            // 左上三角（文章颜色）
            {
              type: 'polygon',
              shape: { points: [ [left, bottom], [left, top], [right, top], [left, bottom], ], },
              style: { fill: getPostsColor(postsCount), },
            },
            // 右下三角（提交颜色）
            {
              type: 'polygon',
              shape: { points: [ [right, top], [right, bottom], [left, bottom], [right, top], ], },
              style: { fill: getCommitsColor(commitsCount), },
            }
          ]
        };
      }
      // 异常状态，返回黑色块
      return {
        type: 'rect',
        shape: { x: left, y: top, width: cellWidth, height: cellHeight, },
        style: { fill: 'black', },
      };
    },
    data: [],
  }],
  tooltip: {
    formatter: function (params: any) {
      return `${params.value[0]}` +
      (params.value[1] ? ` <br/>📝 ${params.value[1]} 篇文章` : '') +
      (params.value[2] ? ` <br/>💻 ${params.value[2]} 次提交` : '');
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
  option.series[0].data = data;
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
  fetchCommits();
});

onUnmounted(() => {
  // 销毁监听
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped lang="scss">

</style>