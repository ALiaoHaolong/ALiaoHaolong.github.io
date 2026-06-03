<template>
  <TkPageCard
    :page="true"
    v-model="pageNum"
    :page-size="tagConfig.limit"
    :total="tagConfig.total"
    :title="weather + '鸽观天象'"
    :autoPage="tagConfig.autoPage"
    :pageSpeed="tagConfig.pageSpeed"
    style="position: relative;overflow: hidden;"
  >
    <!-- 修复预报卡片自动切换动画超出卡片范围显示 -->
    <template #default="{ transitionName }">
      <!-- 主天气 -->
      <div v-if="!isLoading && !isError" style="display: flex;justify-content: space-between;margin: 10px 0;padding: 0 5px;">
        <div>
          <div>西安市</div>
          <div style="display: flex;align-items: end;">
            <div style="padding: 0;font-size: 3rem;line-height: normal;">{{ weatherData.current.temperature_2m }}°</div>
            <div>{{ getWeatherInfo(weatherData.current.weather_code).text }}</div>
          </div>
        </div>
        <div style="font-size: 4.5rem;line-height: normal;">
          <i :class="'qi-' + getWeatherInfo(weatherData.current.weather_code).id"></i>
        </div>
      </div>
      <!-- 最高温/最低温/风向风力 -->
      <div style="display: flex;justify-content: space-between;margin: 10px 0;padding: 0 5px;">
        <div ref="maxTemperatureEl" :style="{ minWidth: maxWidth + 'px' }" style="display: flex;flex-direction: column;align-items: center;">
          <div style="font-size: 0.85rem;color: var(--vp-c-text-2);">最高温</div>
          <div>{{ weatherData.daily.temperature_2m_max[1] }}°</div>
        </div>
        <div ref="minTemperatureEl" :style="{ minWidth: maxWidth + 'px' }" style="display: flex;flex-direction: column;align-items: center;">
          <div style="font-size: 0.85rem;color: var(--vp-c-text-2);">最低温</div>
          <div>{{ weatherData.daily.temperature_2m_min[1] }}°</div>
        </div>
        <div ref="windDirectionEl" :style="{ minWidth: maxWidth + 'px' }" style="display: flex;flex-direction: column;align-items: center;">
          <div style="font-size: 0.85rem;color: var(--vp-c-text-2);">{{ windDirectionToText(weatherData.current.wind_direction_10m) }}风</div>
          <div>{{ windSpeedToLevel(weatherData.current.wind_speed_10m) }} 级</div>
        </div>
      </div>
      <!-- 分隔线 -->
      <div style="margin: 10px calc(var(--tk-home-card-padding) * -1);height: 1px;background-color: var(--vp-c-divider);"></div>
      <!-- 预报 -->
      <TransitionGroup v-if="!isLoading && !isError" :name="transitionName" tag="div" mode="out-in">
        <div v-for="forecast in currentForecast" :key="forecast.time">
          <!-- 日期行 -->
          <div style="display: flex;justify-content: space-between;margin: 10px 0;padding: 0 5px;">
            <div style="">{{ formatDay(forecast.time) }}</div>
            <div style="">{{ formatDate(forecast.time) }}</div>
          </div>
          <!-- 预报内容 -->
          <div style="display: flex;justify-content: space-between;align-items: flex-end;margin: 10px 0 5px;padding: 0 5px;">
            <div style="font-size: 4.5rem;opacity: .5;">
              <i :class="'qi-' + getWeatherInfo(forecast.weatherCode).id"></i>
            </div>
            <div style="display: flex;flex-direction: column;align-items: end;">
              <div>{{ getWeatherInfo(forecast.weatherCode).text }}</div>
              <div style="">{{ windDirectionToText(forecast.windDirection) }}风 {{ windSpeedToLevel(forecast.windSpeed) }} 级</div>
              <div style="">{{ Math.round(forecast.tempMin) }}° ~ {{ Math.round(forecast.tempMax) }}°</div>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <div v-else-if="isError">获取天气数据失败</div>

      <div v-else-if="isLoading">获取天气数据中...</div>
    </template>
  </TkPageCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { TkPageCard } from 'vitepress-theme-teek';
import { weather } from "@/icons";
import { WeatherData } from "./types";
import { getWeatherInfo } from "@/config";

// 缓存
const WEATHER_DATA_STORAGE_KEY = 'weather-data' as const;

// 样式
const maxTemperatureEl = ref<HTMLElement | null>(null);
const minTemperatureEl = ref<HTMLElement | null>(null);
const windDirectionEl = ref<HTMLElement | null>(null);
const maxWidth = ref(0);
const calculateMaxWidth = () => {
  const widths = [
    maxTemperatureEl.value?.offsetWidth || 0,
    minTemperatureEl.value?.offsetWidth || 0,
    windDirectionEl.value?.offsetWidth || 0,
  ];
  maxWidth.value = Math.max(...widths);
};

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

