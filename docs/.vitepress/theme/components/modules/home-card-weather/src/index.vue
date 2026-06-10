<template>
  <TkPageCard
    :page="true"
    v-model="pageNum"
    :page-size="tagConfig.limit"
    :total="tagConfig.total"
    :title="weather + '鸽观天象'"
    :title-click="fetchWeather"
    :autoPage="tagConfig.autoPage"
    :pageSpeed="tagConfig.pageSpeed"
  >
    <template #default="{ transitionName }">
      <div v-if="!isLoading && !isError">
        <!-- 主天气 -->
        <div style="display: flex;justify-content: space-between;margin: 10px 0;padding: 0 5px;">
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
        <TransitionGroup v-if="!isLoading && !isError" :name="transitionName" tag="div" mode="out-in" style="position: relative;">
          <div v-for="forecast in currentForecast" :key="forecast.time">
            <div style="display: flex;justify-content: space-between;margin-bottom: 10px;padding: 0 5px;">
              <div :id="`forecast-day-${forecast.time}`" :style="{ minWidth: forecastMaxWidth + 'px' }" style="text-align: left;">{{ formatDay(forecast.time) }}</div>
              <div style="margin-top: 10px;">
                <i :class="'qi-' + getWeatherInfo(forecast.weatherCode).id" style="font-size: 4rem;opacity: .5;"></i>
              </div>
              <div :id="`forecast-date-${forecast.time}`" :style="{ minWidth: forecastMaxWidth + 'px' }" style="text-align: right;">{{ formatDate(forecast.time) }}</div>
            </div>
            <div style="display: flex;justify-content: space-between;padding: 0 5px;">
              <div style="display: flex;">
                <div style="margin-right: 5px;">{{ getWeatherInfo(forecast.weatherCode).text }}</div>
                <div style="">{{ Math.round(forecast.tempMin) }}° ~ {{ Math.round(forecast.tempMax) }}°</div>
              </div>
              <div style="display: flex;">
                <div style="margin-right: 5px;">{{ windDirectionToText(forecast.windDirection) }}风</div>
                <div style="">{{ windSpeedToLevel(forecast.windSpeed) }} 级</div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div v-else-if="isError" style="padding: 0 5px;">天气更新失败，<a class="hover-color" @click="fetchWeather()">点此重试</a></div>

      <div ref="isLoadingEl" v-else-if="isLoading" style="padding: 0 5px;"></div>
    </template>
  </TkPageCard>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { TkPageCard } from 'vitepress-theme-teek';
import { getWeatherInfo } from "@/config";
import { weather } from "@/icons";
import { WeatherData } from "./types";
import { formatDay, formatDate, windDirectionToText, windSpeedToLevel } from "./utils";

// 缓存
const WEATHER_DATA_STORAGE_KEY = 'lhl:weather' as const;

// 动态宽度
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
const forecastMaxWidth = ref(0);
const calculateForecastMaxWidth = () => {
  const forecastDayEl = document.querySelector(`#forecast-day-${currentForecast.value[0]?.time}`) as HTMLElement;
  const forecastDateEl = document.querySelector(`#forecast-date-${currentForecast.value[0]?.time}`) as HTMLElement;
  // 重置最小宽度
  // 修复在新元素更窄时，受旧元素的较大的最小宽度值影响，导致新元素宽度无法变小
  if (forecastDayEl && forecastDateEl) {
    forecastDayEl.style.minWidth = '0px';
    forecastDateEl.style.minWidth = '0px';
  }
  // 延迟到下一 tick 重新计算
  nextTick(() => {
    const widths = [
      forecastDayEl.offsetWidth || 0,
      forecastDateEl.offsetWidth || 0,
    ];
    forecastMaxWidth.value = Math.max(...widths);
  })
};

// 状态
const isLoading = ref(true);
const isFetching = ref(false); // 请求锁
const isError = ref(false);
// 卡片
const pageNum = ref(2);
const tagConfig = {
  limit: 1, // 每页显示几条数据
  total: 8, // 一共有几条数据
  autoPage: true, // 自动翻页
  pageSpeed: 8000, // 页面切换间隔
};

// isLoadingEl 打字机效果
const isLoadingEl = ref<HTMLElement | null>(null);
// isLoadingEl 元素挂载时启动打字机效果
watch(isLoadingEl, () => {
  if (isLoadingEl.value) {
    const text = '观测中 . . .';
    let index = 0;
    const typing = () => {
      if (isLoadingEl.value && index < text.length) {
        isLoadingEl.value.textContent += text[index];
        index++;
        setTimeout(typing, index < 3 ? 400 : 200);
      }
    };
    typing();
  }
});

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

// 获取天气数据
const fetchWeather = async () => {
  // 过滤重复请求
  if (isFetching.value === true) return;
  // 加锁
  isFetching.value = true;

  // 重置相关状态
  isLoading.value = true;
  isError.value = false;
  pageNum.value = 2;

  // 延迟处理，打印机效果 + 降频
  setTimeout(async () => {
    // 检查缓存
    const cached = localStorage.getItem(WEATHER_DATA_STORAGE_KEY); // 获取缓存
    if (cached) { // 如果缓存存在
      // 获取保存的数据
      const data: WeatherData = JSON.parse(cached);
      // 如果上次请求在 15 分钟内，则直接使用缓存数据
      if (Date.now() - new Date(data.current.time).getTime() < 15 * 60 * 1000) {
        weatherData.value = data;
        // 返回
        isLoading.value = false;
        // 释放锁
        isFetching.value = false;
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
      // 返回
      isLoading.value = false;
    } catch (err) {
      // In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned with an HTTP 400 status code.
      console.error(err);
      // 返回
      isError.value = true;
    } finally {
      // 释放锁
      isFetching.value = false;
    }
  }, 3000);
};

// 定时刷新天气数据
let refreshTimer: ReturnType<typeof setInterval>;

// 首次执行计划
const initFetchWeather = () => {
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

watch(weatherData, () => {
  nextTick(calculateMaxWidth);
  nextTick(calculateForecastMaxWidth);
});

watch(pageNum, () => {
  nextTick(calculateForecastMaxWidth);
});

onMounted(initFetchWeather);

onUnmounted(() => {
  clearInterval(refreshTimer);
});
</script>

<style scoped lang="scss">
// 天气预报旧卡片离开时，旧元素会先脱离文档流，变为绝对定位，再播放动画
.tk-slide-prev-leave-active,
.tk-slide-next-leave-active {
  // 设置预报卡片的宽度为 relative 指定元素宽度的 100%，用于修复淡出时，宽度变为由内容宽度决定
  width: 100% !important;
}
</style>