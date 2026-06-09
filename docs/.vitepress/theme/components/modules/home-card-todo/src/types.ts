export type TodoData = TodoItem[];

interface TodoItem {
  /**
   * 待办事项
   */
  text: string;
  /**
   * 待办详细说明，仅 PC 端鼠标悬浮时显示
   */
  tooltip: string;
}