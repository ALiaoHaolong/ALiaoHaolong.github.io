export interface WeatherData {
  /**
   * 经度
   */
  latitude: number;
  /**
   * 纬度
   */
  longitude: number;
  /**
   * 获取天气数据所花费的时间，单位：毫秒
   */
  generationtime_ms: number;
  /**
   * 时区偏移秒数
   */
  utc_offset_seconds: number;
  /**
   * 时区
   */
  timezone: string;
  /**
   * 时区简称
   */
  timezone_abbreviation: string;
  /**
   * 海拔
   */
  elevation: number;
  /**
   * 当前天气数据单位
   */
  current_units: {
    /**
     * 时间标准
     */
    time: string;
    /**
     * 数据统计范围单位
     */
    interval: string;
    /**
     * 温度单位
     */
    temperature_2m: string;
  };
  /**
   * 当前天气数据
   */
  current: {
    /**
     * 当前时间
     */
    time: string;
    /**
     * 数据统计范围，表示计算总和或平均值的秒数。例如，900 秒（即 15 分钟）的范围意味着诸如降水量等汇总指标反映的是过去 15 分钟内的总和。
     */
    interval: number;
    /**
     * 当前温度
     */
    temperature_2m: number;
  };
  /**
   * 每日天气预报数据单位
   */
  daily_units: {
    /**
     * 时间标准
     */
    time: string;
    /**
     * 天气代码标准
     */
    weather_code: string;
    /**
     * 最高温度单位
     */
    temperature_2m_max: string;
    /**
     * 最低温度单位
     */
    temperature_2m_min: string;
  };
  /**
   * 每日天气预报数据
   */
  daily: {
    /**
     * 日期列表（有序）
     */
    time: string[];
    /**
     * 天气代码列表（有序）
     */
    weather_code: number[];
    /**
     * 最高温度列表（有序）
     */
    temperature_2m_max: number[];
    /**
     * 最低温度列表（有序）
     */
    temperature_2m_min: number[];
  };
}