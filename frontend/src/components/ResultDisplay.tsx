import { AgentResponse } from '../types';

interface Props {
  result: AgentResponse;
}

const card: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: 10,
  padding: '1.5rem',
  marginTop: '1.5rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '0.5rem',
};

const weatherIcon: Record<string, string> = {
  clear:   '🌞',
  sunny:   '☀️',
  cloudy:  '☁️',
  rainy:   '🌧️',
  stormy:  '⛈️',
  tornado: '🌪️',
};

const weatherJa: Record<string, string> = {
  clear:   '快晴',
  sunny:   '晴れ',
  cloudy:  '曇り',
  rainy:   '雨',
  stormy:  '嵐',
  tornado: '竜巻',
};

export default function ResultDisplay({ result }: Props) {
  const { freeWeather, decision, premiumWeather, paid } = result;

  return (
    <div style={card}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#fff' }}>
        結果
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Free weather */}
        <div>
          <p style={sectionTitle}>天気情報（Free）</p>
          <p style={{ fontSize: '1.4rem' }}>
            {weatherIcon[freeWeather.weather]} {weatherJa[freeWeather.weather] ?? freeWeather.weather}
          </p>
        </div>

        {/* AI Decision */}
        <div>
          <p style={sectionTitle}>Claudeの判断</p>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: decision.buy ? '#40c080' : '#f09040',
          }}>
            {decision.buy ? 'Buy' : 'Skip'}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.25rem' }}>
            {decision.reason}
          </p>
        </div>

        {/* Payment status */}
        <div>
          <p style={sectionTitle}>決済</p>
          <p style={{ fontSize: '0.95rem', color: paid ? '#40a0f0' : '#888' }}>
            {paid ? 'x402で支払い済み（Base Sepolia）' : '支払いなし'}
          </p>
        </div>

        {/* Premium weather */}
        {premiumWeather && (
          <div>
            <p style={sectionTitle}>プレミアムデータ</p>
            <p style={{ fontSize: '0.95rem', color: '#e0e0e0' }}>
              {premiumWeather.temperature}°C &nbsp;|&nbsp; 降水確率 {premiumWeather.rain_probability}%
            </p>
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
              {premiumWeather.detail}
            </p>
            <p style={{ fontSize: '0.85rem', color: '#f0c040', marginTop: '0.4rem', fontWeight: 500 }}>
              {premiumWeather.advice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
