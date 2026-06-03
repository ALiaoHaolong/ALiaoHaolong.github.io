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

export const getWeatherInfo = (code: number) => {
  return weatherCodeMap[code] || { id: "unknown", text: "未知" };
};