export interface ContributeHeatmapChartOptions {
  /**
   * 组件高度
   */
  height: number,
  /**
   * ECharts 配置 - calender.top
   */
  calenderTop?: string | number,
  /**
   * ECharts 配置 - calender.left
   */
  calenderLeft?: string | number,
  /**
   * ECharts 配置 - calender.monthLabel.position
   */
  calenderMonthLabelPosition?: string,
  /**
   * 暗色模式下的边框颜色
   */
  darkBgColor: string,
  /**
   * 范围动态计算回调函数
   */
  calendarRange: (screenWidth: number) => string[],
}

export interface CommitsData {
  /**
   * 请求时间戳
   */
  timestamp: number;
  /**
   * 提交数据
   */
  data: CommitsItem[];
}

export interface CommitsItem {
  /**
   * 每天的提交数量，从周日到周六：[周日, 周一, 周二, 周三, 周四, 周五, 周六]
   */
  days: number[];
  /**
   * 该周的总提交数
   */
  total: number;
  /**
   * 该周的起始时间戳（周日 00:00:00 UTC）
   */
  week: number;
}