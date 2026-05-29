<template>
  <TkPageCard
    :page="true"
    v-model="pageNum"
    :page-size="tagConfig.limit"
    :total="tagConfig.total"
    :title="weather + '鸽观天象'"
    :autoPage="tagConfig.autoPage"
    :pageSpeed="tagConfig.pageSpeed"
  >
    <template #default="{ transitionName }">
      <div v-if="!isLoading && !isError">
        {{weatherData?.current.temperature_2m}}
      </div>
      <TransitionGroup
        v-if="!isLoading && !isError"
        :name="transitionName"
        tag="div"
        mode="out-in"
      >
        <div v-for="forecast in currentForecast" :key="forecast.time" class="weather-card">
          <div class="day-name">{{ formatDay(forecast.time) }}</div>
          <div class="date-name" >{{ formatDate(forecast.time) }}</div>
          <div class="weather-code"><i :class="'qi-' + weatherDescription(forecast.weatherCode)"></i></div>
          <div class="temp-range">{{ Math.round(forecast.tempMin) }}° ~ {{ Math.round(forecast.tempMax) }}°</div>
        </div>
      </TransitionGroup>

      <div v-else-if="isError">获取天气数据失败</div>

      <div v-else-if="isLoading">获取天气数据中...</div>
    </template>
  </TkPageCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { TkPageCard } from 'vitepress-theme-teek';
import { weather } from "@/icons";
import { WeatherForecastData } from "./types";

// 状态
const isLoading = ref(false)
const isError = ref(false)
// 卡片
const pageNum = ref(2);
const tagConfig = {
  limit: 1, // 每页显示几条数据
  total: 8, // 一共有几条数据
  autoPage: true, // 自动翻页
  pageSpeed: 8000, // 页面切换间隔
};

// 存储天气数据
const weatherData = ref<WeatherForecastData>();

const currentForecast = computed<{time: string, weatherCode: number, tempMax: number, tempMin: number}[]>(() => {
  return [{
    time: weatherData.value?.daily.time[pageNum.value - 1] || '',
    weatherCode: weatherData.value?.daily.weather_code[pageNum.value - 1] ?? 0,
    tempMax: weatherData.value?.daily.temperature_2m_max[pageNum.value - 1] ?? 0,
    tempMin: weatherData.value?.daily.temperature_2m_min[pageNum.value - 1] ?? 0,
  }];
});

// 缓存策略与方案一完全相同
const STORAGE_KEY = 'my-blog-weather-openmeteo';

// 简单的天气代码转文字，你可以自行扩充
const weatherDescription = (code: number): string => {
  const map: Record<number, string> = {
    0: '100', 1: '101', 2: '101', 3: '101', // 晴 大致晴朗 局部多云 阴天
    45: '501', 48: '501', // 雾 凝结的雾
    51: '309', 53: '309', 55: '309', // 小毛毛雨 中毛毛雨 密集毛毛雨
    56: '9999', 57: '9999', // 轻毛毛冻雨 重毛毛冻雨
    61: '305', 63: '306', 65: '307', // 小雨 中雨 大雨
    66: '313', 67: '313', // 轻冻雨 重冻雨
    71: '400', 73: '401', 75: '402', // 小雪 中雪 大雪
    77: '499', // 雪粒
    80: '300', 81: '300', 82: '301', // 阵雨：轻微 中等 剧烈
    85: '407', 86: '407', // 阵雪：轻微 中度
    95: '9999', // 雷雨（仅欧洲中部）
    96: '9999', 99: '9999', // 雷雨伴有轻度冰雹 雷雨伴有重度冰雹（仅欧洲中部）
  };
  return map[code] || '9999'; // 更多代码映射可查 Open-Meteo 文档
};

// 格式化日期为周几
const formatDay = (dateStr: string): string => {
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

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.getMonth() + '/' + date.getDate()
}

const fetchWeather = async () => {
  isLoading.value = true;
  isError.value = false;

  // 检查缓存
  const cached = localStorage.getItem(STORAGE_KEY); // 获取缓存
  if (cached) { // 如果缓存存在
    // 获取保存的数据和保存时的时间戳
    const { data, timestamp } = JSON.parse(cached);
    // 如果缓存在 1 小时内，则直接使用缓存数据
    if (Date.now() - timestamp < 60 * 60 * 1000) {
      weatherData.value = data;
      isLoading.value = false;
      return;
    }
  }

  // 缓存不存在或已过期，请求数据
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=34.2583&longitude=108.9286&daily=weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m&timezone=Asia%2FShanghai&past_days=1`;
    const response = await fetch(url);
    const result: WeatherForecastData = await response.json();

    // 更新状态并存入缓存
    weatherData.value = result;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));
  } catch (err) {
    // In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned with an HTTP 400 status code.
    console.error(err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchWeather);
</script>

<style scoped lang="scss">
.weather-card {
  display: flex;
  flex-direction: column;
  // text-align: center;
  gap: 0.5rem;
  padding: 1rem;
  font-size: 0.9rem;
}

.day-name {
  font-weight: bold;
}

.date-name {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.weather-code {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.temp-range {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
</style>