// 存储全部天气数据
const weatherData = ref<WeatherData>({
  latitude: 0,
  longitude: 0,
  generationtime_ms: 0,
  utc_offset_seconds: 0,
  timezone: '',
  timezone_abbreviation: "",
  elevation: 0,
  current_units: {
    time: '',
    interval: '',
    temperature_2m: '',
    weather_code: '',
    wind_speed_10m: '',
    wind_direction_10m: '',
  },
  current: {
    time: '',
    interval: 0,
    temperature_2m: 0,
    weather_code: 0,
    wind_speed_10m: 0,
    wind_direction_10m: 0,
  },
  daily_units: {
    time: '',
    weather_code: '',
    temperature_2m_max: '',
    temperature_2m_min: '',
    wind_speed_10m_max: '',
    wind_direction_10m_dominant: '',
  },
  daily: {
    time: [],
    weather_code: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    wind_speed_10m_max: [],
    wind_direction_10m_dominant: [],
  }
});
// 存储当前显示的日期的预报数据
const currentForecast = computed<{
  time: string,
  weatherCode: number,
  tempMax: number,
  tempMin: number,
  windSpeed: number,
  windDirection: number
}[]>(() => {
  return [{
    time: weatherData.value.daily.time[pageNum.value - 1] || '',
    weatherCode: weatherData.value.daily.weather_code[pageNum.value - 1] ?? 0,
    tempMax: weatherData.value.daily.temperature_2m_max[pageNum.value - 1] ?? 0,
    tempMin: weatherData.value.daily.temperature_2m_min[pageNum.value - 1] ?? 0,
    windSpeed: weatherData.value.daily.wind_speed_10m_max[pageNum.value - 1] ?? 0,
    windDirection: weatherData.value.daily.wind_direction_10m_dominant[pageNum.value - 1] ?? 0,
  }];
});

// 格式化日期：昨天，今天，明天，周几
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

// 格式化日期：月/日
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.getMonth() + '/' + date.getDate()
}

// 风速转风级
const windSpeedToLevel = (speedKmh: number): number => {
  const ranges = [0, 1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 118];
  let level = 0;
  for (let i = 0; i < ranges.length; i++) {
    if (speedKmh >= ranges[i]) level = i;
    else break;
  }
  return level;
};

// 风向角度转风向文本
const windDirectionToText = (degrees: number): string => {
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

// 获取天气数据
const fetchWeather = async () => {
  isLoading.value = true;
  isError.value = false;

  // 检查缓存
  const cached = localStorage.getItem(WEATHER_DATA_STORAGE_KEY); // 获取缓存
  if (cached) { // 如果缓存存在
    // 获取保存的数据
    const data: WeatherData = JSON.parse(cached);
    // 如果上次请求在 15 分钟内，则直接使用缓存数据
    if (Date.now() - new Date(data.current.time).getTime() < 15 * 60 * 1000) {
      weatherData.value = data;
      isLoading.value = false;
      return;
    }
  }

  // 缓存不存在或已过期，请求数据
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=34.2583&longitude=108.9286&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&timezone=Asia%2FShanghai&past_days=1`;
    const response = await fetch(url);
    const result: WeatherData = await response.json();

    // 更新数据并存入缓存
    weatherData.value = result;
    localStorage.setItem(WEATHER_DATA_STORAGE_KEY, JSON.stringify(result));
  } catch (err) {
    // In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned with an HTTP 400 status code.
    console.error(err);
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// 定时刷新天气数据
let refreshTimer: ReturnType<typeof setInterval>;

// 首次执行计划
const scheduleWeatherRefresh = () => {
  // 刷新数据
  fetchWeather();

  // 计算首次延迟
  const current = new Date();
  // 每小时的第 1 分钟、16 分钟、31 分钟、46 分钟执行
  const targetMinutes = [1, 16, 31, 46];
  // 计算下一次执行的分钟数
  let nextTarget = targetMinutes.find(m => m > current.getMinutes());
  if (nextTarget === undefined) {
    nextTarget = targetMinutes[0];
  }
  // 计算下一次执行的小时数
  const next = new Date(current);
  next.setMinutes(nextTarget, 0, 0);
  if (next <= current) next.setHours(next.getHours() + 1);

  // 设置首次延迟
  setTimeout(() => {
    // 下一次执行
    fetchWeather();
    // 启动定时器，此后间隔 15 分钟执行一次
    refreshTimer = setInterval(fetchWeather, 15 * 60 * 1000);
  }, next.getTime() - current.getTime());
};

watch(weatherData, () => nextTick(calculateMaxWidth));

onMounted(scheduleWeatherRefresh);

onUnmounted(() => {
  clearInterval(refreshTimer);
});

onMounted(fetchWeather);
</script>

<style scoped lang="scss">
// 天气预报旧卡片离开时，元素会先脱离文档流，再播放动画
// 而旧卡片本来被上一个相邻的 <div style="margin: 10px 0;"> 合并的 margin-top 将重新生效
// 导致旧卡片先向下平移 margin-top 高度，再离开
// 因此在旧卡片离开时，禁用首个元素的 margin-top 以修复问题
.tk-slide-prev-leave-active > div:first-child,
.tk-slide-next-leave-active > div:first-child {
  margin-top: 0 !important;
}

// 为避免出现其他可能的问题，同样禁用最后一个元素的 margin-bottom
.tk-slide-prev-leave-active > div:last-child,
.tk-slide-next-leave-active > div:last-child {
  margin-bottom: 0 !important;
}
</style>