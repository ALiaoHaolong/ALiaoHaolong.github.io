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

// 天气代码映射
export const weatherCodeMap: Record<number, { id: string; text: string }> = {
  0:  { id: "sunny",             text: "晴" },
  1:  { id: "few-clouds",        text: "少云" },
  2:  { id: "partly-cloudy",     text: "多云" },
  3:  { id: "cloudy",            text: "阴" },
  45: { id: "mist",              text: "雾" },
  48: { id: "foggy",             text: "雾凇" },
  51: { id: "drizzle-rain",      text: "小毛毛雨" },
  53: { id: "heavy-storm",       text: "中毛毛雨" },
  55: { id: "severe-storm",      text: "大毛毛雨" },
  // 56: { id: "unknown",           text: "轻冻毛毛雨" },
  // 57: { id: "unknown",           text: "重冻毛毛雨" },
  61: { id: "light-rain",        text: "小雨" },
  63: { id: "moderate-rain",     text: "中雨" },
  65: { id: "heavy-rain",        text: "大雨" },
  66: { id: "freezing-rain",     text: "轻冻雨" },
  67: { id: "freezing-rain",     text: "重冻雨" },
  71: { id: "light-snow",        text: "小雪" },
  73: { id: "moderate-snow",     text: "中雪" },
  75: { id: "heavy-snow",        text: "大雪" },
  77: { id: "snow",              text: "雪粒" },
  80: { id: "shower-rain",       text: "阵雨" },
  81: { id: "shower-rain",       text: "中阵雨" },
  82: { id: "heavy-shower-rain", text: "大阵雨" },
  85: { id: "snow-flurry",       text: "阵雪" },
  86: { id: "snow-flurry",       text: "中阵雪" },
  // 95: { id: "unknown",           text: "雷雨" },       // 仅欧洲中部
  // 96: { id: "unknown",           text: "雷雨伴小冰雹" }, // 仅欧洲中部
  // 99: { id: "unknown",           text: "雷雨伴大冰雹" }, // 仅欧洲中部
};

// 天气代码转天气信息
export const getWeatherInfo = (code: number) => {
  return weatherCodeMap[code] || { id: "unknown", text: "未知" };
};