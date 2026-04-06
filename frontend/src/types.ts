export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export interface AgentRequest {
  location: string;
  urgency: Urgency;
  budget: number;
  overridePrice?: number;
}

export interface FreeWeather {
  weather: 'sunny' | 'cloudy' | 'rainy';
}

export interface Decision {
  buy: boolean;
  reason: string;
}

export interface PremiumWeather {
  temperature: number;
  rain_probability: number;
  detail: string;
  advice: string;
}

export interface AgentResponse {
  freeWeather: FreeWeather;
  decision: Decision;
  premiumWeather: PremiumWeather | null;
  paid: boolean;
  logs: string[];
}

export type Status = 'idle' | 'thinking' | 'paying' | 'done' | 'error';
