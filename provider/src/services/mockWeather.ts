export type WeatherCondition = 'clear' | 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'tornado';

const conditions: WeatherCondition[] = ['clear', 'sunny', 'cloudy', 'rainy', 'stormy', 'tornado'];

function getCondition(location: string): WeatherCondition {
  const index = (location.length * location.charCodeAt(0)) % conditions.length;
  return conditions[index];
}

const weatherData: Record<WeatherCondition, { temperature: number; rain_probability: number; labelJa: string; advice: string }> = {
  clear:   { temperature: 30, rain_probability: 0,  labelJa: '快晴', advice: 'UV指数：高。日焼け対策を。' },
  sunny:   { temperature: 25, rain_probability: 5,  labelJa: '晴れ', advice: '洗濯・外出に最適です。' },
  cloudy:  { temperature: 18, rain_probability: 35, labelJa: '曇り', advice: '午後から雨の可能性あり、傘を携帯推奨。' },
  rainy:   { temperature: 13, rain_probability: 85, labelJa: '雨',   advice: '強雨の時間帯：14〜17時。' },
  stormy:  { temperature: 10, rain_probability: 95, labelJa: '嵐',   advice: '警報発令中。外出を控えてください。' },
  tornado: { temperature: 8,  rain_probability: 98, labelJa: '竜巻', advice: '緊急警報。直ちに避難してください。' },
};

export function getFreeWeather(location: string): { weather: WeatherCondition } {
  return { weather: getCondition(location) };
}

export function getPremiumWeather(location: string): {
  temperature: number;
  rain_probability: number;
  detail: string;
  advice: string;
} {
  const weather = getCondition(location);
  const { temperature, rain_probability, labelJa, advice } = weatherData[weather];

  return {
    temperature,
    rain_probability,
    detail: `${location}の24時間予報：${labelJa}の天気が続く見込みです。北西の風 12km/h、湿度 60%。`,
    advice,
  };
}
