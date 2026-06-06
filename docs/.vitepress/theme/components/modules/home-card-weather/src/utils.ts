// 格式化日期：昨天，今天，明天，周几
export const formatDay = (dateStr: string): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const today = new Date();
  const date = new Date(dateStr);
  if (today.getDay() !== date.getDay() && today.getTime() > date.getTime())
    return '昨天';
  if (today.getDay() === date.getDay())
    return '今天';
  if (today.getDay() === (date.getDay() + 6) % 7)
    return '明天';
  return weekdays[date.getDay()];
};

// 格式化日期：月/日
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.getMonth() + '/' + date.getDate()
}

// 风速转风级
export const windSpeedToLevel = (speedKmh: number): number => {
  const ranges = [0, 1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  let level = 0;
  for (let i = 0; i < ranges.length; i++) {
    if (speedKmh >= ranges[i]) level = i;
    else break;
  }
  return level;
};

// 风向角度转风向文本
export const windDirectionToText = (degrees: number): string => {
  const deg = ((degrees % 360) + 360) % 360; // 归一化到 [0, 360)
  if (deg < 22.5 || deg >= 337.5) return '北';
  if (deg < 67.5) return '东北';
  if (deg < 112.5) return '东';
  if (deg < 157.5) return '东南';
  if (deg < 202.5) return '南';
  if (deg < 247.5) return '西南';
  if (deg < 292.5) return '西';
  return '西北';
};