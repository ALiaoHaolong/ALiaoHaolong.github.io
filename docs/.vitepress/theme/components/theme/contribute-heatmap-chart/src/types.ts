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
   * 范围动态计算回调函数
   */
  calendarRange: (screenWidth: number) => string[],
}